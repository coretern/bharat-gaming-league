import { User } from '@/models/User';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { Tournament } from '@/models/Tournament';
import { v2 as cloudinary } from 'cloudinary';
import { addLog } from '@/lib/logger';
import { checkRateLimit, getRequestIP } from '@/lib/rate-limit';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per 60 seconds per IP
    const ip = getRequestIP(req);
    const rl = checkRateLimit(`register:${ip}`, { limit: 5, windowSec: 60 });
    if (!rl.allowed) {
      return NextResponse.json({ error: `Too many requests. Try again in ${rl.retryAfterSec}s.` }, { status: 429 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: 'You must be logged in to register.' }, { status: 401 });
    }

    const formData = await req.formData();
    const matchType = formData.get('matchType') as string;
    const teamName = formData.get('teamName') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const instagram = formData.get('instagram') as string;
    const tournamentId = formData.get('tournamentId') as string;
    const tournamentName = formData.get('tournamentName') as string;
    const entryFeeStr = formData.get('entryFee') as string || '0';

    const orderAmount = parseFloat(entryFeeStr.replace(/[^\d.]/g, '')) || 0;
    const cleanPhone = whatsapp.replace(/\D/g, '').slice(-10);

    if (!teamName || !whatsapp || !tournamentId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (cleanPhone.length !== 10) {
      return NextResponse.json({ error: 'Please provide a valid 10-digit WhatsApp number.' }, { status: 400 });
    }

    // Helper to upload to Cloudinary
    const uploadToCloudinary = async (file: File, folder: string) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder }, (error, res) => {
          if (error) reject(error);
          else resolve(res);
        }).end(buffer);
      });
      return result.secure_url;
    };

    // Handle Players (Solo/Duo/Squad)
    const players: any[] = [];
    const playerCount = matchType === 'Solo' ? 1 : matchType === 'Duo' ? 2 : 4;

    for (let i = 0; i < playerCount; i++) {
        const pName = formData.get(`playerName_${i}`) as string;
        const pUid = formData.get(`playerUid_${i}`) as string;
        const pInstagram = formData.get(`playerInstagram_${i}`) as string;
        
        players.push({ name: pName, uid: pUid, instagram: pInstagram });
    }

    // Handle Payout Details from User Profile
    await connectDB();
    const userProfile = await User.findOne({ email: token.email });
    const payoutDetails = { qrCodeUrl: userProfile?.paymentQrUrl || '' };
    
    // Fetch tournament to get game type for group size
    const tournament = await Tournament.findOne({ id: tournamentId });
    
    // Dynamically determine group size from tournament.slots
    // If slots is "0/48" or just "48", we want the 48.
    let groupSize = (tournament?.game === 'BGMI') ? 94 : 48;
    if (tournament?.slots) {
      const parts = tournament.slots.split('/');
      const totalPart = parts[parts.length - 1].trim(); // Get the last part (denominator)
      const parsed = parseInt(totalPart);
      if (!isNaN(parsed) && parsed > 0) {
        groupSize = parsed;
      }
    }
    
    const currentCount = await Registration.countDocuments({ tournamentId });
    const groupNumber = Math.floor(currentCount / groupSize) + 1;
    const slotNumber = (currentCount % groupSize) + 1;

    const orderId = `BGL_ORD_${Date.now()}`;

    // Create Cashfree Order
    let paymentSessionId = '';
    if (orderAmount > 0) {
      try {
        const cfResponse = await fetch(`${process.env.CASHFREE_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'x-client-id': process.env.CASHFREE_APP_ID!,
            'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
            'x-api-version': '2023-08-01',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_id: orderId,
            order_amount: orderAmount,
            order_currency: 'INR',
            customer_details: {
              customer_id: token.sub || token.email,
              customer_email: token.email,
              customer_phone: cleanPhone,
              customer_name: token.name || 'Gamer'
            },
            order_meta: {
              return_url: `${process.env.NEXTAUTH_URL}/dashboard?order_id={order_id}`
            }
          })
        });

        const cfData = await cfResponse.json();
        if (!cfResponse.ok) throw new Error(cfData.message || 'Payment initiation failed');
        paymentSessionId = cfData.payment_session_id;
      } catch (cfErr: any) {
        return NextResponse.json({ error: `Payment Error: ${cfErr.message}` }, { status: 500 });
      }
    }

    const registration = await Registration.create({
      userId: token.sub || token.email,
      userName: token.name || 'Unknown',
      userEmail: token.email,
      userImage: token.picture || '',
      tournamentId,
      tournamentName,
      game: tournament?.game,
      matchType,
      teamName,
      whatsapp,
      instagram,
      players,
      payoutDetails,
      orderId,
      groupNumber,
      slotNumber,
      paymentStatus: orderAmount > 0 ? 'Pending' : 'Paid',
      paymentVerified: orderAmount === 0
    });

    await addLog({
      action: 'New registration', category: 'registration',
      details: `${teamName} registered for ${tournamentName} (${matchType})`,
      performedBy: token.email as string,
      targetName: teamName,
    });

    return NextResponse.json({ success: true, paymentSessionId, orderId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const registrationId = formData.get('registrationId') as string;
    
    await connectDB();
    const existing = await Registration.findById(registrationId);
    
    if (!existing || existing.userEmail !== token.email) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Only allow update if not already approved
    if (existing.status === 'Approved') {
        return NextResponse.json({ error: 'Cannot update an approved registration' }, { status: 400 });
    }

    const matchType = formData.get('matchType') as string;
    const teamName = formData.get('teamName') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const instagram = formData.get('instagram') as string;

    // Helper to upload to Cloudinary inside PUT
    const uploadToCloudinary = async (file: File, folder: string) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder }, (error, res) => {
                if (error) reject(error);
                else resolve(res);
            }).end(buffer);
        });
        return result.secure_url;
    };

    const players: any[] = [];
    const playerCount = matchType === 'Solo' ? 1 : matchType === 'Duo' ? 2 : 4;

    for (let i = 0; i < playerCount; i++) {
        const pName = formData.get(`playerName_${i}`) as string;
        const pUid = formData.get(`playerUid_${i}`) as string;
        const pInstagram = formData.get(`playerInstagram_${i}`) as string;
        
        players.push({ name: pName, uid: pUid, instagram: pInstagram });
    }

    // Payout details handled from profile during registration
    const userProfile = await User.findOne({ email: token.email });
    let qrCodeUrl = existing.payoutDetails?.qrCodeUrl || userProfile?.paymentQrUrl || '';

    let paymentSessionId = '';
    let orderId = existing.orderId;

    if (!existing.paymentVerified) {
        // If not paid yet, we might need a new payment session
        // Only if the fee is > 0
        const entryFeeStr = formData.get('entryFee') as string;
        const orderAmount = parseInt(entryFeeStr.replace('₹', ''));

        if (orderAmount > 0) {
            orderId = `BGL_ORD_${Date.now()}`;
            try {
                const cfResponse = await fetch('https://sandbox.cashfree.com/pg/orders', {
                    method: 'POST',
                    headers: {
                        'x-api-version': '2023-08-01',
                        'x-client-id': process.env.CASHFREE_APP_ID || '',
                        'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order_id: orderId,
                        order_amount: orderAmount,
                        order_currency: 'INR',
                        customer_details: {
                            customer_id: token.sub || token.email,
                            customer_email: token.email,
                            customer_phone: whatsapp.replace(/\D/g, '').slice(-10) || '0000000000',
                            customer_name: token.name || 'Gamer'
                        },
                        order_meta: {
                            return_url: `${process.env.NEXTAUTH_URL}/dashboard?order_id={order_id}`
                        }
                    })
                });
                const cfData = await cfResponse.json();
                if (cfResponse.ok) paymentSessionId = cfData.payment_session_id;
            } catch (err) {
                console.error('Payment Error in PUT:', err);
            }
        }
    }

    await Registration.findByIdAndUpdate(registrationId, {
        $set: {
            matchType,
            teamName,
            whatsapp,
            instagram,
            players,
            'payoutDetails.qrCodeUrl': qrCodeUrl,
            status: 'Pending', // Reset status
            rejectionReason: '', // Clear current reason for user
            rejectionTargets: [],
            rejectionIndices: [],
            previousRejectionReason: existing.rejectionReason, // Save old reason
            isResubmitted: true,
            orderId: orderId, // Update order ID if new payment session created
        }
    });

    return NextResponse.json({ success: true, paymentSessionId, orderId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const registrations = await Registration.find().sort({ createdAt: -1 }).lean();
    console.log('Sample Registration:', registrations[0]?.teamName, 'Group:', registrations[0]?.groupNumber);
    return NextResponse.json(registrations);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

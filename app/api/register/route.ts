import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    console.log('=== REGISTER API HIT ===');

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('Token email:', token?.email);

    if (!token?.email) {
      console.log('No token — returning 401');
      return NextResponse.json({ error: 'You must be logged in to register.' }, { status: 401 });
    }

    const formData = await req.formData();
    const teamName = formData.get('teamName') as string;
    const leaderUid = formData.get('leaderUid') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const tournamentId = formData.get('tournamentId') as string;
    const tournamentName = formData.get('tournamentName') as string;
    const entryFeeStr = formData.get('entryFee') as string || '0'; 
    const file = formData.get('profileScreenshot') as File | null;

    // Parse numeric fee from strings like "₹200 / Team"
    const orderAmount = parseFloat(entryFeeStr.replace(/[^\d.]/g, '')) || 0;
    const cleanPhone = whatsapp.replace(/\D/g, '').slice(-10);

    console.log('Fields:', { teamName, leaderUid, whatsapp, cleanPhone, tournamentId, orderAmount });

    if (!teamName || !leaderUid || !whatsapp || !tournamentId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (cleanPhone.length !== 10) {
      return NextResponse.json({ error: 'Please provide a valid 10-digit WhatsApp number.' }, { status: 400 });
    }

    let profileScreenshotUrl = '';

    if (file && file.size > 0 && process.env.CLOUDINARY_CLOUD_NAME) {
      console.log('Uploading profile screenshot to Cloudinary...');
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'arenax/profiles' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        profileScreenshotUrl = result.secure_url;
        console.log('Cloudinary URL:', profileScreenshotUrl);
      } catch (cloudErr: any) {
        console.error('Cloudinary error (skipping):', cloudErr.message);
      }
    }

    await connectDB();
    
    // Create a unique order ID
    const orderId = `BGL_ORD_${Date.now()}`;

    // Create Cashfree Order
    let paymentSessionId = '';
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
      if (!cfResponse.ok) {
        console.error('Cashfree Error:', cfData);
        throw new Error(cfData.message || 'Payment initiation failed');
      }
      paymentSessionId = cfData.payment_session_id;
    } catch (cfErr: any) {
      console.error('Cashfree Integration Error:', cfErr.message);
      return NextResponse.json({ error: `Payment Error: ${cfErr.message}` }, { status: 500 });
    }

    console.log('DB connected, creating pending registration...');

    const registration = await Registration.create({
      userId: token.sub || token.email,
      userName: token.name || 'Unknown',
      userEmail: token.email,
      userImage: token.picture || '',
      tournamentId,
      tournamentName,
      teamName,
      leaderUid,
      whatsapp,
      paymentScreenshot: profileScreenshotUrl, // Actually profile screenshot now
      orderId: orderId,
      paymentStatus: 'Pending',
    });

    console.log('✅ Registration saved! ID:', registration._id.toString());
    return NextResponse.json({ 
      success: true, 
      id: registration._id, 
      paymentSessionId,
      orderId
    });
  } catch (err: any) {
    console.error('❌ REGISTRATION ERROR:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const registrations = await Registration.find().sort({ createdAt: -1 }).lean();
    console.log('Fetched count:', registrations.length);
    return NextResponse.json(registrations);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

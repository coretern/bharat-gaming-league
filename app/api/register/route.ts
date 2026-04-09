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
    const file = formData.get('paymentScreenshot') as File | null;

    console.log('Fields:', { teamName, leaderUid, whatsapp, tournamentId });

    if (!teamName || !leaderUid || !whatsapp || !tournamentId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    let paymentScreenshotUrl = '';

    if (file && file.size > 0 && process.env.CLOUDINARY_CLOUD_NAME) {
      console.log('Uploading to Cloudinary...');
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'arenax/payments' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        paymentScreenshotUrl = result.secure_url;
        console.log('Cloudinary URL:', paymentScreenshotUrl);
      } catch (cloudErr: any) {
        console.error('Cloudinary error (skipping):', cloudErr.message);
      }
    }

    await connectDB();
    console.log('DB connected, creating registration...');

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
      paymentScreenshot: paymentScreenshotUrl,
    });

    console.log('✅ Registration saved! ID:', registration._id.toString());
    return NextResponse.json({ success: true, id: registration._id });
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

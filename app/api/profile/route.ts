import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { v2 as cloudinary } from 'cloudinary';
import { checkRateLimit, getRequestIP } from '@/lib/rate-limit';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** GET /api/profile — Fetch current user gaming profile */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findOne({ email: token.email }).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      name: user.name || '',
      email: user.email || '',
      image: user.image || '',
      teamName: user.teamName || '',
      gameIGN: user.gameIGN || '',
      whatsapp: user.whatsapp || '',
      instagram: user.instagram || '',
      paymentQrUrl: user.paymentQrUrl || '',
      savedPlayers: user.savedPlayers || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** Helper to upload buffer to Cloudinary */
async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    ).end(buffer);
  });
}

/** PUT /api/profile — Update gaming profile with optional file uploads */
export async function PUT(req: NextRequest) {
  try {
    const ip = getRequestIP(req);
    const rl = checkRateLimit(`profile:${ip}`, { limit: 10, windowSec: 60 });
    if (!rl.allowed) {
      return NextResponse.json({ error: `Too many requests. Try again in ${rl.retryAfterSec}s.` }, { status: 429 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const formData = await req.formData();
    const name = formData.get('name') as string || '';
    const teamName = formData.get('teamName') as string || '';
    const gameIGN = formData.get('gameIGN') as string || '';
    const whatsapp = formData.get('whatsapp') as string || '';
    const instagram = formData.get('instagram') as string || '';

    const updateData: Record<string, any> = { name, teamName, gameIGN, whatsapp, instagram };

    // Handle saved players
    const savedPlayersRaw = formData.get('savedPlayers') as string;
    if (savedPlayersRaw) {
      try {
        updateData.savedPlayers = JSON.parse(savedPlayersRaw);
      } catch { /* ignore parse error */ }
    }

    // Handle QR upload
    const qrFile = formData.get('paymentQr') as File | null;
    if (qrFile && qrFile.size > 0) {
      const buffer = Buffer.from(await qrFile.arrayBuffer());
      updateData.paymentQrUrl = await uploadToCloudinary(buffer, 'arenax/profile/qr');
    }



    const user = await User.findOneAndUpdate(
      { email: token.email },
      { $set: updateData },
      { new: true }
    );

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      name: user.name,
      teamName: user.teamName,
      gameIGN: user.gameIGN,
      whatsapp: user.whatsapp,
      instagram: user.instagram,
      paymentQrUrl: user.paymentQrUrl,
      savedPlayers: user.savedPlayers || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

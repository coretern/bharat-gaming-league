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

/**
 * POST /api/admin/winner-screenshot
 * Uploads a winner screenshot and assigns it to ALL teams in the same group.
 * So both winners and losers can see the proof.
 */
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const userEmail = (token?.email as string || '').toLowerCase();

    if (!token || userEmail !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('screenshot') as File;
    const registrationId = formData.get('registrationId') as string;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No screenshot file provided' }, { status: 400 });
    }

    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 });
    }

    await connectDB();

    // Find the registration to get tournament and group info
    const reg = await Registration.findById(registrationId);
    if (!reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'arenax/winner-proof' },
        (error, res) => {
          if (error) reject(error);
          else resolve(res);
        }
      ).end(buffer);
    });

    const screenshotUrl = result.secure_url;

    // Update ALL teams in the same tournament + group with the winner screenshot
    const updateResult = await Registration.updateMany(
      {
        tournamentId: reg.tournamentId,
        groupNumber: reg.groupNumber
      },
      { $set: { winnerScreenshot: screenshotUrl } }
    );

    console.log(`📸 Winner screenshot uploaded for ${reg.tournamentName} G${reg.groupNumber}: ${screenshotUrl} (${updateResult.modifiedCount} teams updated)`);

    return NextResponse.json({
      success: true,
      url: screenshotUrl,
      updatedCount: updateResult.modifiedCount
    });
  } catch (err: any) {
    console.error('Winner screenshot upload error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

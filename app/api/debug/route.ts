import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return NextResponse.json({
    token,
    adminEmail: process.env.ADMIN_EMAIL,
    isAdmin: (token?.email || '').toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase(),
    mongoUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    cloudinaryCloud: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
  });
}

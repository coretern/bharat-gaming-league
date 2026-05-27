import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { OTPVerification } from '@/models/OTPVerification';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    await connectDB();

    const verificationRecord = await OTPVerification.findOne({ email: cleanEmail });
    if (!verificationRecord) {
      return NextResponse.json({ error: 'Verification request not found. Please request a new code.' }, { status: 400 });
    }

    // Check if expired
    if (new Date() > new Date(verificationRecord.expiresAt)) {
      return NextResponse.json({ error: 'OTP has expired. Please sign up again to receive a new code.' }, { status: 400 });
    }

    // Check if OTP matches
    if (verificationRecord.otp !== otp.trim()) {
      return NextResponse.json({ error: 'Invalid verification OTP code' }, { status: 400 });
    }

    // Double check if user was created by another parallel process
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400 });
    }

    // Create user in User collection
    await User.create({
      email: cleanEmail,
      password: verificationRecord.password,
      provider: 'credentials',
      firstLoginAt: new Date(),
      lastLoginAt: new Date(),
      loginCount: 1,
      isBanned: false,
      phoneNumber: verificationRecord.phoneNumber || '',
    });

    // Delete verification record
    await OTPVerification.deleteOne({ email: cleanEmail });

    return NextResponse.json({ success: true, message: 'Account verified and created successfully' });
  } catch (err: any) {
    console.error('Signup verification error:', err);
    return NextResponse.json({ error: 'Failed to verify account' }, { status: 500 });
  }
}

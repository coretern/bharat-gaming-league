import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { OTPVerification } from '@/models/OTPVerification';
import { sendOTPEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, phoneNumber } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      if (!existingUser.password) {
        return NextResponse.json({ 
          error: 'This email is already registered using Google login. Please sign in with Google directly.' 
        }, { status: 400 });
      }
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert the verification document
    await OTPVerification.findOneAndUpdate(
      { email: cleanEmail },
      { password: hashedPassword, otp, expiresAt, phoneNumber },
      { upsert: true, new: true }
    );

    // Send email
    await sendOTPEmail(cleanEmail, otp, 'Verify your email - BGL Esports');

    return NextResponse.json({ success: true, message: 'OTP verification code sent' });
  } catch (err: any) {
    console.error('Signup initialization error:', err);
    return NextResponse.json({ error: 'Failed to process signup request' }, { status: 500 });
  }
}

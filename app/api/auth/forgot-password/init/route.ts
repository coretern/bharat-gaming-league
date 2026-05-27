import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { sendOTPEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    await connectDB();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return NextResponse.json({ error: 'No account registered with this email address' }, { status: 404 });
    }

    // Verify if it's an OAuth user
    if (!user.password) {
      return NextResponse.json({ 
        error: 'This account was created with Google login. Please sign in with Google directly.' 
      }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save to user model
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send email
    await sendOTPEmail(cleanEmail, otp, 'Reset your password - BGL Esports');

    return NextResponse.json({ success: true, message: 'Password reset OTP code sent successfully' });
  } catch (err: any) {
    console.error('Forgot password init error:', err);
    return NextResponse.json({ error: 'Failed to request password reset' }, { status: 500 });
  }
}

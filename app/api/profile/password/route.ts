import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { sendOTPEmail } from '@/lib/mail';
import { checkRateLimit, getRequestIP } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const ip = getRequestIP(req);
    const rl = checkRateLimit(`profile-password:${ip}`, { limit: 5, windowSec: 60 });
    if (!rl.allowed) {
      return NextResponse.json({ error: `Too many requests. Try again in ${rl.retryAfterSec}s.` }, { status: 429 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    await connectDB();
    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'send-otp') {
      // Generate a 6-digit random OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // Send the email
      await sendOTPEmail(token.email, otp, 'Set Your Account Password - BGL Esports');

      return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    }

    if (action === 'set-password') {
      const { otp, password, confirmPassword } = body;

      if (!otp || !password || !confirmPassword) {
        return NextResponse.json({ error: 'OTP, password, and confirm password are required' }, { status: 400 });
      }

      if (password !== confirmPassword) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
      }

      // Verify OTP code
      if (!user.otp || user.otp !== otp.trim()) {
        return NextResponse.json({ error: 'Invalid verification OTP code' }, { status: 400 });
      }

      if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
        return NextResponse.json({ error: 'OTP has expired. Please request a new code.' }, { status: 400 });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Save new password and clear OTP
      user.password = hashedPassword;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      return NextResponse.json({ success: true, message: 'Password configured successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Profile password API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await connectDB();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'GOOGLE_LOGIN_REQUIRED' }, { status: 400 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'BAN_ACTIVE' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'INVALID_PASSWORD' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name || user.email.split('@')[0],
        email: user.email,
        role: user.role || 'user',
      }
    });
  } catch (err: any) {
    console.error('Mobile credentials login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

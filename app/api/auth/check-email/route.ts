import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailInput = searchParams.get('email');

    if (!emailInput) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const email = emailInput.toLowerCase().trim();

    await connectDB();
    const user = await User.findOne({ email }).select('provider password').lean();

    if (!user) {
      return NextResponse.json({ exists: false, provider: null });
    }

    // If password is not set or provider is explicitly 'google', it's a Google OAuth account
    const provider = (!user.password || user.provider === 'google') ? 'google' : 'credentials';

    return NextResponse.json({
      exists: true,
      provider,
    });
  } catch (error: any) {
    console.error('Error checking email registration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mobileCallback = searchParams.get('callback');
  
  if (!mobileCallback) {
    return NextResponse.json({ error: 'Missing callback URL' }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  // We use a bridge route to capture the session and redirect back to mobile
  const bridgeUrl = `${baseUrl}/api/mobile-auth/callback?mobile_url=${encodeURIComponent(mobileCallback)}`;
  
  // Redirect to real Google Sign-In
  return NextResponse.redirect(`${baseUrl}/api/auth/signin/google?callbackUrl=${encodeURIComponent(bridgeUrl)}`);
}

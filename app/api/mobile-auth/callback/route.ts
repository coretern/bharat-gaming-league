import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mobileUrl = searchParams.get('mobile_url');
  
  if (!mobileUrl) {
    return NextResponse.json({ error: 'Missing mobile callback URL' }, { status: 400 });
  }

  // Get the session token from the backend
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.email) {
    // If no session, redirect back to mobile login with error
    return NextResponse.redirect(`${mobileUrl}?error=auth_failed`);
  }

  // Redirect back to the mobile app with user details
  const redirectUrl = new URL(mobileUrl);
  redirectUrl.searchParams.set('email', token.email);
  if (token.name) redirectUrl.searchParams.set('name', token.name);
  
  return NextResponse.redirect(redirectUrl.toString());
}

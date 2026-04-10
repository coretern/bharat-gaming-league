import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // Check if requester is admin
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const requesterEmail = (token?.email as string || '').toLowerCase();

    if (!token || requesterEmail !== adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (email.toLowerCase() === adminEmail) {
      return NextResponse.json({ error: 'Cannot delete the main admin account' }, { status: 403 });
    }

    await connectDB();
    const deleted = await User.findOneAndDelete({ email: email.toLowerCase() });

    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

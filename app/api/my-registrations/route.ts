import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const emailParam = req.nextUrl.searchParams.get('email');
    const isAdmin = (token as any)?.isAdmin === true;
    const targetEmail = (isAdmin && emailParam) ? emailParam : token.email;

    await connectDB();
    const registrations = await Registration.find({ userEmail: targetEmail }).sort({ createdAt: -1 }).lean();
    
    // Explicitly verify fields are present
    const sanitized = registrations.map((r: any) => ({
        ...r,
        matchDate: r.matchDate || '',
        matchTime: r.matchTime || '',
        rejectionReason: r.rejectionReason || '',
        rejectionTargets: r.rejectionTargets || [],
        winnerTeamName: r.winnerTeamName || '',
        winnerScreenshot: r.winnerScreenshot || '',
        roomId: r.roomId || '',
        roomPassword: r.roomPassword || '',
        orderId: r.orderId || '',
    }));

    return NextResponse.json(sanitized);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

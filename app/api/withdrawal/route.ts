import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch all registrations for this user
    const regs = await Registration.find({ userEmail: token.email }).sort({ createdAt: -1 }).lean() as any[];

    let totalSpend = 0;
    let totalEarning = 0;

    const history = regs.map((reg) => {
      // Calculate entry fee: use saved entryFee or fallback based on matchType
      const isPaid = reg.paymentVerified || reg.paymentStatus === 'Paid';
      let spend = 0;
      if (isPaid) {
        if (reg.entryFee !== undefined && reg.entryFee > 0) {
          spend = reg.entryFee;
        } else {
          // Dynamic fallback for pre-existing records
          spend = reg.matchType === 'Solo' ? 36 : reg.matchType === 'Duo' ? 72 : 144;
        }
        totalSpend += spend;
      } else {
        spend = reg.matchType === 'Solo' ? 36 : reg.matchType === 'Duo' ? 72 : 144;
      }

      const earning = reg.resultStatus === 'Won' ? (reg.prizeAmount || 0) : 0;
      totalEarning += earning;

      return {
        id: reg._id.toString(),
        tournamentName: reg.tournamentName,
        matchType: reg.matchType,
        teamName: reg.teamName,
        groupNumber: reg.groupNumber,
        slotNumber: reg.slotNumber,
        spend,
        earning,
        status: reg.status,
        paymentStatus: reg.paymentStatus,
        paymentVerified: reg.paymentVerified,
        resultStatus: reg.resultStatus,
        createdAt: reg.createdAt,
        matchDate: reg.matchDate,
        matchTime: reg.matchTime,
      };
    });

    return NextResponse.json({
      success: true,
      totalSpend,
      totalEarning,
      history,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAdmin = (token as any)?.isAdmin === true;
    
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const tournamentIds = await Registration.distinct('tournamentId');
    let totalUpdated = 0;

    for (const tId of tournamentIds) {
      // Find the tournament to get its slots configuration
      const { Tournament } = await import('@/models/Tournament');
      const tournament = await Tournament.findOne({ id: tId });
      
      // Determine group size (fallback to game-specific defaults if parsing fails)
      let groupSize = (tournament?.game === 'BGMI') ? 94 : 48;
      if (tournament?.slots) {
        const parts = tournament.slots.split('/');
        const totalPart = parts[parts.length - 1].trim();
        const parsed = parseInt(totalPart);
        if (!isNaN(parsed) && parsed > 0) groupSize = parsed;
      }

      const regs = await Registration.find({ tournamentId: tId }).sort({ createdAt: 1 });
      
      for (let i = 0; i < regs.length; i++) {
        await Registration.findByIdAndUpdate(regs[i]._id, {
          $set: {
            groupNumber: Math.floor(i / groupSize) + 1,
            slotNumber: (i % groupSize) + 1
          }
        });
        totalUpdated++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synchronized ${totalUpdated} registrations.`,
      count: totalUpdated
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

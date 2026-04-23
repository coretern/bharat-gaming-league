import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';

/** GET /api/past-tournaments — Fetch completed tournament groups with winner data */
export async function GET() {
  try {
    await connectDB();

    // Find all registrations that have a winner declared
    const wonRegs = await Registration.find(
      { resultStatus: 'Won' },
      'tournamentName tournamentId game matchType teamName prizeAmount groupNumber matchDate matchTime winnerScreenshot players createdAt'
    ).sort({ createdAt: -1 }).lean();

    // Group by tournament
    const tournaments: Record<string, any> = {};
    wonRegs.forEach((reg: any) => {
      const key = reg.tournamentId || reg.tournamentName;
      if (!tournaments[key]) {
        tournaments[key] = {
          name: reg.tournamentName,
          game: reg.game || 'BGMI',
          groups: [],
        };
      }
      tournaments[key].groups.push({
        groupNumber: reg.groupNumber,
        winnerTeam: reg.teamName,
        prize: reg.prizeAmount,
        matchType: reg.matchType,
        matchDate: reg.matchDate,
        screenshot: reg.winnerScreenshot || '',
        playerCount: reg.players?.length || 1,
      });
    });

    const result = Object.values(tournaments);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

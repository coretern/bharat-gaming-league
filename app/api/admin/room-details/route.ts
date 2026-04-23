import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { addLog } from '@/lib/logger';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/** PATCH — Push room ID & password to all teams in a group */
export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email || token.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { tournamentId, tournamentName, groupNumber, roomId, roomPassword } = await req.json();

    if (!groupNumber || !roomId) {
      return NextResponse.json({ error: 'Room ID and group number are required' }, { status: 400 });
    }

    const query: any = { groupNumber: { $in: [Number(groupNumber), String(groupNumber)] } };
    if (tournamentId) query.tournamentId = tournamentId;
    else if (tournamentName) query.tournamentName = { $regex: new RegExp(tournamentName.trim(), 'i') };

    const result = await Registration.updateMany(query, { $set: { roomId, roomPassword: roomPassword || '' } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'No teams found for this group' }, { status: 404 });
    }

    await addLog({
      action: 'Room details shared', category: 'schedule',
      details: `Room "${roomId}" sent to Group ${groupNumber} (${result.matchedCount} teams)`,
      performedBy: token.email as string,
      targetName: `G${groupNumber}`,
    });

    return NextResponse.json({ success: true, updatedCount: result.matchedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const userEmail = (token?.email as string || '').toLowerCase();

    if (!token || userEmail !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const { tournamentId, tournamentName, groupNumber, matchDate, matchTime } = await req.json();

    if ((!tournamentName && !tournamentId) || !groupNumber) {
      return NextResponse.json({ error: 'Missing tournament or group' }, { status: 400 });
    }

    // Flexible query matching for both string and number group numbers
    const query: any = { 
      groupNumber: { $in: [Number(groupNumber), groupNumber.toString()] }
    };
    
    // Improved tournament validation
    if (tournamentId && tournamentId.trim() !== '' && tournamentId !== 'undefined' && tournamentId !== 'null') {
      query.tournamentId = tournamentId;
    } else if (tournamentName && tournamentName.trim() !== '') {
      query.tournamentName = { $regex: new RegExp(`^${tournamentName.trim()}$`, 'i') };
    }

    console.log('[BulkSchedule] Query:', JSON.stringify(query));
    console.log('[BulkSchedule] Payload:', { matchDate, matchTime });

    const result = await Registration.updateMany(
      query,
      { $set: { matchDate, matchTime } }
    );

    // Fetch the updated registrations to confirm and show names
    const updatedTeams = await Registration.find(query, 'teamName').lean();
    const teamNames = updatedTeams.map(t => t.teamName);

    console.log('[BulkSchedule] Updated Teams:', teamNames);

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No matching registrations found to update.',
        debug: { query }
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      matchedCount: result.matchedCount, 
      modifiedCount: result.modifiedCount,
      updatedTeams: teamNames
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

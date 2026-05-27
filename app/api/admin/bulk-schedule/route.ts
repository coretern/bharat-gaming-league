import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { addLog } from '@/lib/logger';

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
    // Build a very loose query to ensure we find the teams
    const tournamentNameClean = tournamentName?.trim() || '';
    
    // We'll use a loose filter for the tournament to avoid character encoding or space issues
    const query: any = { 
      groupNumber: { $in: [Number(groupNumber), String(groupNumber)] }
    };

    const tournamentFilters = [];
    if (tournamentId && tournamentId !== 'undefined' && tournamentId !== 'null') {
      tournamentFilters.push({ tournamentId: tournamentId });
    }
    if (tournamentNameClean !== '') {
      // Loose regex match for the tournament name
      tournamentFilters.push({ tournamentName: { $regex: new RegExp(tournamentNameClean, 'i') } });
    }

    if (tournamentFilters.length > 0) {
      query.$or = tournamentFilters;
    }

    console.log('[BulkSchedule] DEBUG Query:', JSON.stringify(query));

    const result = await Registration.updateMany(
      query,
      { $set: { matchDate, matchTime } }
    );

    if (result.matchedCount === 0) {
      // Find what DOES exist for this tournament to help debug
      const similar = await Registration.findOne({ 
        tournamentName: { $regex: new RegExp(tournamentNameClean, 'i') } 
      }).select('groupNumber tournamentName tournamentId');

      return NextResponse.json({ 
        success: false, 
        error: `No teams found for Group ${groupNumber} in "${tournamentNameClean}". ` + 
               (similar ? `Found teams in this tournament with Group Number: ${similar.groupNumber}.` : `No teams found for this tournament name at all.`),
        debug: { query, foundSimilar: similar }
      }, { status: 404 });
    }

    // Fetch the updated registrations to confirm and show names
    const updatedTeams = await Registration.find(query, 'teamName').lean();
    const teamNames = updatedTeams.map(t => t.teamName);
    
    await addLog({
      action: 'Scheduled group', category: 'schedule',
      details: `Group ${groupNumber} of ${tournamentNameClean} → ${matchDate} @ ${matchTime || 'TBA'} (${result.matchedCount} teams)`,
      performedBy: userEmail,
      targetName: `G${groupNumber} - ${tournamentNameClean}`,
    });

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

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
      const regs = await Registration.find({ tournamentId: tId }).sort({ createdAt: 1 });
      
      for (let i = 0; i < regs.length; i++) {
        await Registration.findByIdAndUpdate(regs[i]._id, {
          $set: {
            itemNumber: i + 1, // Store absolute serial number too
            groupNumber: Math.floor(i / 48) + 1,
            slotNumber: (i % 48) + 1
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

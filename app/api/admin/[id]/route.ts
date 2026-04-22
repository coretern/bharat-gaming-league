import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { addLog } from '@/lib/logger';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const userEmail = (token?.email as string || '').toLowerCase();

    if (!token || userEmail !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const reg = await Registration.findByIdAndUpdate(
      id, 
      { $set: body }, 
      { new: true, runValidators: true }
    );
    if (!reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Special logic for marking a winner
    if (body.resultStatus === 'Won' && reg.tournamentId && reg.groupNumber) {
        // Mark all others in the same tournament and same group as "Lost"
        await Registration.updateMany(
            { 
              _id: { $ne: reg._id },
              tournamentId: reg.tournamentId,
              groupNumber: reg.groupNumber,
              status: 'Approved'
            },
            { $set: { resultStatus: 'Lost', prizeAmount: 0, winnerTeamName: reg.teamName } }
        );
        console.log(`🏆 Group Winner set: ${reg.teamName} in G${reg.groupNumber} T:${reg.tournamentId}`);
    }

    console.log(`✅ Admin updated registration ${id}:`, body);

    // Log activity
    const action = body.status === 'Approved' ? 'Approved registration' 
      : body.status === 'Rejected' ? 'Rejected registration'
      : body.resultStatus === 'Won' ? 'Set winner'
      : 'Updated registration';
    await addLog({
      action, category: body.resultStatus ? 'winner' : 'registration',
      details: JSON.stringify(body),
      performedBy: userEmail,
      targetId: id,
      targetName: reg.teamName,
    });

    return NextResponse.json(reg);
  } catch (err: any) {
    console.error('Admin PATCH error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const userEmail = (token?.email as string || '').toLowerCase();

    if (!token || userEmail !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const deleted = await Registration.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    console.log(`🗑️ Admin deleted registration ${id}`);
    await addLog({
      action: 'Deleted registration', category: 'registration',
      details: `Team: ${deleted.teamName}`,
      performedBy: userEmail, targetId: id, targetName: deleted.teamName,
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

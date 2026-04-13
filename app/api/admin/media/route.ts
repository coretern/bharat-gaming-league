import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { getToken } from 'next-auth/jwt';

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!(token as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { regId, fieldKey } = await req.json();

    await connectDB();
    const reg = await Registration.findById(regId);
    if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });

    const update: any = {};
    if (fieldKey === 'qr') {
      update['payoutDetails.qrCodeUrl'] = '';
    } else if (fieldKey.startsWith('p')) {
      const index = parseInt(fieldKey.replace('p', ''));
      const players = [...reg.players];
      if (players[index]) {
        players[index].profileScreenshot = '';
        update['players'] = players;
      }
    }

    await Registration.findByIdAndUpdate(regId, { $set: update });

    return NextResponse.json({ success: true, message: 'Media removed from registration' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

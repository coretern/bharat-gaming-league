import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Tournament } from '@/models/Tournament';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: slug } = await params;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!(token as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const { _id, id: bodySlug, allowedMatchTypes, ...rest } = body;
    
    // Explicitly build update object to avoid any missing fields
    const updateData: any = { ...rest };
    if (allowedMatchTypes) updateData.allowedMatchTypes = allowedMatchTypes;

    let updated;
    if (_id) {
      updated = await Tournament.findByIdAndUpdate(_id, { $set: updateData }, { new: true });
    } else {
      updated = await Tournament.findOneAndUpdate(
        { id: slug },
        { $set: updateData },
        { new: true }
      );
    }

    if (!updated) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

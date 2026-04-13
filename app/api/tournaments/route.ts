import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Tournament } from '@/models/Tournament';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let list = await Tournament.find().sort({ createdAt: -1 });

    // Seed if empty
    if (list.length === 0) {
      const defaults = [
        {
          id: 'bgmi-pro-league',
          title: 'BGMI Pro Championship',
          game: 'BGMI',
          prizePool: '₹1,00,000',
          date: '15 Oct 2026',
          time: '08:00 PM',
          slots: '12/48',
          image: '/bgmi-thumb.png',
          status: 'Open',
          allowedMatchTypes: ['Solo', 'Duo', 'Squad'],
        },
        {
          id: 'ff-alpha-cups',
          title: 'Free Fire Alpha Elite',
          game: 'Free Fire',
          prizePool: '₹50,000',
          date: '18 Oct 2026',
          time: '04:00 PM',
          slots: '24/100',
          image: '/ff-thumb.png',
          status: 'Open',
          allowedMatchTypes: ['Solo', 'Duo', 'Squad'],
        },
      ];
      await Tournament.insertMany(defaults);
      list = await Tournament.find().sort({ createdAt: -1 });
    }

    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Auto-generate ID if not provided
    if (!body.id) {
      body.id = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }

    const t = await Tournament.create(body);
    return NextResponse.json(t);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

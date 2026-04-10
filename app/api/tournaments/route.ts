import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Tournament } from '@/models/Tournament';

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

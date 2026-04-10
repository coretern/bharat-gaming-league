import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Call Cashfree API to verify the order
    const cfResponse = await fetch(`${process.env.CASHFREE_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        'x-api-version': '2023-08-01'
      }
    });

    const cfData = await cfResponse.json();

    if (!cfResponse.ok) {
      return NextResponse.json({ error: cfData.message || 'Verification failed' }, { status: 500 });
    }

    if (cfData.order_status === 'PAID') {
      await connectDB();
      await Registration.findOneAndUpdate(
        { orderId },
        { paymentStatus: 'Paid', paymentVerified: true }
      );
      return NextResponse.json({ success: true, status: 'PAID' });
    }

    return NextResponse.json({ success: false, status: cfData.order_status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

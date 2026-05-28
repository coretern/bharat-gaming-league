import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';
import { sendTournamentPendingPaymentEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    let token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // Mobile Auth Bypass
    if (!token && req.headers.get('x-mobile-auth') === 'BGL_MOBILE_SECRET_2026') {
      token = { email: req.headers.get('x-user-email') || 'mobile-user@example.com' } as any;
    }

    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const regId = searchParams.get('id');

    if (!regId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
    }

    await connectDB();
    const reg = await Registration.findById(regId);

    if (!reg || reg.userEmail !== token.email) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (reg.paymentVerified) {
      return NextResponse.json({ error: 'Registration is already paid' }, { status: 400 });
    }

    const orderAmount = reg.entryFee || 0;
    if (orderAmount <= 0) {
      return NextResponse.json({ error: 'This tournament is free' }, { status: 400 });
    }

    // Generate new unique orderId for repayment
    const newOrderId = `BGL_ORD_RPY_${Date.now()}`;
    const cleanPhone = reg.whatsapp?.replace(/\D/g, '').slice(-10) || '0000000000';

    const cfResponse = await fetch(`${process.env.CASHFREE_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: newOrderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: {
          customer_id: reg.userId || reg.userEmail,
          customer_email: reg.userEmail,
          customer_phone: cleanPhone,
          customer_name: reg.userName || 'Gamer'
        },
        order_meta: {
          return_url: `${process.env.NEXTAUTH_URL}/dashboard?order_id={order_id}`
        }
      })
    });

    const cfData = await cfResponse.json();
    if (!cfResponse.ok) {
      throw new Error(cfData.message || 'Payment initiation failed');
    }

    // Update registration with new order ID
    reg.orderId = newOrderId;
    await reg.save();

    // Send Pending Payment Email to the user immediately
    await sendTournamentPendingPaymentEmail(reg).catch(err => {
      console.error('Failed to send pending payment email:', err);
    });

    return NextResponse.json({ success: true, paymentSessionId: cfData.payment_session_id, orderId: newOrderId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

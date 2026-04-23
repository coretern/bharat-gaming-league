import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Registration } from '@/models/Registration';

/** GET /api/receipt?id=<registrationId> — Generate HTML payment receipt */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });

    await connectDB();
    const reg = await Registration.findById(id).lean() as any;
    if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });

    // Verify ownership
    if (reg.userEmail !== token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const date = new Date(reg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const playersList = (reg.players || []).map((p: any, i: number) => `
      <tr>
        <td style="padding:6px 12px;border-bottom:1px solid #f1f1f1;font-size:12px;">${i + 1}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f1f1f1;font-size:12px;">${p.name || '—'}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f1f1f1;font-size:12px;">${p.uid || '—'}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>BGL Receipt - ${reg.orderId}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; background: #f8f9fa; color: #1a1a1a; }
  .receipt { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,.05); overflow: hidden; }
  .header { background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%); padding: 32px; text-align: center; color: #fff; }
  .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
  .header p { margin: 4px 0 0; font-size: 11px; opacity: .8; letter-spacing: 3px; text-transform: uppercase; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
  .label { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .value { font-size: 13px; font-weight: 600; color: #1e293b; text-align: right; max-width: 60%; word-break: break-all; }
  .status { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
  .paid { background: #dcfce7; color: #16a34a; }
  .pending { background: #fef3c7; color: #d97706; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { text-align: left; padding: 8px 12px; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; }
  .footer { padding: 20px 32px; background: #f8fafc; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  .download-bar { text-align: center; padding: 16px; }
  .download-btn { display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #1a73e8, #0d47a1); color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
  .download-btn:hover { opacity: .9; }
  @media print { body { padding: 0; background: #fff; } .receipt { box-shadow: none; border: none; } .download-bar { display: none !important; } }
</style>
</head>
<body>
<div class="download-bar">
  <button class="download-btn" onclick="window.print()">⬇ Download as PDF</button>
</div>
<div class="receipt">
  <div class="header">
    <h1>Bharat Gaming League</h1>
    <p>Registration Receipt</p>
  </div>
  <div class="body">
    <div class="row"><span class="label">Receipt No</span><span class="value">${reg.orderId || 'N/A'}</span></div>
    <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
    <div class="row"><span class="label">Tournament</span><span class="value">${reg.tournamentName}</span></div>
    <div class="row"><span class="label">Match Type</span><span class="value">${reg.matchType}</span></div>
    <div class="row"><span class="label">Team Name</span><span class="value">${reg.teamName}</span></div>
    <div class="row"><span class="label">Group / Slot</span><span class="value">G${reg.groupNumber || '—'} / S${reg.slotNumber || '—'}</span></div>
    <div class="row"><span class="label">Player Email</span><span class="value">${reg.userEmail}</span></div>
    <div class="row">
      <span class="label">Payment</span>
      <span class="value"><span class="status ${reg.paymentVerified ? 'paid' : 'pending'}">${reg.paymentVerified ? 'Paid' : 'Pending'}</span></span>
    </div>
    ${reg.orderId ? `<div class="row"><span class="label">Transaction ID</span><span class="value" style="font-family:monospace;font-size:11px;">${reg.orderId}</span></div>` : ''}
    <div style="margin-top: 24px;">
      <span class="label">Squad Members</span>
      <table>
        <tr><th>#</th><th>Name</th><th>Game UID</th></tr>
        ${playersList}
      </table>
    </div>
  </div>
  <div class="footer">
    Bharat Gaming League &bull; This is a computer-generated receipt &bull; ${date}
  </div>
</div>
</body></html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

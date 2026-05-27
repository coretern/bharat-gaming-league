import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getEmailWrapper(contentHtml: string) {
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px 12px; background-color: #f8fafc; box-sizing: border-box;">
      <div style="max-width: 500px; margin: 0 auto; padding: 24px 16px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03); box-sizing: border-box;">
        
        <!-- Brand Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1a73e8; font-weight: 900; font-size: 20px; letter-spacing: -0.025em; margin: 0; text-transform: uppercase;">
            Bharat<span style="color: #0f172a;">Gaming</span>
          </h2>
          <p style="color: #94a3b8; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.25em; margin: 4px 0 0 0;">
            League
          </p>
        </div>

        <!-- Main Body -->
        <div style="color: #334155; font-size: 13px; line-height: 1.6; font-weight: 500; box-sizing: border-box;">
          ${contentHtml}
        </div>

        <!-- Divider -->
        <div style="border-top: 1px solid #f1f5f9; margin: 24px 0 20px 0;"></div>

        <!-- Footer Help & Socials -->
        <div style="text-align: center; box-sizing: border-box;">
          <div style="margin-bottom: 16px;">
            <a href="https://bharatgamingleague.vercel.app/help" target="_blank" style="color: #1a73e8; text-decoration: none; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 6px;">Help Center</a>
            <span style="color: #cbd5e1; font-size: 10px;">•</span>
            <a href="https://wa.me/9164646464" target="_blank" style="color: #128c7e; text-decoration: none; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 6px;">WhatsApp</a>
            <span style="color: #cbd5e1; font-size: 10px;">•</span>
            <a href="https://t.me/bgl_esports" target="_blank" style="color: #0088cc; text-decoration: none; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 6px;">Telegram</a>
          </div>

          <!-- Social Icon Links -->
          <div style="margin-bottom: 20px;">
            <a href="https://discord.gg/bgl" target="_blank" style="display: inline-block; width: 26px; height: 26px; border-radius: 6px; background-color: #5865F2; text-align: center; margin: 0 3px; text-decoration: none; line-height: 26px; vertical-align: middle;">
              <span style="color: #ffffff; font-size: 10px; font-weight: 900;">D</span>
            </a>
            <a href="https://youtube.com/@bgl" target="_blank" style="display: inline-block; width: 26px; height: 26px; border-radius: 6px; background-color: #FF0000; text-align: center; margin: 0 3px; text-decoration: none; line-height: 26px; vertical-align: middle;">
              <span style="color: #ffffff; font-size: 10px; font-weight: 900;">Y</span>
            </a>
            <a href="https://instagram.com/bgl" target="_blank" style="display: inline-block; width: 26px; height: 26px; border-radius: 6px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); text-align: center; margin: 0 3px; text-decoration: none; line-height: 26px; vertical-align: middle;">
              <span style="color: #ffffff; font-size: 10px; font-weight: 900;">I</span>
            </a>
          </div>

          <div style="color: #94a3b8; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.5;">
            🏆 Bharat Gaming League · India's Premier Esports Hub<br/>
            <span style="color: #cbd5e1; font-weight: 500; text-transform: none; letter-spacing: 0;">Safe, transparent esports for everyone.</span>
          </div>
        </div>

      </div>
    </div>
  `;
}

export async function sendOTPEmail(email: string, otp: string, subject: string) {
  const content = `
    <p style="margin-top: 0;">Hello,</p>
    <p>Please use the verification code below to verify your account or complete your request:</p>
    <div style="text-align: center; margin: 24px 0;">
      <div style="font-size: 32px; font-weight: 900; letter-spacing: 0.15em; color: #1a73e8; background-color: #f1f5f9; padding: 12px 24px; border-radius: 12px; display: inline-block; border: 1px solid #e2e8f0; font-family: monospace;">
        ${otp}
      </div>
    </div>
    <p style="color: #64748b; font-size: 11px; margin-bottom: 0;">
      This OTP code is valid for 10 minutes. If you did not request this email, please ignore this.
    </p>
  `;

  await transporter.sendMail({
    from: `"BGL Esports" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html: getEmailWrapper(content),
  });
}

export async function sendTournamentConfirmationEmail(reg: any) {
  try {
    const regId = reg._id.toString();
    const token = crypto
      .createHmac('sha256', process.env.NEXTAUTH_SECRET || 'bgl-esports-secret-2026')
      .update(regId)
      .digest('hex');

    const receiptUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/receipt?id=${regId}&token=${token}`;
    const date = new Date(reg.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const content = `
      <h3 style="color: #2e7d32; font-size: 15px; font-weight: 800; margin-top: 0; margin-bottom: 8px; text-align: center;">
        🎮 Registration Confirmed!
      </h3>
      <p style="text-align: center; color: #64748b; font-size: 11px; margin-bottom: 20px;">
        Your payment was verified, and your slot has been successfully secured.
      </p>
      
      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px; margin-bottom: 20px; box-sizing: border-box;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; width: 35%;">Tournament</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">${reg.tournamentName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Format</td>
            <td style="padding: 5px 0; color: #1a73e8; font-size: 11.5px; font-weight: 700; text-align: right; text-transform: uppercase;">${reg.matchType}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Team Name</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">${reg.teamName}</td>
          </tr>
          ${reg.groupNumber ? `
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Group / Slot</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">Group ${reg.groupNumber} / Slot ${reg.slotNumber}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Date</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Order ID</td>
            <td style="padding: 5px 0; color: #334155; font-size: 10.5px; font-family: monospace; font-weight: 600; text-align: right;">${reg.orderId || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <p style="margin-bottom: 20px; text-align: center; color: #475569; font-size: 12px;">
        You can download your official payment receipt directly by clicking the button below:
      </p>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${receiptUrl}" target="_blank" style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; box-shadow: 0 4px 6px -1px rgba(46, 125, 50, 0.2);">
          ⬇ Download Receipt
        </a>
      </div>

      <p style="color: #64748b; font-size: 10.5px; text-align: center; margin-bottom: 0; line-height: 1.5;">
        Please ensure In-Game Username and UIDs are correct. In case of queries, contact WhatsApp support or Telegram.
      </p>
    `;

    await transporter.sendMail({
      from: `"BGL Esports" <${process.env.SMTP_USER}>`,
      to: reg.userEmail,
      subject: `🏆 Slot Secured! Registration Success for ${reg.tournamentName}`,
      html: getEmailWrapper(content),
    });
  } catch (err) {
    console.error('sendTournamentConfirmationEmail error:', err);
  }
}

export async function sendTournamentPendingPaymentEmail(reg: any) {
  try {
    const content = `
      <h3 style="color: #e65100; font-size: 15px; font-weight: 800; margin-top: 0; margin-bottom: 8px; text-align: center;">
        ⚠️ Payment Pending!
      </h3>
      <p style="text-align: center; color: #64748b; font-size: 11px; margin-bottom: 20px;">
        Your enrollment request has been logged, but your tournament entry fee is unpaid.
      </p>
      
      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px; margin-bottom: 20px; box-sizing: border-box;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; width: 35%;">Tournament</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">${reg.tournamentName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Format</td>
            <td style="padding: 5px 0; color: #1a73e8; font-size: 11.5px; font-weight: 700; text-align: right; text-transform: uppercase;">${reg.matchType}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Team Name</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">${reg.teamName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Entry Fee</td>
            <td style="padding: 5px 0; color: #e65100; font-size: 13px; font-weight: 800; text-align: right;">₹${reg.entryFee}</td>
          </tr>
        </table>
      </div>

      <p style="margin-bottom: 20px; text-align: center; color: #475569; font-size: 12px;">
        Please secure your slot in the lobby by completing the entry fee payment now:
      </p>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard?tab=My%20Registrations" target="_blank" style="background: linear-gradient(135deg, #f57c00 0%, #e65100 100%); color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; box-shadow: 0 4px 6px -1px rgba(230, 81, 0, 0.2);">
          💳 Pay Entry Fee (₹${reg.entryFee})
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"BGL Esports" <${process.env.SMTP_USER}>`,
      to: reg.userEmail,
      subject: `⚠️ Action Required: Pending Payment for ${reg.tournamentName}`,
      html: getEmailWrapper(content),
    });
  } catch (err) {
    console.error('sendTournamentPendingPaymentEmail error:', err);
  }
}

export async function sendTournamentApprovalEmail(reg: any) {
  try {
    const content = `
      <h3 style="color: #2e7d32; font-size: 15px; font-weight: 800; margin-top: 0; margin-bottom: 8px; text-align: center;">
        🎉 Enrollment Approved!
      </h3>
      <p style="text-align: center; color: #64748b; font-size: 11px; margin-bottom: 20px;">
        BGL admins have reviewed and verified your tournament registration.
      </p>
      
      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px; margin-bottom: 20px; box-sizing: border-box;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; width: 35%;">Tournament</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">${reg.tournamentName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Format</td>
            <td style="padding: 5px 0; color: #1a73e8; font-size: 11.5px; font-weight: 700; text-align: right; text-transform: uppercase;">${reg.matchType}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Team Name</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">${reg.teamName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Group / Slot</td>
            <td style="padding: 5px 0; color: #2e7d32; font-size: 11.5px; font-weight: 800; text-align: right;">Group ${reg.groupNumber || 'N/A'} / Slot ${reg.slotNumber || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <p style="margin-bottom: 20px; text-align: center; color: #475569; font-size: 12px;">
        You are officially approved for this tournament! You can monitor matches and coordinates inside your dashboard:
      </p>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard?tab=My%20Registrations" target="_blank" style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; box-shadow: 0 4px 6px -1px rgba(46, 125, 50, 0.2);">
          🎮 Open Dashboard
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"BGL Esports" <${process.env.SMTP_USER}>`,
      to: reg.userEmail,
      subject: `🎉 Registration Approved for ${reg.tournamentName}`,
      html: getEmailWrapper(content),
    });
  } catch (err) {
    console.error('sendTournamentApprovalEmail error:', err);
  }
}

export async function sendTournamentScheduleEmail(reg: any) {
  try {
    const content = `
      <h3 style="color: #6a1b9a; font-size: 15px; font-weight: 800; margin-top: 0; margin-bottom: 8px; text-align: center;">
        ⚔️ Match Schedule & Room Details
      </h3>
      <p style="text-align: center; color: #64748b; font-size: 11px; margin-bottom: 20px;">
        Admins have updated the schedules and custom lobby coordinates for your match.
      </p>
      
      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px; margin-bottom: 20px; box-sizing: border-box;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; width: 35%;">Tournament</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">${reg.tournamentName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Schedule</td>
            <td style="padding: 5px 0; color: #6a1b9a; font-size: 11.5px; font-weight: 800; text-align: right;">${reg.matchDate || 'TBA'} @ ${reg.matchTime || 'TBA'}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Group / Slot</td>
            <td style="padding: 5px 0; color: #0f172a; font-size: 11.5px; font-weight: 700; text-align: right;">Group ${reg.groupNumber || 'N/A'} / Slot ${reg.slotNumber || 'N/A'}</td>
          </tr>
        </table>
      </div>

      ${reg.roomId ? `
      <div style="background-color: #f3e5f5; border: 1px solid #e1bee7; border-radius: 12px; padding: 14px; margin-bottom: 20px; box-sizing: border-box;">
        <h4 style="color: #6a1b9a; font-size: 12px; font-weight: 900; text-transform: uppercase; margin-top: 0; margin-bottom: 8px; text-align: center; letter-spacing: 0.05em;">🔑 Lobby Access</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #7b1fa2; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; width: 35%;">Room ID</td>
            <td style="padding: 5px 0; color: #6a1b9a; font-size: 13px; font-family: monospace; font-weight: 900; text-align: right;">${reg.roomId}</td>
          </tr>
          ${reg.roomPassword ? `
          <tr>
            <td style="padding: 5px 0; color: #7b1fa2; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Password</td>
            <td style="padding: 5px 0; color: #6a1b9a; font-size: 13px; font-family: monospace; font-weight: 900; text-align: right;">${reg.roomPassword}</td>
          </tr>` : ''}
        </table>
      </div>` : `
      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px; margin-bottom: 20px; text-align: center; color: #64748b; font-size: 11px; font-weight: 600;">
        ⏳ Lobby Room ID and Password will be posted directly inside your dashboard 15 minutes before the match start time.
      </div>`}

      <p style="margin-bottom: 20px; text-align: center; color: #475569; font-size: 12px;">
        Please make sure to join custom lobbies under your correct slot numbers to prevent team disqualification.
      </p>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard?tab=My%20Registrations" target="_blank" style="background: linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%); color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; box-shadow: 0 4px 6px -1px rgba(106, 27, 154, 0.2);">
          🎮 Open Dashboard
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"BGL Esports" <${process.env.SMTP_USER}>`,
      to: reg.userEmail,
      subject: `⚔️ Lobby Details & Match Schedule updated for ${reg.tournamentName}`,
      html: getEmailWrapper(content),
    });
  } catch (err) {
    console.error('sendTournamentScheduleEmail error:', err);
  }
}

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

export async function sendOTPEmail(email: string, otp: string, subject: string) {
  const htmlContent = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;">
      <div style="max-width: 440px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
        
        <!-- Brand Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #1a73e8; font-weight: 800; font-size: 20px; letter-spacing: -0.025em; margin: 0; text-transform: uppercase;">
            Bharat<span style="color: #0f172a;">Gaming</span>
          </h2>
          <p style="color: #94a3b8; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; margin: 4px 0 0 0;">
            League
          </p>
        </div>

        <!-- Main Body -->
        <div style="color: #334155; font-size: 14px; line-height: 1.6; font-weight: 500;">
          <p style="margin-top: 0;">Hello,</p>
          <p>Please use the verification code below to verify your account or complete your request:</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <div style="font-size: 36px; font-weight: 900; letter-spacing: 0.15em; color: #1a73e8; background-color: #f1f5f9; padding: 14px 28px; border-radius: 12px; display: inline-block; border: 1px solid #e2e8f0; font-family: monospace;">
              ${otp}
            </div>
          </div>

          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
            This OTP code is valid for 10 minutes. If you did not request this email, please ignore this.
          </p>
        </div>

        <!-- Divider -->
        <div style="border-top: 1px solid #f1f5f9; margin: 32px 0 24px 0;"></div>

        <!-- Footer -->
        <div style="text-align: center; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
          🔒 Secure Verification System
        </div>

      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"BGL Esports" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html: htmlContent,
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

    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 540px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;">
        <div style="max-width: 500px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          
          <!-- Brand Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: #1a73e8; font-weight: 900; font-size: 22px; letter-spacing: -0.025em; margin: 0; text-transform: uppercase;">
              Bharat<span style="color: #0f172a;">Gaming</span>
            </h2>
            <p style="color: #94a3b8; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.25em; margin: 4px 0 0 0;">
              League
            </p>
          </div>

          <!-- Main Body -->
          <div style="color: #334155; font-size: 14px; line-height: 1.6; font-weight: 500;">
            <h3 style="color: #0f172a; font-size: 16px; font-weight: 800; margin-top: 0; margin-bottom: 8px; text-align: center;">
              🎮 Registration Confirmed!
            </h3>
            <p style="text-align: center; color: #64748b; font-size: 12px; margin-bottom: 24px;">
              Your slot in the arena has been successfully secured.
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; width: 40%;">Tournament</td>
                  <td style="padding: 6px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-align: right;">${reg.tournamentName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Format</td>
                  <td style="padding: 6px 0; color: #1a73e8; font-size: 12px; font-weight: 700; text-align: right; text-transform: uppercase;">${reg.matchType}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Team Name</td>
                  <td style="padding: 6px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-align: right;">${reg.teamName}</td>
                </tr>
                ${reg.groupNumber ? `
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Group / Slot</td>
                  <td style="padding: 6px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-align: right;">Group ${reg.groupNumber} / Slot ${reg.slotNumber}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Date</td>
                  <td style="padding: 6px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-align: right;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Transaction ID</td>
                  <td style="padding: 6px 0; color: #334155; font-size: 11px; font-family: monospace; font-weight: 600; text-align: right;">${reg.orderId || 'N/A'}</td>
                </tr>
              </table>
            </div>

            <p style="margin-bottom: 24px; text-align: center; color: #475569;">
              You can download your official payment receipt directly by clicking the button below:
            </p>

            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${receiptUrl}" target="_blank" style="background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; box-shadow: 0 4px 6px -1px rgba(26, 115, 232, 0.2);">
                ⬇ Download Receipt
              </a>
            </div>

            <p style="color: #64748b; font-size: 11px; text-align: center; margin-bottom: 0;">
              Please ensure your game profiles (In-Game Username and UID) are correct. In case of queries, reach out via WhatsApp support or Telegram.
            </p>
          </div>

          <!-- Divider -->
          <div style="border-top: 1px solid #f1f5f9; margin: 32px 0 24px 0;"></div>

          <!-- Footer -->
          <div style="text-align: center; color: #94a3b8; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
            🏆 Bharat Gaming League · India's Premier Esports Hub
          </div>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"BGL Esports" <${process.env.SMTP_USER}>`,
      to: reg.userEmail,
      subject: `🏆 Slot Secured! Registration Receipt for ${reg.tournamentName}`,
      html: htmlContent,
    });
  } catch (err) {
    console.error('sendTournamentConfirmationEmail error:', err);
  }
}

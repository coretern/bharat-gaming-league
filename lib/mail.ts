import nodemailer from 'nodemailer';

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

import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

let transporter;

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
} else {
  // Fallback: log emails to console in development if SMTP is not configured
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export async function sendVerificationEmail({ to, name, code }) {
  const subject = "Your AutoParts verification code";
  const text = `Hi ${name}, your verification code is ${code}. It expires in 10 minutes.`;
  const html = `
		<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111">
			<h2 style="margin:0 0 12px">Verify your email</h2>
			<p>Hi ${name},</p>
			<p>Your verification code is:</p>
			<div style="font-size:28px;font-weight:700;letter-spacing:6px;padding:12px 0;color:#1d4ed8">${code}</div>
			<p style="color:#555">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
		</div>
	`;

  const info = await transporter.sendMail({
    from: SMTP_USER || undefined,
    to,
    subject,
    text,
    html,
  });

  // If using jsonTransport, log for visibility
  if (transporter.options.jsonTransport) {
    // eslint-disable-next-line no-console
    console.log("Email (dev log):", info.message);
  }

  return info;
}

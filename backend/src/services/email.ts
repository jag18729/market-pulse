// Email service using Resend API

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = "Market Pulse <brief@stocks.vandine.us>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send email:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verifyUrl = `https://stocks.vandine.us/verify?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: "Verify your Market Pulse account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Welcome to Market Pulse 📈</h1>
        <p>Click the button below to verify your email and start receiving personalized market briefs.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">Or copy this link: ${verifyUrl}</p>
      </div>
    `,
    text: `Welcome to Market Pulse! Verify your email: ${verifyUrl}`,
  });
}

export async function sendMorningBrief(email: string, briefHtml: string, briefText: string): Promise<boolean> {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return sendEmail({
    to: email,
    subject: `☀️ Your Market Pulse — ${date}`,
    html: briefHtml,
    text: briefText,
  });
}

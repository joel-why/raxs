import "server-only"
import { Resend } from "resend"

// The Resend API key is provisioned under the API_KEY env var for this project.
const resend = new Resend(process.env.API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"

export async function sendVerificationEmail(email: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await resend.emails.send(
    {
      from: FROM,
      to: [email],
      subject: `${code} is your verification code`,
      html: verificationEmailHtml(code),
      text: `Your verification code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    },
    { idempotencyKey: `waitlist-verification/${email}/${code}` },
  )

  if (error) {
    console.error("[v0] Resend send failed:", error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

function verificationEmailHtml(code: string): string {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #111;">
    <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px;">Confirm your email</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 24px;">
      Enter this code to claim your spot on the waitlist. It expires in 10 minutes.
    </p>
    <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 20px; background: #f4f4f5; border-radius: 12px; margin: 0 0 24px;">
      ${code}
    </div>
    <p style="font-size: 12px; line-height: 1.6; color: #999; margin: 0;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>`
}

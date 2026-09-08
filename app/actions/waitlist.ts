"use server"

import { db } from "@/lib/db"
import { verificationCodes, waitlist } from "@/lib/db/schema"
import { count, desc, eq, isNotNull } from "drizzle-orm"
import { sendVerificationEmail } from "@/lib/email"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const MAX_ATTEMPTS = 5

// Vanity padding applied to public-facing waitlist numbers only. The database
// still stores just the real signups; this offset makes the public count and
// positions start higher, so real signups slot in after the padded block.
// With this set to 500, the next real signup shows as #(500 + its real rank).
const WAITLIST_PADDING = 500

// Real number of signups in the database (unpadded). Used internally and by the
// admin dashboard, which must reflect the true data.
export async function getWaitlistCount(): Promise<number> {
  const result = await db.select({ count: count() }).from(waitlist)
  return result[0]?.count ?? 0
}

// Public-facing count: the real count plus the vanity padding.
export async function getPublicWaitlistCount(): Promise<number> {
  return (await getWaitlistCount()) + WAITLIST_PADDING
}

export async function getAllSignups(): Promise<
  { id: number; name: string; email: string; username: string | null; referral: string | null; createdAt: Date }[]
> {
  const result = await db.select().from(waitlist).orderBy(waitlist.createdAt)
  return result
    .map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      username: row.username,
      referral: row.referral,
      createdAt: row.createdAt!,
    }))
    .reverse()
}

// Builds the full waitlist ordering. Everyone starts ranked by signup order
// (earliest = #1), then each referral a user has earned moves them up one spot,
// jumping the person directly ahead. When an adjusted score ties, the person
// who climbed there via referrals wins the higher spot.
async function getRankedWaitlist(): Promise<
  { id: number; username: string | null; email: string; referrals: number }[]
> {
  const rows = await db
    .select({
      id: waitlist.id,
      username: waitlist.username,
      email: waitlist.email,
      referral: waitlist.referral,
    })
    .from(waitlist)
    .orderBy(waitlist.id)

  // Tally how many people each username has referred
  const referralCounts = new Map<string, number>()
  for (const row of rows) {
    if (row.referral) referralCounts.set(row.referral, (referralCounts.get(row.referral) ?? 0) + 1)
  }

  return rows
    .map((row, index) => {
      const referrals = row.username ? referralCounts.get(row.username) ?? 0 : 0
      return {
        id: row.id,
        username: row.username,
        email: row.email,
        referrals,
        basePosition: index + 1,
        score: index + 1 - referrals,
      }
    })
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score
      if (a.referrals !== b.referrals) return b.referrals - a.referrals
      return a.basePosition - b.basePosition
    })
    .map(({ id, username, email, referrals }) => ({ id, username, email, referrals }))
}

export async function getWaitlistPosition(query: string): Promise<{
  found: boolean
  position?: number
  total?: number
  username?: string | null
  referrals?: number
}> {
  const normalized = query.trim().toLowerCase().replace(/^@/, "")
  if (!normalized) return { found: false }

  const ranked = await getRankedWaitlist()
  const index = ranked.findIndex(
    (row) => row.username === normalized || row.email.toLowerCase() === normalized
  )
  if (index === -1) return { found: false }

  return {
    found: true,
    position: WAITLIST_PADDING + index + 1,
    total: WAITLIST_PADDING + ranked.length,
    username: ranked[index].username,
    referrals: ranked[index].referrals,
  }
}

export async function getTopReferrers(): Promise<{ username: string; referrals: number }[]> {
  const result = await db
    .select({ username: waitlist.referral, referrals: count() })
    .from(waitlist)
    .where(isNotNull(waitlist.referral))
    .groupBy(waitlist.referral)
    .orderBy(desc(count()))
    .limit(3)

  return result
    .filter((row): row is { username: string; referrals: number } => Boolean(row.username))
    .map((row) => ({ username: row.username, referrals: Number(row.referrals) }))
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const normalized = username.trim().toLowerCase()
  if (!normalized) return false
  const existing = await db
    .select({ id: waitlist.id })
    .from(waitlist)
    .where(eq(waitlist.username, normalized))
    .limit(1)
  return existing.length === 0
}

// Shared validation for a would-be signup. Returns an error string when the
// submission is invalid, or null when it's good to proceed.
async function validateSignup(
  normalizedEmail: string,
  normalizedUsername: string,
  normalizedReferral: string,
): Promise<string | null> {
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return "Please enter a valid email address"
  }

  // Validate username format: 3-30 chars, lowercase letters, numbers, periods, underscores
  if (!/^[a-z0-9._]{3,30}$/.test(normalizedUsername)) {
    return "Usernames must be 3-30 characters: lowercase letters, numbers, periods, or underscores"
  }

  // Prevent self-referral: you can't use your own username as your referral code
  if (normalizedReferral && normalizedReferral === normalizedUsername) {
    return "You can't refer yourself!"
  }

  const existingEmail = await db
    .select({ id: waitlist.id })
    .from(waitlist)
    .where(eq(waitlist.email, normalizedEmail))
    .limit(1)
  if (existingEmail.length > 0) {
    return "This email is already on the waitlist!"
  }

  const available = await isUsernameAvailable(normalizedUsername)
  if (!available) {
    return `@${normalizedUsername} is already taken. Try another one!`
  }

  return null
}

// Step 1: validate the signup, generate a 6-digit code, store the pending
// signup, and email the code. Nothing is added to the waitlist yet.
export async function requestWaitlistVerification(
  email: string,
  username: string,
  referral: string,
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = username.trim().toLowerCase()
  const normalizedReferral = referral.trim().toLowerCase()

  const validationError = await validateSignup(normalizedEmail, normalizedUsername, normalizedReferral)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + CODE_TTL_MS)

  // Upsert: the newest code replaces any prior pending code for this email.
  await db
    .insert(verificationCodes)
    .values({
      email: normalizedEmail,
      code,
      username: normalizedUsername,
      referral: normalizedReferral || null,
      attempts: 0,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: verificationCodes.email,
      set: { code, username: normalizedUsername, referral: normalizedReferral || null, attempts: 0, expiresAt },
    })

  const sent = await sendVerificationEmail(normalizedEmail, code)
  if (!sent.ok) {
    return { success: false, error: "We couldn't send the verification email. Please try again." }
  }

  return { success: true }
}

// Step 2: check the submitted code and, if valid, add the signup to the waitlist.
export async function verifyAndJoinWaitlist(
  email: string,
  code: string,
): Promise<{ success: boolean; count: number; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedCode = code.trim()

  const currentCount = await getPublicWaitlistCount()

  const rows = await db
    .select()
    .from(verificationCodes)
    .where(eq(verificationCodes.email, normalizedEmail))
    .limit(1)
  const record = rows[0]

  if (!record) {
    return { success: false, count: currentCount, error: "No pending verification. Please start over." }
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await db.delete(verificationCodes).where(eq(verificationCodes.email, normalizedEmail))
    return { success: false, count: currentCount, error: "This code has expired. Please request a new one." }
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await db.delete(verificationCodes).where(eq(verificationCodes.email, normalizedEmail))
    return { success: false, count: currentCount, error: "Too many attempts. Please request a new code." }
  }

  if (record.code !== normalizedCode) {
    await db
      .update(verificationCodes)
      .set({ attempts: record.attempts + 1 })
      .where(eq(verificationCodes.email, normalizedEmail))
    const remaining = MAX_ATTEMPTS - (record.attempts + 1)
    return {
      success: false,
      count: currentCount,
      error: remaining > 0 ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} left.` : "Too many attempts. Please request a new code.",
    }
  }

  const normalizedUsername = (record.username ?? "").toLowerCase()

  // Re-validate in case the username was claimed by someone else while the
  // code was outstanding, or the email got added another way.
  const validationError = await validateSignup(normalizedEmail, normalizedUsername, (record.referral ?? "").toLowerCase())
  if (validationError) {
    await db.delete(verificationCodes).where(eq(verificationCodes.email, normalizedEmail))
    return { success: false, count: currentCount, error: validationError }
  }

  try {
    await db.insert(waitlist).values({
      name: "",
      email: normalizedEmail,
      username: normalizedUsername,
      referral: record.referral || null,
    })
    await db.delete(verificationCodes).where(eq(verificationCodes.email, normalizedEmail))
    const newCount = await getPublicWaitlistCount()
    return { success: true, count: newCount }
  } catch (error: unknown) {
    // Handle unique constraint violations (race conditions on email or username)
    if (error instanceof Error && error.message.includes("unique")) {
      if (error.message.includes("username")) {
        return { success: false, count: currentCount, error: `@${normalizedUsername} is already taken. Try another one!` }
      }
      return { success: false, count: currentCount, error: "This email is already on the waitlist!" }
    }
    throw error
  }
}

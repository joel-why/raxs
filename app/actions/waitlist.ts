"use server"

import { db } from "@/lib/db"
import { waitlist } from "@/lib/db/schema"
import { count, desc, eq, isNotNull, lte, or } from "drizzle-orm"

export async function getWaitlistCount(): Promise<number> {
  const result = await db.select({ count: count() }).from(waitlist)
  return result[0]?.count ?? 0
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

export async function getWaitlistPosition(
  query: string
): Promise<{ found: boolean; position?: number; total?: number; username?: string | null }> {
  const normalized = query.trim().toLowerCase().replace(/^@/, "")
  if (!normalized) return { found: false }

  // Look up by username or email so people can check with either one.
  // Rank by the serial id (monotonic with signup order) rather than the
  // timestamp — Postgres stores microseconds but JS Date truncates to ms,
  // which would drop the row itself from a created_at comparison.
  const match = await db
    .select({ id: waitlist.id, username: waitlist.username })
    .from(waitlist)
    .where(or(eq(waitlist.username, normalized), eq(waitlist.email, normalized)))
    .limit(1)

  const entry = match[0]
  if (!entry) return { found: false }

  // Position is 1-based by signup order: the earliest signup is #1
  const ahead = await db.select({ count: count() }).from(waitlist).where(lte(waitlist.id, entry.id))

  const total = await getWaitlistCount()

  return {
    found: true,
    position: ahead[0]?.count ?? 1,
    total,
    username: entry.username,
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

export async function joinWaitlist(
  email: string,
  username: string,
  referral: string
): Promise<{ success: boolean; count: number; error?: string }> {
  const normalizedUsername = username.trim().toLowerCase()
  const normalizedReferral = referral.trim().toLowerCase()

  // Validate username format: 3-30 chars, lowercase letters, numbers, periods, underscores
  if (!/^[a-z0-9._]{3,30}$/.test(normalizedUsername)) {
    const currentCount = await getWaitlistCount()
    return {
      success: false,
      count: currentCount,
      error: "Usernames must be 3-30 characters: lowercase letters, numbers, periods, or underscores",
    }
  }

  // Prevent self-referral: you can't use your own username as your referral code
  if (normalizedReferral && normalizedReferral === normalizedUsername) {
    const currentCount = await getWaitlistCount()
    return { success: false, count: currentCount, error: "You can't refer yourself!" }
  }

  // Pre-check so we can return a friendly, specific message before hitting the constraint
  const available = await isUsernameAvailable(normalizedUsername)
  if (!available) {
    const currentCount = await getWaitlistCount()
    return { success: false, count: currentCount, error: `@${normalizedUsername} is already taken. Try another one!` }
  }

  try {
    await db.insert(waitlist).values({
      name: "",
      email,
      username: normalizedUsername,
      referral: normalizedReferral || null,
    })
    const newCount = await getWaitlistCount()
    return { success: true, count: newCount }
  } catch (error: unknown) {
    // Handle unique constraint violations (race conditions on email or username)
    if (error instanceof Error && error.message.includes("unique")) {
      const currentCount = await getWaitlistCount()
      if (error.message.includes("username")) {
        return { success: false, count: currentCount, error: `@${normalizedUsername} is already taken. Try another one!` }
      }
      return { success: false, count: currentCount, error: "This email is already on the waitlist!" }
    }
    throw error
  }
}

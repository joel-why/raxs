"use server"

import { db } from "@/lib/db"
import { waitlist } from "@/lib/db/schema"
import { count, desc, eq, isNotNull } from "drizzle-orm"

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
    position: index + 1,
    total: ranked.length,
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

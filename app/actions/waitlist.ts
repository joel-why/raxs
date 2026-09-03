"use server"

import { db } from "@/lib/db"
import { waitlist } from "@/lib/db/schema"
import { count, desc, eq, isNotNull } from "drizzle-orm"

// Base count so the displayed number starts at 1749 and counts up from there
const BASE_COUNT = 1749

export async function getWaitlistCount(): Promise<number> {
  const result = await db.select({ count: count() }).from(waitlist)
  return BASE_COUNT + (result[0]?.count ?? 0)
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
  name: string,
  email: string,
  username: string,
  referral: string
): Promise<{ success: boolean; count: number; error?: string }> {
  const normalizedUsername = username.trim().toLowerCase()
  const normalizedReferral = referral.trim().toLowerCase()

  // Pre-check so we can return a friendly, specific message before hitting the constraint
  const available = await isUsernameAvailable(normalizedUsername)
  if (!available) {
    const currentCount = await getWaitlistCount()
    return { success: false, count: currentCount, error: `@${normalizedUsername} is already taken. Try another one!` }
  }

  try {
    await db.insert(waitlist).values({
      name,
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

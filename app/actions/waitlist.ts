"use server"

import { db } from "@/lib/db"
import { waitlist } from "@/lib/db/schema"
import { count } from "drizzle-orm"

export async function getWaitlistCount(): Promise<number> {
  const result = await db.select({ count: count() }).from(waitlist)
  return result[0]?.count ?? 0
}

export async function getAllSignups(): Promise<{ id: number; name: string; email: string; createdAt: Date }[]> {
  const result = await db.select().from(waitlist).orderBy(waitlist.createdAt)
  return result.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt!,
  })).reverse()
}

export async function joinWaitlist(name: string, email: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    await db.insert(waitlist).values({ name, email })
    const newCount = await getWaitlistCount()
    return { success: true, count: newCount }
  } catch (error: unknown) {
    // Handle unique constraint violation (email already exists)
    if (error instanceof Error && error.message.includes("unique")) {
      const currentCount = await getWaitlistCount()
      return { success: false, count: currentCount, error: "This email is already on the waitlist!" }
    }
    throw error
  }
}

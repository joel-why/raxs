'use server'

import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { waitlist } from '@/lib/db/schema'
import { and, eq, ne } from 'drizzle-orm'

const ADMIN_PASSWORD = 'Raxs!123'
const AUTH_COOKIE_NAME = 'admin_auth'

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return true
  }
  return false
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE_NAME)?.value === 'authenticated'
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function updateSignup(
  id: number,
  email: string,
  username: string
): Promise<{ success: boolean; error?: string; email?: string; username?: string }> {
  // Only authenticated admins may edit signups
  const authed = await checkAdminAuth()
  if (!authed) {
    return { success: false, error: 'Not authorized' }
  }

  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = username.trim().toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, error: 'Invalid email address' }
  }

  if (!/^[a-z0-9._]{3,30}$/.test(normalizedUsername)) {
    return {
      success: false,
      error: 'Usernames must be 3-30 characters: lowercase letters, numbers, periods, or underscores',
    }
  }

  // Ensure the new email/username aren't already used by a different signup
  const emailClash = await db
    .select({ id: waitlist.id })
    .from(waitlist)
    .where(and(eq(waitlist.email, normalizedEmail), ne(waitlist.id, id)))
    .limit(1)
  if (emailClash.length > 0) {
    return { success: false, error: 'That email is already in use by another signup' }
  }

  const usernameClash = await db
    .select({ id: waitlist.id })
    .from(waitlist)
    .where(and(eq(waitlist.username, normalizedUsername), ne(waitlist.id, id)))
    .limit(1)
  if (usernameClash.length > 0) {
    return { success: false, error: `@${normalizedUsername} is already taken by another signup` }
  }

  try {
    await db
      .update(waitlist)
      .set({ email: normalizedEmail, username: normalizedUsername })
      .where(eq(waitlist.id, id))
    return { success: true, email: normalizedEmail, username: normalizedUsername }
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('unique')) {
      return { success: false, error: 'That email or username is already in use' }
    }
    throw error
  }
}

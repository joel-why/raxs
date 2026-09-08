import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  referral: text("referral"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

// Pending signups awaiting email verification. One row per email (the latest
// code replaces any previous one). Rows are consumed on successful verification
// and are otherwise short-lived via the expires_at timestamp.
export const verificationCodes = pgTable("verification_codes", {
  email: text("email").primaryKey(),
  code: text("code").notNull(),
  username: text("username"),
  referral: text("referral"),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

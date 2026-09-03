import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  referral: text("referral"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

await pool.query(`
  CREATE TABLE IF NOT EXISTS verification_codes (
    email text PRIMARY KEY,
    code text NOT NULL,
    username text,
    referral text,
    attempts integer NOT NULL DEFAULT 0,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  );
`)

console.log("[v0] verification_codes table ready")
await pool.end()

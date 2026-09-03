"use client"

import { useEffect, useState } from "react"
import { getTopReferrers } from "@/app/actions/waitlist"

type Referrer = { username: string; referrals: number }

const REWARDS = [
  { count: 1, label: "Move up a spot" },
  { count: 3, label: "Early access" },
  { count: 5, label: "Exclusive founding member badge" },
  { count: 10, label: "Exclusive profile theme" },
]

const RANK_STYLES = [
  "text-foreground",
  "text-muted-foreground",
  "text-muted-foreground/70",
]

export function ReferralLeaderboard() {
  const [referrers, setReferrers] = useState<Referrer[] | null>(null)

  useEffect(() => {
    getTopReferrers().then(setReferrers)
  }, [])

  return (
    <section
      aria-label="Referral leaderboard and rewards"
      className="w-full max-w-md mx-auto rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 space-y-6"
    >
      {/* Top referrers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground tracking-wide">Top referrers</h2>
          <span className="text-xs text-muted-foreground">Refer to climb</span>
        </div>

        <ol className="space-y-2">
          {referrers === null ? (
            Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-input/50 px-3 py-2 animate-pulse"
              >
                <span className="h-4 w-24 rounded bg-border" />
                <span className="h-4 w-12 rounded bg-border" />
              </li>
            ))
          ) : referrers.length === 0 ? (
            <li className="rounded-lg bg-input/50 px-3 py-3 text-center text-xs text-muted-foreground">
              No referrals yet — be the first to share your code!
            </li>
          ) : (
            referrers.map((r, i) => (
              <li
                key={r.username}
                className="flex items-center justify-between rounded-lg bg-input/50 px-3 py-2"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-semibold ${RANK_STYLES[i] ?? "text-muted-foreground"}`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">@{r.username}</span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {r.referrals} {r.referrals === 1 ? "referral" : "referrals"}
                </span>
              </li>
            ))
          )}
        </ol>
      </div>

      {/* Rewards */}
      <div className="space-y-3 border-t border-border pt-5">
        <h3 className="text-sm font-medium text-foreground tracking-wide">What you&apos;ll unlock</h3>
        <ul className="space-y-2">
          {REWARDS.map((reward) => (
            <li key={reward.count} className="flex items-center gap-3">
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-foreground px-2 text-xs font-semibold text-background">
                {reward.count}
              </span>
              <span className="text-sm text-muted-foreground">
                {reward.count === 1 ? "referral" : "referrals"} &mdash;{" "}
                <span className="text-foreground">{reward.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

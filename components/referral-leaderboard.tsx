"use client"

import { useEffect, useState } from "react"
import { getTopReferrers } from "@/app/actions/waitlist"

type Referrer = { username: string; referrals: number }

type Tier = {
  title: string
  subtitle: string
  badge: string
  icon: "check" | "users" | "users-plus" | "star" | "diamond"
  accent: string // ring + icon color
  badgeClass: string // pill styles
}

const TIERS: Tier[] = [
  {
    title: "Join the waitlist",
    subtitle: "Your username is reserved",
    badge: "INSTANT",
    icon: "check",
    accent: "text-emerald-400",
    badgeClass: "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  {
    title: "1 referral",
    subtitle: "Move up a spot",
    badge: "+1",
    icon: "users",
    accent: "text-muted-foreground",
    badgeClass: "border border-border bg-secondary text-foreground",
  },
  {
    title: "3 referrals",
    subtitle: "Early access to Raxs",
    badge: "EARLY ACCESS",
    icon: "users-plus",
    accent: "text-violet-300",
    badgeClass: "border border-violet-500/40 bg-violet-500/15 text-violet-200",
  },
  {
    title: "5 referrals",
    subtitle: "Founding Member badge",
    badge: "FOUNDING",
    icon: "star",
    accent: "text-amber-300",
    badgeClass: "border border-amber-500/40 bg-amber-500/10 text-amber-200",
  },
  {
    title: "10 referrals",
    subtitle: "Exclusive profile theme",
    badge: "VIP ACCESS",
    icon: "diamond",
    accent: "text-indigo-300",
    badgeClass: "border border-indigo-500/40 bg-indigo-500/15 text-indigo-200",
  },
]

function TierIcon({ name, className }: { name: Tier["icon"]; className?: string }) {
  const common = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  switch (name) {
    case "check":
      return (
        <svg {...common}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      )
    case "users":
      return (
        <svg {...common}>
          <path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="3" />
          <path d="M21 20v-2a4 4 0 0 0-3-3.87" />
        </svg>
      )
    case "users-plus":
      return (
        <svg {...common}>
          <path d="M14 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="8" cy="7" r="3" />
          <path d="M19 8v6M22 11h-6" />
        </svg>
      )
    case "star":
      return (
        <svg {...common}>
          <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8-4.3-4.1 5.9-.9L12 3z" />
        </svg>
      )
    case "diamond":
      return (
        <svg {...common}>
          <path d="M6 3h12l3 6-9 12L3 9l3-6z" />
          <path d="M3 9h18M9 3l3 6 3-6M12 21 9 9M12 21l3-12" />
        </svg>
      )
  }
}

const RANK_STYLES = [
  "text-foreground",
  "text-muted-foreground",
  "text-muted-foreground/70",
]

export function ReferralTiers() {
  return (
    <ul aria-label="Referral rewards" className="space-y-3">
      {TIERS.map((tier) => (
        <li
          key={tier.title}
          className="flex items-center gap-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm px-4 py-4 transition-colors hover:bg-card/80"
        >
          <span
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current/30 bg-secondary/60 ${tier.accent}`}
          >
            <TierIcon name={tier.icon} className="h-5 w-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-foreground leading-tight">{tier.title}</span>
            <span className="block text-sm text-muted-foreground leading-tight">{tier.subtitle}</span>
          </span>

          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${tier.badgeClass}`}
          >
            {tier.badge}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function TopReferrers() {
  const [referrers, setReferrers] = useState<Referrer[] | null>(null)

  useEffect(() => {
    getTopReferrers().then(setReferrers)
  }, [])

  return (
    <div
      aria-label="Top referrers"
      className="space-y-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground tracking-wide">Top referrers</h2>
        <span className="text-xs text-muted-foreground">Refer to climb</span>
      </div>

      <ol className="space-y-2">
        {referrers === null ? (
          Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg bg-input/50 px-3 py-2 animate-pulse">
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
            <li key={r.username} className="flex items-center justify-between rounded-lg bg-input/50 px-3 py-2">
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
  )
}

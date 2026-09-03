"use client"

import { useState } from "react"

interface Signup {
  id: number
  name: string
  email: string
  username: string | null
  referral: string | null
  createdAt: Date
}

interface AdminTableProps {
  signups: Signup[]
}

export function AdminTable({ signups }: AdminTableProps) {
  const [search, setSearch] = useState("")
  const [sortByReferrals, setSortByReferrals] = useState(false)

  // Count how many signups used each username as their referral code
  const referralCounts = new Map<string, number>()
  for (const s of signups) {
    if (s.referral) {
      const ref = s.referral.toLowerCase()
      referralCounts.set(ref, (referralCounts.get(ref) ?? 0) + 1)
    }
  }
  const getReferralCount = (username: string | null) =>
    username ? (referralCounts.get(username.toLowerCase()) ?? 0) : 0

  const filteredSignups = signups.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.username?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  const sortedSignups = sortByReferrals
    ? [...filteredSignups].sort(
        (a, b) => getReferralCount(b.username) - getReferralCount(a.username)
      )
    : filteredSignups

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filteredSignups.length} of {signups.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  #
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Name
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Email
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Username
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Referral
                </th>
                <th className="text-left px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSortByReferrals((v) => !v)}
                    className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                      sortByReferrals ? "text-white" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Referrals
                    <span className="text-xs">{sortByReferrals ? "↓" : "⇅"}</span>
                  </button>
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Signed Up
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSignups.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {signups.length === 0
                      ? "No signups yet"
                      : "No results found"}
                  </td>
                </tr>
              ) : (
                sortedSignups.map((signup, index) => (
                  <tr
                    key={signup.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {signups.length - signups.findIndex((s) => s.id === signup.id)}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {signup.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {signup.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {signup.username ? `@${signup.username}` : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {signup.referral || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      {getReferralCount(signup.username)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(signup.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

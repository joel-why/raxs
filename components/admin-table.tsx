"use client"

import { useState } from "react"
import { updateSignup } from "@/app/actions/admin"

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

export function AdminTable({ signups: initialSignups }: AdminTableProps) {
  const [signups, setSignups] = useState<Signup[]>(initialSignups)
  const [search, setSearch] = useState("")
  const [sortByReferrals, setSortByReferrals] = useState(false)

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editUsername, setEditUsername] = useState("")
  const [editError, setEditError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const startEditing = (signup: Signup) => {
    setEditingId(signup.id)
    setEditEmail(signup.email)
    setEditUsername(signup.username ?? "")
    setEditError("")
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditError("")
  }

  const saveEditing = async (id: number) => {
    setIsSaving(true)
    setEditError("")
    const result = await updateSignup(id, editEmail, editUsername)
    setIsSaving(false)
    if (!result.success) {
      setEditError(result.error ?? "Something went wrong")
      return
    }
    setSignups((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, email: result.email!, username: result.username! } : s
      )
    )
    setEditingId(null)
  }

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

  // Compute each signup's true waitlist position: signup order (by id) adjusted
  // by referrals — each referral moves a user up one spot, jumping the person
  // directly ahead. This mirrors the public "Check your spot" checker.
  const positionById = new Map<number, number>()
  ;[...signups]
    .sort((a, b) => a.id - b.id)
    .map((s, index) => ({ id: s.id, referrals: getReferralCount(s.username), basePosition: index + 1 }))
    .sort((a, b) => {
      const scoreA = a.basePosition - a.referrals
      const scoreB = b.basePosition - b.referrals
      if (scoreA !== scoreB) return scoreA - scoreB
      if (a.referrals !== b.referrals) return b.referrals - a.referrals
      return a.basePosition - b.basePosition
    })
    .forEach((s, index) => positionById.set(s.id, index + 1))

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
    : [...filteredSignups].sort(
        (a, b) => (positionById.get(a.id) ?? 0) - (positionById.get(b.id) ?? 0)
      )

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
                <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSignups.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {signups.length === 0
                      ? "No signups yet"
                      : "No results found"}
                  </td>
                </tr>
              ) : (
                sortedSignups.map((signup) => (
                  <tr
                    key={signup.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {positionById.get(signup.id)}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {signup.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {editingId === signup.id ? (
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full min-w-[180px] bg-[#1a1a1a] border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                        />
                      ) : (
                        signup.email
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {editingId === signup.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">@</span>
                          <input
                            type="text"
                            value={editUsername}
                            onChange={(e) =>
                              setEditUsername(
                                e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 30)
                              )
                            }
                            className="w-full min-w-[120px] bg-[#1a1a1a] border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                          />
                        </div>
                      ) : signup.username ? (
                        `@${signup.username}`
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {signup.referral || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      {getReferralCount(signup.username)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(signup.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                      {editingId === signup.id ? (
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => saveEditing(signup.id)}
                              disabled={isSaving}
                              className="text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded px-3 py-1 text-xs font-medium transition-colors"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              disabled={isSaving}
                              className="text-muted-foreground hover:text-white rounded px-3 py-1 text-xs font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                          {editError && (
                            <span className="text-xs text-red-400 text-right max-w-[220px]">{editError}</span>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditing(signup)}
                          className="text-muted-foreground hover:text-white rounded px-3 py-1 text-xs font-medium transition-colors"
                        >
                          Edit
                        </button>
                      )}
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

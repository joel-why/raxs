"use client"

import { useState } from "react"

interface Signup {
  id: number
  name: string
  email: string
  createdAt: Date
}

interface AdminTableProps {
  signups: Signup[]
}

export function AdminTable({ signups }: AdminTableProps) {
  const [search, setSearch] = useState("")

  const filteredSignups = signups.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
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
          placeholder="Search by name or email..."
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
                  Signed Up
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSignups.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {signups.length === 0
                      ? "No signups yet"
                      : "No results found"}
                  </td>
                </tr>
              ) : (
                filteredSignups.map((signup, index) => (
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

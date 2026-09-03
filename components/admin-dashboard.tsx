'use client'

import { useState, useEffect } from 'react'
import { checkAdminAuth, logoutAdmin } from '@/app/actions/admin'
import { AdminLogin } from '@/components/admin-login'
import { AdminTable } from '@/components/admin-table'
import { Button } from '@/components/ui/button'

interface AdminDashboardProps {
  signups: {
    id: number
    name: string
    email: string
    username: string | null
    referral: string | null
    createdAt: Date
  }[]
  totalCount: number
  initialAuth: boolean
}

export function AdminDashboard({ signups, totalCount, initialAuth }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth)

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />
  }

  const todayCount = signups.filter(s => {
    const today = new Date()
    const signupDate = new Date(s.createdAt)
    return signupDate.toDateString() === today.toDateString()
  }).length

  const weekCount = signups.filter(s => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(s.createdAt) >= weekAgo
  }).length

  const handleLogout = async () => {
    await logoutAdmin()
    setIsAuthenticated(false)
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Username', 'Referral', 'Signed Up']
    const rows = signups.map(s => [
      s.name,
      s.email,
      s.username ? `@${s.username}` : '',
      s.referral ?? '',
      new Date(s.createdAt).toLocaleString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <main className="min-h-screen py-12 px-4" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-white">Waitlist Admin</h1>
            <p className="text-muted-foreground">
              Manage and view all waitlist signups
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
            >
              Export CSV
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141414] border border-white/10 rounded-lg p-6">
            <p className="text-sm text-muted-foreground">Total Signups</p>
            <p className="text-3xl font-semibold text-white mt-1">{totalCount}</p>
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-lg p-6">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-3xl font-semibold text-white mt-1">{todayCount}</p>
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-lg p-6">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-3xl font-semibold text-white mt-1">{weekCount}</p>
          </div>
        </div>

        {/* Table */}
        <AdminTable signups={signups} />

        {/* Back link */}
        <div className="pt-4">
          <a 
            href="/" 
            className="text-sm text-muted-foreground hover:text-white transition-colors"
          >
            &larr; Back to waitlist
          </a>
        </div>
      </div>
    </main>
  )
}

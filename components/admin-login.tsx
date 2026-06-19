'use client'

import { useState } from 'react'
import { verifyAdminPassword } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const isValid = await verifyAdminPassword(password)
    
    if (isValid) {
      onSuccess()
    } else {
      setError('Invalid password')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-white">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-[#141414] border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-white text-black hover:bg-white/90 font-medium py-3"
          >
            {isLoading ? 'Verifying...' : 'Enter'}
          </Button>
        </form>

        <div className="text-center">
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

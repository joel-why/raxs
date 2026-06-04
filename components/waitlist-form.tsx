"use client"

import { useState, useEffect } from "react"
import { MoneyConfetti } from "./money-confetti"
import { getWaitlistCount, joinWaitlist } from "@/app/actions/waitlist"

export function WaitlistForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [signupCount, setSignupCount] = useState<number | null>(null)

  // Fetch the initial count from the database
  useEffect(() => {
    getWaitlistCount().then(setSignupCount)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await joinWaitlist(name.trim(), email.trim())
      
      if (result.success) {
        setIsSubmitted(true)
        setShowConfetti(true)
        setSignupCount(result.count)
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch {
      setError("This email is already on the waitlist!")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <MoneyConfetti isActive={showConfetti} />
        <div className="w-full max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-foreground/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-foreground">{"You're on the list!"}</h3>
          <p className="text-muted-foreground text-sm">
            {"We'll notify you when we launch. Thanks for joining!"}
          </p>
          <p className="text-muted-foreground text-xs pt-2">
            You joined {signupCount?.toLocaleString() ?? "..."} others on the waitlist
          </p>
        </div>
      </>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Social Proof */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Join{" "}
          <span className="text-foreground font-medium">
            {signupCount !== null ? `${signupCount.toLocaleString()}+` : "..."}
          </span>{" "}
          others on the waitlist
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
          />
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Joining...
            </span>
          ) : (
            "Join the waitlist"
          )}
        </button>
      </form>
    </div>
  )
}

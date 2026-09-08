"use client"

import { useState, useEffect, useRef } from "react"
import { MoneyConfetti } from "./money-confetti"
import { getWaitlistCount, requestWaitlistVerification, verifyAndJoinWaitlist } from "@/app/actions/waitlist"

type Step = "form" | "verify" | "done"

export function WaitlistForm() {
  const [step, setStep] = useState<Step>("form")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [referral, setReferral] = useState("")
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [signupCount, setSignupCount] = useState<number | null>(null)
  const [resendMessage, setResendMessage] = useState("")
  const codeInputRef = useRef<HTMLInputElement>(null)

  // Fetch the initial count from the database
  useEffect(() => {
    getWaitlistCount().then(setSignupCount)
  }, [])

  // Pre-fill the referral code from a ?ref= share link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get("ref")
    if (ref) {
      setReferral(ref.toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 30))
    }
  }, [])

  // Move focus to the code field when the verification step appears
  useEffect(() => {
    if (step === "verify") codeInputRef.current?.focus()
  }, [step])

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!username.trim()) {
      setError("Please choose a username to claim")
      return
    }

    if (!/^[a-z0-9._]{3,30}$/.test(username.trim())) {
      setError("Usernames must be 3-30 characters: lowercase letters, numbers, periods, or underscores")
      return
    }

    if (referral.trim() && referral.trim().toLowerCase() === username.trim().toLowerCase()) {
      setError("You can't refer yourself!")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await requestWaitlistVerification(email.trim(), username.trim(), referral.trim())
      if (result.success) {
        setStep("verify")
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from your email")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await verifyAndJoinWaitlist(email.trim(), code.trim())
      if (result.success) {
        setStep("done")
        setShowConfetti(true)
        setSignupCount(result.count)
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    setError("")
    setResendMessage("")
    setIsSubmitting(true)
    try {
      const result = await requestWaitlistVerification(email.trim(), username.trim(), referral.trim())
      if (result.success) {
        setResendMessage("A new code is on its way.")
      } else {
        setError(result.error || "Couldn't resend the code")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === "done") {
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
            You claimed <span className="text-foreground font-medium">@{username}</span>. {"We'll notify you when we launch!"}
          </p>
          <p className="text-muted-foreground text-xs pt-2">
            You joined {signupCount?.toLocaleString() ?? "..."} others on the waitlist
          </p>
        </div>
      </>
    )
  }

  if (step === "verify") {
    return (
      <div className="w-full max-w-md space-y-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Check your inbox</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>. Enter it below to claim your spot.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <input
            ref={codeInputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              setResendMessage("")
            }}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground text-center text-2xl tracking-[0.5em] font-mono placeholder:text-muted-foreground placeholder:tracking-[0.5em] focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {resendMessage && <p className="text-sm text-muted-foreground">{resendMessage}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify & claim my @"
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              setStep("form")
              setCode("")
              setError("")
              setResendMessage("")
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Use a different email
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Resend code
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Social Proof */}
      <div>
        <p className="text-sm text-muted-foreground">
          Join{" "}
          <span className="text-foreground font-medium">
            {signupCount !== null ? `${signupCount.toLocaleString()}+` : "..."}
          </span>{" "}
          others on the waitlist
        </p>
      </div>

      <form onSubmit={handleRequestCode} className="space-y-3">
        <div>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
          />
        </div>
        <div>
          <div className="flex items-center w-full bg-input border border-border rounded-lg focus-within:ring-1 focus-within:ring-foreground/20 transition-all">
            <span className="pl-4 text-muted-foreground select-none">@</span>
            <input
              type="text"
              inputMode="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 30))}
              className="w-full pl-1 pr-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            This will also be your referral code
          </p>
        </div>
        <div>
          <input
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Referral code (optional)"
            value={referral}
            onChange={(e) => setReferral(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 30))}
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
              Sending code...
            </span>
          ) : (
            "Claim my @"
          )}
        </button>
      </form>
    </div>
  )
}

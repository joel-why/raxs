"use client"

import { useState } from "react"

export function ReferralShare() {
  const [username, setUsername] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const buildLink = () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : ""
    return `${origin}/?ref=${username.trim()}`
  }

  const handleShare = async () => {
    setError("")

    if (!username.trim()) {
      setError("Enter your username to generate your link")
      return
    }

    if (!/^[a-z0-9._]{3,30}$/.test(username.trim())) {
      setError("Usernames must be 3-30 characters: lowercase letters, numbers, periods, or underscores")
      return
    }

    const link = buildLink()

    // Prefer the native share sheet on supported devices
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Join me on the Rax$ waitlist",
          text: `Claim your username on Rax$ using my referral code @${username.trim()}`,
          url: link,
        })
        return
      } catch {
        // User dismissed the share sheet or it failed — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Couldn't copy the link. Please copy it manually.")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground tracking-wide">Share your referral link</h3>
        <p className="text-xs text-muted-foreground">
          Enter your username to generate a link that credits every signup to you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center flex-1 bg-input border border-border rounded-lg focus-within:ring-1 focus-within:ring-foreground/20 transition-all">
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
            className="w-full pl-1 pr-4 py-2.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-foreground/90 active:scale-95 whitespace-nowrap"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share link
            </>
          )}
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

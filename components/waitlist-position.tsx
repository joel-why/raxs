"use client"

import { useState } from "react"
import { getWaitlistPosition } from "@/app/actions/waitlist"

type Result =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "found"; position: number; total: number; username: string | null }
  | { state: "not-found" }

export function WaitlistPosition() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<Result>({ state: "idle" })

  const handleCheck = async () => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResult({ state: "idle" })
      return
    }

    setResult({ state: "loading" })
    const res = await getWaitlistPosition(trimmed)
    if (res.found && res.position && res.total) {
      setResult({ state: "found", position: res.position, total: res.total, username: res.username ?? null })
    } else {
      setResult({ state: "not-found" })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      handleCheck()
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground tracking-wide">Check your spot</h3>
        <p className="text-xs text-muted-foreground">
          Enter your username or email to see where you landed on the list.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center flex-1 bg-input border border-border rounded-lg focus-within:ring-1 focus-within:ring-foreground/20 transition-all">
          <input
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="username or email"
            value={query}
            onChange={(e) => setQuery(e.target.value.toLowerCase().slice(0, 120))}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleCheck}
          disabled={result.state === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-foreground/90 active:scale-95 disabled:opacity-60 whitespace-nowrap"
        >
          {result.state === "loading" ? "Checking..." : "Check spot"}
        </button>
      </div>

      {result.state === "found" && (
        <div className="flex items-baseline justify-between rounded-lg bg-input/50 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {result.username ? `@${result.username}` : "You're"} on the list
          </span>
          <span className="text-lg font-bold text-foreground">
            #{result.position.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground"> of {result.total.toLocaleString()}</span>
          </span>
        </div>
      )}

      {result.state === "not-found" && (
        <p className="text-xs text-red-400">
          We couldn&apos;t find that username on the waitlist. Double-check the spelling or join above.
        </p>
      )}
    </div>
  )
}

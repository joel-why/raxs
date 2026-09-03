"use client"

import { useEffect, useState } from "react"
import { getWaitlistCount } from "@/app/actions/waitlist"

export function WaitlistCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    getWaitlistCount().then(setCount)
  }, [])

  return (
    <p className="text-sm text-muted-foreground">
      <span className="text-foreground font-medium">
        {count !== null ? `${count.toLocaleString()}+` : "..."}
      </span>{" "}
      people already waiting
    </p>
  )
}

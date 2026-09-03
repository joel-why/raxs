"use client"

import { useEffect, useState } from "react"

export function SiteNav() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(-100%)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <a href="#top" className="flex items-center gap-2" aria-label="Raxs home">
          <img src="/images/logo.png" alt="Raxs" className="h-7 w-auto mix-blend-screen" />
        </a>
        <a
          href="#waitlist"
          className="inline-flex items-center rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium tracking-wide transition-transform hover:scale-[1.03] active:scale-95"
        >
          Claim my @
        </a>
      </div>
    </header>
  )
}

"use client"

import { useState, useEffect } from "react"

export function AnimatedLogo() {
  const [isDrawn, setIsDrawn] = useState(false)
  const [showGlow, setShowGlow] = useState(false)

  useEffect(() => {
    // Start drawing animation immediately
    const drawTimer = setTimeout(() => {
      setIsDrawn(true)
    }, 100)

    // Start glow after drawing completes
    const glowTimer = setTimeout(() => {
      setShowGlow(true)
    }, 1800)

    return () => {
      clearTimeout(drawTimer)
      clearTimeout(glowTimer)
    }
  }, [])

  return (
    <div className="relative flex items-center justify-center lg:justify-start">
      {/* Pulsating white glow behind logo */}
      <div
        className="absolute inset-0 flex items-center justify-center -z-10"
      >
        <div
          className="w-[300px] sm:w-[400px] md:w-[500px] h-[150px] sm:h-[200px] md:h-[250px] rounded-full bg-white/20 blur-[80px] transition-opacity duration-1000"
          style={{
            opacity: showGlow ? 1 : 0,
            animation: showGlow ? "pulse-glow-centered 3s ease-in-out infinite" : "none",
          }}
        />
      </div>

      {/* Logo with drawing animation */}
      <div className="relative overflow-hidden">
        <img
          src="/images/logo.png"
          alt="Raxs"
          className="h-[125px] sm:h-[165px] md:h-[208px] w-auto mx-auto lg:mx-0 relative z-10 mix-blend-screen"
        />
        {/* Drawing mask - reveals from left to right */}
        <div
          className="absolute inset-0 bg-[#0a0a0a] z-20 transition-transform ease-out"
          style={{
            transform: isDrawn ? "translateX(100%)" : "translateX(0)",
            transitionDuration: "1.5s",
          }}
        />
        {/* Soft edge for smoother reveal */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/60 to-[#0a0a0a] z-20 transition-transform ease-out"
          style={{
            transform: isDrawn ? "translateX(200%)" : "translateX(-20%)",
            transitionDuration: "1.8s",
          }}
        />
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

interface MoneyConfettiProps {
  isActive: boolean
}

const MONEY_EMOJIS = ["💵", "💰", "🤑", "💸", "💲"]

export function MoneyConfetti({ isActive }: MoneyConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    emoji: string
    left: number
    delay: number
    duration: number
    size: number
  }>>([])

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        emoji: MONEY_EMOJIS[Math.floor(Math.random() * MONEY_EMOJIS.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 20 + Math.random() * 20,
      }))
      setParticles(newParticles)

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([])
      }, 4500)

      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute -top-12"
          style={{
            left: `${particle.left}%`,
            fontSize: `${particle.size}px`,
            animation: `money-fall ${particle.duration}s linear ${particle.delay}s forwards`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  )
}

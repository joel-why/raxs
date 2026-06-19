"use client"

import { useEffect, useState } from "react"

interface FlyingMoney {
  id: number
  startY: number
  duration: number
  direction: "left" | "right"
  // Random path control points
  wave1: number
  wave2: number
  wave3: number
}

export function FlyingMoneyAnimation() {
  const [moneyItems, setMoneyItems] = useState<FlyingMoney[]>([])

  useEffect(() => {
    let idCounter = 0

    const spawnMoney = () => {
      const newMoney: FlyingMoney = {
        id: idCounter++,
        startY: Math.random() * 50 + 15, // 15-65% from top
        duration: Math.random() * 3 + 5, // 5-8 seconds
        direction: Math.random() > 0.5 ? "left" : "right",
        // Random wave amplitudes for wavy path
        wave1: (Math.random() - 0.5) * 80,
        wave2: (Math.random() - 0.5) * 60,
        wave3: (Math.random() - 0.5) * 40,
      }

      setMoneyItems((prev) => [...prev, newMoney])

      // Remove after animation completes
      setTimeout(() => {
        setMoneyItems((prev) => prev.filter((m) => m.id !== newMoney.id))
      }, (newMoney.duration + 1) * 1000)
    }

    // Spawn first one after a short delay
    const initialTimeout = setTimeout(spawnMoney, 2000)

    // Spawn every 4-8 seconds
    const interval = setInterval(() => {
      spawnMoney()
    }, Math.random() * 4000 + 4000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {moneyItems.map((money) => (
        <div
          key={money.id}
          className="absolute text-3xl sm:text-4xl"
          style={{
            top: `${money.startY}%`,
            left: money.direction === "right" ? "-50px" : "auto",
            right: money.direction === "left" ? "-50px" : "auto",
            animation: `fly-wavy-${money.direction} ${money.duration}s linear forwards`,
            // Pass random values as CSS custom properties
            ["--wave1" as string]: `${money.wave1}px`,
            ["--wave2" as string]: `${money.wave2}px`,
            ["--wave3" as string]: `${money.wave3}px`,
          }}
        >
          💸
        </div>
      ))}
    </div>
  )
}

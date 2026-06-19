import { AnimatedLogo } from "@/components/animated-logo"
import { FlyingMoneyAnimation } from "@/components/flying-money"
import { Footer } from "@/components/footer"
import { WaitlistForm } from "@/components/waitlist-form"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <FlyingMoneyAnimation />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {/* Content - Centered */}
        <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            <span className="text-sm text-muted-foreground tracking-wide">Get early access</span>
          </div>

          {/* Animated Logo */}
          <AnimatedLogo />

          <p className="text-muted-foreground text-base sm:text-lg max-w-md text-pretty">
            Be the first to know when we launch. Sign up for our waitlist and join the movement.
          </p>

          {/* Waitlist Form */}
          <WaitlistForm />

          {/* Footer note */}
          <p className="text-xs text-muted-foreground/60">
            By joining, you agree to receive updates about our launch.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

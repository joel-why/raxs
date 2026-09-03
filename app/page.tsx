import { AnimatedLogo } from "@/components/animated-logo"
import { FlyingMoneyAnimation } from "@/components/flying-money"
import { Footer } from "@/components/footer"
import { PhoneShowcase } from "@/components/phone-showcase"
import { ReferralLeaderboard } from "@/components/referral-leaderboard"
import { WaitlistForm } from "@/components/waitlist-form"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <FlyingMoneyAnimation />

      <main className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-start gap-12 lg:gap-10">
          {/* Left Column - Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              <span className="text-sm text-muted-foreground tracking-wide">Get early access</span>
            </div>

            {/* Animated Logo */}
            <AnimatedLogo />

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance">
                Flex, Flaunt, Flash.
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-muted-foreground text-balance max-w-lg">
                The social platform for cars, fashion, watches, collectibles, &amp; more.
              </p>
            </div>

            {/* Waitlist Form */}
            <div className="w-full flex flex-col items-center lg:items-start">
              <WaitlistForm />

              {/* Footer note */}
              <p className="text-xs text-muted-foreground/60 mt-4">
                By joining, you agree to receive updates about our launch.
              </p>
            </div>
          </div>

          {/* Right Column - Phone Showcase + Referral tracker */}
          <div className="order-2 w-full flex flex-col gap-10">
            <PhoneShowcase />

            {/* Referral leaderboard & rewards */}
            <ReferralLeaderboard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

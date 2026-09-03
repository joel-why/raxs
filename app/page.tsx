import { AnimatedLogo } from "@/components/animated-logo"
import { FlyingMoneyAnimation } from "@/components/flying-money"
import { Footer } from "@/components/footer"
import { PhoneShowcase } from "@/components/phone-showcase"
import { ReferralLeaderboard } from "@/components/referral-leaderboard"
import { ScrollCue } from "@/components/scroll-cue"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SiteNav } from "@/components/site-nav"
import { WaitlistForm } from "@/components/waitlist-form"

export default function Home() {
  return (
    <div id="top" className="relative">
      <FlyingMoneyAnimation />
      <SiteNav />

      {/* Section 1 — Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex flex-col items-center gap-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            <span className="text-sm text-muted-foreground tracking-wide">Get early access</span>
          </div>

          <AnimatedLogo />

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground tracking-tight text-balance">
              Flex, Flaunt, Flash.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground text-balance max-w-xl mx-auto">
              The social platform for cars, fashion, watches, collectibles, &amp; more.
            </p>
          </div>

          <a
            href="#waitlist"
            className="inline-flex items-center rounded-full bg-foreground text-background px-8 py-3.5 text-base font-medium tracking-wide transition-transform hover:scale-[1.03] active:scale-95"
          >
            Claim your username
          </a>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ScrollCue />
        </div>
      </section>

      {/* Section 2 — Showcase */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <ScrollReveal className="max-w-2xl text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance">
            A feed built to flex.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Show off what you own, discover what&apos;s trending, and follow the culture across cars, fashion,
            watches, and collectibles.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120} className="w-full max-w-md">
          <PhoneShowcase />
        </ScrollReveal>
      </section>

      {/* Section 3 — Waitlist / claim username */}
      <section id="waitlist" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 scroll-mt-20">
        <ScrollReveal className="w-full max-w-md flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance">
            Claim your spot.
          </h2>
          <p className="mt-4 mb-8 text-base sm:text-lg text-muted-foreground text-balance">
            Lock in your username before we launch. First come, first served.
          </p>

          <WaitlistForm />

          <p className="text-xs text-muted-foreground/60 mt-4">
            By joining, you agree to receive updates about our launch.
          </p>
        </ScrollReveal>
      </section>

      {/* Section 4 — Referrals */}
      <section id="referrals" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 scroll-mt-20">
        <ScrollReveal className="max-w-2xl text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance">
            Climb the ranks.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Invite friends with your username as your referral code and unlock exclusive rewards.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120} className="w-full max-w-lg">
          <ReferralLeaderboard />
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}

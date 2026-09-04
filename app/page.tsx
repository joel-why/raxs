import { AnimatedLogo } from "@/components/animated-logo"
import { FlyingMoneyAnimation } from "@/components/flying-money"
import { Footer } from "@/components/footer"
import { PhoneShowcase } from "@/components/phone-showcase"
import { ReferralLeaderboard } from "@/components/referral-leaderboard"
import { ReferralShare } from "@/components/referral-share"
import { ScrollCue } from "@/components/scroll-cue"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SiteNav } from "@/components/site-nav"
import { WaitlistCount } from "@/components/waitlist-count"
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-foreground tracking-tight leading-[0.95] text-balance">
              Your Purchases. Verified.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground text-pretty max-w-3xl mx-auto">
              Post what you buy. Verify what you paid. Build your verified spend. Cars, fashion, watches, collectibles, &amp; more.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center rounded-full bg-foreground text-background px-8 py-3.5 text-base font-medium tracking-wide transition-transform hover:scale-[1.03] active:scale-95"
            >
              Claim your username
            </a>
            <WaitlistCount />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ScrollCue />
        </div>
      </section>

      {/* Section 2 — Showcase */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <ScrollReveal className="max-w-2xl text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-foreground tracking-tight leading-[0.95] text-balance">
            If you bought it, post it.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Supercars or sneakers. Coffee or Cartier. Every purchase adds to your profile. Verify your purchases
            to build your Verified Spend, no matter the item.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120} className="w-full max-w-md">
          <PhoneShowcase />
        </ScrollReveal>
      </section>

      {/* Section 3 — Claim your spot */}
      <section id="waitlist" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 scroll-mt-20">
        <ScrollReveal className="w-full max-w-md mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-foreground tracking-tight leading-[0.95] text-balance">
            Claim your @ before someone else does.
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

      {/* Section 4 — Climb the ranks */}
      <section id="referrals" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 scroll-mt-20">
        <ScrollReveal className="w-full max-w-md mx-auto mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Move up the waitlist
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold uppercase text-foreground tracking-tight leading-[0.95] text-balance">
            Get rewarded for spreading the word.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground text-pretty">
            Invite your friends. Climb the list. Unlock exclusive rewards.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120} className="w-full max-w-md">
          <ReferralLeaderboard />
          <ReferralShare />
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}

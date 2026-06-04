import { AnimatedLogo } from "@/components/animated-logo"
import { FlyingMoneyAnimation } from "@/components/flying-money"
import { Footer } from "@/components/footer"
import { WaitlistForm } from "@/components/waitlist-form"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <FlyingMoneyAnimation />
      
      {/* Phone Mockup - Absolutely positioned on left */}
      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <img
          src="/images/phone-mockup.png"
          alt="Raxs App Preview"
          className="w-[500px] xl:w-[550px] 2xl:w-[600px] h-auto mix-blend-lighten"
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
        {/* Content - Centered on right side for desktop */}
        <div className="w-full max-w-md lg:max-w-lg lg:ml-auto lg:mr-[10%] xl:mr-[15%] flex flex-col items-center text-center space-y-8">
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
          
          {/* Phone for mobile only */}
          <div className="lg:hidden mt-8">
            <img
              src="/images/phone-mockup.png"
              alt="Raxs App Preview"
              className="w-[280px] sm:w-[320px] h-auto mix-blend-lighten"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

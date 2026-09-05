import { Camera, ReceiptText, BarChart3 } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "POST",
    description: "Share something you purchased.",
  },
  {
    number: "02",
    icon: ReceiptText,
    title: "VERIFY",
    description: "Verify the purchase with your receipt.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "RAX UP",
    description: "Build your Verified Spend and collection.",
  },
]

export function RaxsProcess() {
  return (
    <div className="w-full">
      <div className="inline-flex items-center rounded-full border border-border bg-card/50 px-4 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          The Raxs Process
        </span>
      </div>

      <h2 className="mt-6 text-5xl sm:text-6xl font-bold uppercase text-foreground tracking-tight leading-[0.9] text-balance">
        Post.
        <br />
        Verify.
        <br />
        Rax Up.
      </h2>

      <ol className="mt-12 space-y-8">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <li key={step.number} className="relative flex items-start gap-5">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <span className="absolute left-7 top-14 h-[calc(100%+2rem)] w-px bg-border" aria-hidden="true" />
              )}

              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                <Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
              </div>

              <div className="pt-1">
                <span className="text-sm font-medium text-muted-foreground">{step.number}</span>
                <h3 className="mt-1 text-lg font-bold uppercase tracking-wide text-foreground">{step.title}</h3>
                <p className="mt-1 text-base text-muted-foreground text-pretty">{step.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

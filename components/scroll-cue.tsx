export function ScrollCue({ label = "Scroll to explore" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-muted-foreground/70">
      <span className="text-[11px] uppercase tracking-[0.25em]">{label}</span>
      <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-border/70">
        <span className="mt-1.5 h-1.5 w-1 rounded-full bg-muted-foreground/70 animate-scroll-dot" />
      </span>
    </div>
  )
}

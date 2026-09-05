export function PhoneShowcase() {
  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Soft white glow behind phones */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[70%] h-[70%] rounded-full bg-white/10 blur-[100px]" />
      </div>

      {/* Phones (single pre-composed mockup) */}
      <img
        src="/images/phone-showcase.png"
        alt="Raxs app shown on two iPhones: an Explore feed with trending cars and fashion, and a profile showing verified lifetime spend"
        className="relative z-10 w-full max-w-[570px] h-auto drop-shadow-2xl"
      />
    </div>
  )
}

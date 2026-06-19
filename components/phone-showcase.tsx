export function PhoneShowcase() {
  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Soft white glow behind phones */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[70%] h-[70%] rounded-full bg-white/10 blur-[100px]" />
      </div>

      {/* Phones */}
      <div className="relative flex items-center justify-center">
        {/* Back phone - explore/discover screen, rotated and offset right */}
        <img
          src="/images/phone-feed.png"
          alt="Raxs app explore feed showing trending watches, cars, and fashion"
          className="w-[195px] sm:w-[235px] md:w-[270px] lg:w-[290px] xl:w-[320px] h-auto relative z-0 translate-x-[30%] translate-y-[8%] rotate-[9deg] drop-shadow-2xl"
        />
        {/* Front phone - profile screen, rotated opposite (solid, covers the back phone) */}
        <img
          src="/images/phone-profile.png"
          alt="Raxs app profile showing verified spend and luxury posts"
          className="w-[210px] sm:w-[250px] md:w-[290px] lg:w-[315px] xl:w-[345px] h-auto relative z-10 -translate-x-[28%] -translate-y-[2%] -rotate-[5deg] drop-shadow-2xl"
        />
      </div>
    </div>
  )
}

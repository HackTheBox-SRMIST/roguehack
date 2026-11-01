export default function Hero() {
  return (
    <section className="flex shrink-0 flex-col items-center gap-3 pb-4 pt-1 text-center">
      <div className="relative inline-block -rotate-1">
        <h1 className="display border-4 border-ink bg-lime px-4 py-1.5 text-[clamp(2.45rem,min(6.4vw,10dvh),5rem)] italic leading-[0.95] tracking-tight shadow-brutal-lg sm:px-6">
          ROGUEHACK
        </h1>
        <span className="display absolute -right-4 -top-5 rotate-12 border-3 border-ink bg-white px-2 py-0.5 text-lg shadow-brutal-sm sm:-right-6 sm:text-2xl">
          1.0
        </span>
      </div>

      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[9px] font-bold tracking-[0.16em] text-ink/65 sm:text-[11px]">
        <span>RANDOM THEME</span>
        <span aria-hidden="true" className="text-ink/35">
          ✕
        </span>
        <span>RANDOM PROBLEM</span>
      </p>
    </section>
  );
}

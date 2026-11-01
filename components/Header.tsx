export default function Header() {
  return (
    <header className="flex shrink-0 items-center justify-center pb-6 pt-4 sm:pb-6 sm:pt-5">
      <div className="flex items-center justify-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/logo.png" alt="Hack The Box" className="h-7 w-auto object-contain sm:h-8" />
        <p className="font-mono text-[11px] font-black tracking-[0.2em] text-ink sm:text-sm">
          HTB CHENNAI – SRMIST PRESENTS
        </p>
      </div>
    </header>
  );
}

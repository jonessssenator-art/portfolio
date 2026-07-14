/**
 * Логотип «Kozdzuoglu Parfum»: крупное серифное «Kozdzuoglu» с золотой «o»,
 * под ним/сбоку разрежённое PARFUM под парящей золотой линией.
 * Без капель и иконок-клише — чистая типографика.
 */

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 sm:gap-2.5 ${className ?? ''}`}>
      <span className="font-display text-[18px] leading-none tracking-tight text-ivory sm:text-[30px]">
        K<span className="text-gold">o</span>zdzuoglu
      </span>
      <span className="relative hidden pb-[3px] sm:inline-block">
        <span aria-hidden className="absolute -top-1.5 left-0 right-0 h-px bg-gold/70" />
        <span className="font-display text-[15px] uppercase leading-none tracking-[0.3em] text-ivory">
          Parfum
        </span>
      </span>
    </span>
  );
}

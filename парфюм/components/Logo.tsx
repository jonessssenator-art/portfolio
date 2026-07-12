/**
 * Логотип «27 Souls» (вариант serif-3): крупное «27» на одной базовой линии
 * с разрежённым SOULS, золотая «O» (ноль/душа) и парящая золотая линия.
 * Без капель и иконок-клише — чистая типографика.
 */

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2.5 ${className ?? ''}`}>
      <span className="font-display text-[32px] leading-none tracking-tight text-ivory">27</span>
      <span className="relative pb-[3px]">
        <span aria-hidden className="absolute -top-1.5 left-0 right-0 h-px bg-gold/70" />
        <span className="font-display text-[15px] uppercase leading-none tracking-[0.3em] text-ivory">
          S<span className="text-gold">o</span>uls
        </span>
      </span>
    </span>
  );
}

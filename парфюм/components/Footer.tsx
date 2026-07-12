import Link from 'next/link';
import { SHOP } from '@/lib/config';
import { LogoWordmark } from './Logo';
import { TelegramIcon } from './icons';

export default function Footer() {
  return (
    <footer className="border-t hairline bg-coal pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
      <div className="container-m27 grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <LogoWordmark />
          <p className="mt-2 text-[11px] uppercase tracking-widest2 text-gold">{SHOP.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-smoke">
            Только оригинальная парфюмерия. Каждый флакон проверяется по батч-коду,
            чек и подтверждение подлинности — в каждом заказе.
          </p>
          <a
            href={`https://t.me/${SHOP.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-light"
          >
            <TelegramIcon className="h-4 w-4" />
            Написать в Telegram
          </a>
        </div>

        <div>
          <p className="kicker">Магазин</p>
          <ul className="mt-4 space-y-2.5 text-sm text-smoke">
            <li><Link href="/catalog/" className="transition-colors hover:text-ivory">Каталог</Link></li>
            <li><Link href="/catalog/?g=м" className="transition-colors hover:text-ivory">Мужские ароматы</Link></li>
            <li><Link href="/catalog/?g=ж" className="transition-colors hover:text-ivory">Женские ароматы</Link></li>
            <li><Link href="/favorites/" className="transition-colors hover:text-ivory">Избранное</Link></li>
          </ul>
        </div>

        <div>
          <p className="kicker">Покупателям</p>
          <ul className="mt-4 space-y-2.5 text-sm text-smoke">
            <li>Доставка: СДЭК, Boxberry, Почта России</li>
            <li>Бесплатно от {SHOP.freeShippingFrom.toLocaleString('ru-RU')} ₽</li>
            <li>Оплата при получении или по СБП</li>
            <li>Возврат нераспечатанного флакона — 7 дней</li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="container-m27 flex flex-col gap-1 py-5 text-xs text-smoke/70 sm:flex-row sm:justify-between">
          <p>© 2026 {SHOP.name}. Оригинальная нишевая парфюмерия.</p>
          <p>Сделано с вниманием к деталям</p>
        </div>
      </div>
    </footer>
  );
}

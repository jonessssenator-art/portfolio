'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { SHOP } from '@/lib/config';
import { LogoWordmark } from './Logo';
import ThemeToggle from './ThemeToggle';
import { BagIcon, HeartIcon, SearchIcon, TelegramIcon } from './icons';

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-graphite">
      {count}
    </span>
  );
}

const NAV = [
  { href: '/catalog/', label: 'Каталог' },
  { href: '/#hits', label: 'Хиты' },
  { href: '/catalog/?seg=lo', label: 'До 6 500 ₽' },
  { href: '/#trust', label: 'Подлинность' },
  { href: '/#faq', label: 'Вопросы' },
];

export default function Header() {
  const { cartCount, favs } = useStore();

  return (
    <header className="sticky top-0 z-40">
      {/* информационная полоса: в тёмной теме — приподнятый уголь вместо инверсии */}
      <div className="bg-ivory text-noir dark:bg-graphite dark:text-smoke">
        <div className="container-m27 flex h-8 items-center justify-center gap-6 text-[11px] tracking-wide sm:justify-between">
          <p className="hidden sm:block">Оригиналы · проверка батч-кода · чек в каждом заказе</p>
          <p>Доставка по России 2–5 дней, бесплатно от {SHOP.freeShippingFrom.toLocaleString('ru-RU')} ₽</p>
          <a
            href={`https://t.me/${SHOP.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 transition-opacity hover:opacity-70 sm:flex"
          >
            <TelegramIcon className="h-3 w-3" /> Подбор аромата
          </a>
        </div>
      </div>

      {/* основная панель */}
      <div className="border-b hairline bg-noir/90 backdrop-blur-md">
        <div className="container-m27 flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-75" aria-label="На главную">
            <LogoWordmark />
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] uppercase tracking-[0.12em] text-smoke lg:flex">
            {NAV.map((item) => (
              <Link key={item.label} href={item.href} className="transition-colors hover:text-gold">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/catalog/"
              className="p-2.5 text-ivory transition-colors hover:text-gold"
              aria-label="Поиск по каталогу"
            >
              <SearchIcon className="h-[21px] w-[21px]" />
            </Link>
            <Link
              href="/favorites/"
              className="relative p-2.5 text-ivory transition-colors hover:text-gold"
              aria-label="Избранное"
            >
              <HeartIcon className="h-[21px] w-[21px]" />
              <Badge count={favs.length} />
            </Link>
            <Link
              href="/cart/"
              className="relative p-2.5 text-ivory transition-colors hover:text-gold"
              aria-label="Корзина"
            >
              <BagIcon className="h-[21px] w-[21px]" />
              <Badge count={cartCount} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

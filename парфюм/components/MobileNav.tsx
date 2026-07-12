'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { BagIcon, GridIcon, HeartIcon, HomeIcon } from './icons';

const ITEMS = [
  { href: '/', label: 'Главная', icon: HomeIcon },
  { href: '/catalog/', label: 'Каталог', icon: GridIcon },
  { href: '/favorites/', label: 'Избранное', icon: HeartIcon },
  { href: '/cart/', label: 'Корзина', icon: BagIcon },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { cartCount, favs } = useStore();

  const badgeFor = (href: string) =>
    href === '/cart/' ? cartCount : href === '/favorites/' ? favs.length : 0;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-noir/95 backdrop-blur-md pb-safe md:hidden">
      <div className="grid grid-cols-4">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));
          const badge = badgeFor(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-wide transition-colors ${
                active ? 'text-gold' : 'text-smoke'
              }`}
            >
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" />
                {badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-noir">
                    {badge}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

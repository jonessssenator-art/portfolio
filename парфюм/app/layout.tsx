import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Manrope } from 'next/font/google';
import { StoreProvider } from '@/lib/store';
import { SHOP } from '@/lib/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import './globals.css';

const display = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SHOP.url),
  title: {
    default: `${SHOP.name} — оригинальная нишевая парфюмерия`,
    template: `%s — ${SHOP.name}`,
  },
  description:
    'Оригинальные духи Tom Ford, Creed, Maison Francis Kurkdjian, Le Labo, Byredo с гарантией подлинности. Проверка батч-кода, доставка по России 2–5 дней.',
  keywords: [
    'нишевая парфюмерия',
    'оригинальные духи',
    'купить духи',
    'Tom Ford',
    'Creed Aventus',
    'Baccarat Rouge 540',
  ],
  openGraph: {
    type: 'website',
    siteName: SHOP.name,
    title: `${SHOP.name} — оригинальная нишевая парфюмерия`,
    description: 'Оригинальные духи с гарантией подлинности и доставкой по России.',
    locale: 'ru_RU',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F1E8' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0908' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/* ставит .dark на <html> до первой отрисовки — без вспышки светлой темы */
const themeScript = `(function(){try{var t=localStorage.getItem('theme27');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <StoreProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <MobileNav />
        </StoreProvider>
      </body>
    </html>
  );
}

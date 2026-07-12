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
  themeColor: '#F6F1E8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
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

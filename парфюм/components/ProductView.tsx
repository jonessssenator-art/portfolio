'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GENDER_LABEL, photoSrc, type Product } from '@/lib/products';
import { hasScene, scenePortrait } from '@/lib/scenes';
import { formatPrice } from '@/lib/format';
import { useStore } from '@/lib/store';
import { DELIVERY_OPTIONS, SHOP } from '@/lib/config';
import { BagIcon, CheckIcon, HeartIcon, ShieldIcon, TelegramIcon } from './icons';

const SILLAGE_LABEL = ['едва заметный', 'лёгкий', 'умеренный', 'заметный', 'мощный'];

/* таблица состава: что слышно и когда */
function NotesTable({ notes }: { notes: Product['notes'] }) {
  const rows = [
    { label: 'Верхние ноты', hint: 'первые 15–30 минут', items: notes.top },
    { label: 'Ноты сердца', hint: 'следующие 2–4 часа', items: notes.heart },
    { label: 'Базовые ноты', hint: 'остаются до конца дня', items: notes.base },
  ];
  return (
    <div className="divide-y divide-ivory/10">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[120px_1fr] gap-4 py-3.5 sm:grid-cols-[150px_1fr]">
          <div>
            <p className="text-[13px] font-semibold leading-tight">{r.label}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-smoke">{r.hint}</p>
          </div>
          <p className="self-center text-[14px] leading-relaxed text-ivory/85">{r.items.join(' · ')}</p>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-gold transition-transform duration-300 group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

export default function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const { add, toggleFav, isFav } = useStore();
  const [added, setAdded] = useState(false);
  const fav = isFav(product.slug);

  const scene = hasScene(product.slug) && product.inStock ? scenePortrait(product.slug) : null;

  const addToCart = () => {
    add(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = () => {
    add(product.slug);
    router.push('/cart/');
  };

  const notifyHref = `https://t.me/${SHOP.telegram}?text=${encodeURIComponent(
    `Здравствуйте! Сообщите, когда появится ${product.brand} ${product.name}, ${product.volume} мл.`,
  )}`;

  return (
    <div className="container-m27 py-6 pb-28 sm:py-10 md:pb-16">
      {/* тихие хлебные крошки */}
      <nav className="flex items-center whitespace-nowrap text-xs text-smoke/80">
        <Link href="/" className="transition-colors hover:text-ivory">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/catalog/" className="transition-colors hover:text-ivory">Каталог</Link>
        <span className="mx-2">/</span>
        <span className="min-w-0 truncate">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* галерея: огромное чистое фото, ниже — атмосферный кадр, если есть */}
        <div className="space-y-4 lg:space-y-6">
          <div className="flex items-center justify-center bg-[#FBF9F5] px-6 py-12 sm:py-16">
            <img
              src={photoSrc(product)}
              alt={`${product.brand} ${product.name} — оригинальный флакон`}
              width={750}
              height={1000}
              className={`h-[360px] w-auto max-w-full object-contain sm:h-[480px] ${
                product.inStock ? '' : 'opacity-60 grayscale'
              }`}
            />
          </div>
          {scene && (
            <img
              src={scene}
              alt={`${product.brand} ${product.name} — атмосфера аромата`}
              width={1280}
              height={1714}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          )}
        </div>

        {/* информация: воздух и одна главная кнопка */}
        <div className="lg:sticky lg:top-28 lg:max-w-md lg:self-start">
          {!product.inStock ? (
            <p className="text-[11px] uppercase tracking-widest2 text-smoke">Нет в наличии</p>
          ) : (
            product.tags.includes('хит') && (
              <p className="text-[11px] uppercase tracking-widest2 text-gold">Бестселлер</p>
            )
          )}
          <p className="mt-2 text-[13px] uppercase tracking-[0.16em] text-smoke">{product.brand}</p>
          <h1 className="mt-2 font-display text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-sm text-smoke">
            {product.concentration}, {product.volume} мл · {GENDER_LABEL[product.gender]}
          </p>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ivory/85">{product.desc}</p>

          <p className="mt-6 text-3xl font-bold">{formatPrice(product.price)}</p>

          {product.inStock ? (
            <div className="mt-6 space-y-3">
              <button onClick={buyNow} className="btn-gold w-full">
                Купить сейчас
              </button>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <button onClick={addToCart} className="btn-ghost">
                  {added ? (
                    <>
                      <CheckIcon className="h-4 w-4" /> В корзине
                    </>
                  ) : (
                    <>
                      <BagIcon className="h-4 w-4" /> В корзину
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleFav(product.slug)}
                  aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
                  className={`flex w-14 items-center justify-center border transition-colors ${
                    fav ? 'border-gold text-gold' : 'border-ivory/25 text-smoke hover:border-gold hover:text-gold'
                  }`}
                >
                  <HeartIcon className="h-5 w-5" filled={fav} />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <a href={notifyHref} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
                <TelegramIcon className="h-4 w-4" /> Сообщить о поступлении
              </a>
              <p className="text-sm leading-relaxed text-smoke">
                Напишите нам — сообщим, как только аромат появится, и отложим флакон для вас.
              </p>
            </div>
          )}

          <p className="mt-4 flex items-center gap-2 text-[13px] text-smoke">
            <ShieldIcon className="h-4 w-4 shrink-0 text-gold" />
            Оригинал · чек · фото батч-кода до отправки
          </p>

          {/* детали — тихими раскрывашками */}
          <div className="mt-8 divide-y divide-ivory/10 border-y border-ivory/10">
            <Section title="Состав и раскрытие" defaultOpen>
              <NotesTable notes={product.notes} />
              <p className="mt-3 text-[13px] text-smoke">
                Стойкость — около {product.longevityHours} часов · Шлейф — {SILLAGE_LABEL[product.sillage - 1]}
              </p>
            </Section>

            <Section title="Доставка и оплата">
              <ul className="space-y-2 text-sm text-smoke">
                {DELIVERY_OPTIONS.map((d) => (
                  <li key={d.id} className="flex justify-between gap-4">
                    <span>{d.label}</span>
                    <span className="shrink-0 text-ivory/80">
                      {d.external ? '—' : formatPrice(d.price)} · {d.days}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-smoke">
                Бесплатная доставка от {SHOP.freeShippingFrom.toLocaleString('ru-RU')} ₽.
                Оплата при получении или по СБП.
              </p>
            </Section>

            <Section title="Подлинность">
              <p className="text-sm leading-relaxed text-smoke">
                Батч-код — код партии на дне флакона и коробке, он проверяется в открытых базах.
                Мы отправляем фото батч-кода до отправки заказа, чек прилагается. Возврат
                нераспечатанного флакона — 7 дней.
              </p>
            </Section>
          </div>
        </div>
      </div>

      {/* липкая кнопка покупки на мобильных */}
      {product.inStock && (
        <div className="fixed inset-x-0 bottom-[calc(62px+env(safe-area-inset-bottom))] z-30 border-t hairline bg-noir/95 p-3 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-smoke">{product.brand} {product.name}</p>
              <p className="text-[17px] font-bold">{formatPrice(product.price)}</p>
            </div>
            <button onClick={buyNow} className="btn-gold ml-auto shrink-0 px-6 py-3 text-sm">
              Купить сейчас
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

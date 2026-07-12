'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { GENDER_LABEL, photoSrc, type Product } from '@/lib/products';
import { noteArtKey, noteArtSrc } from '@/lib/note-art';
import { formatPrice } from '@/lib/format';
import { useStore } from '@/lib/store';
import { DELIVERY_OPTIONS, SHOP } from '@/lib/config';
import { BagIcon, CheckIcon, HeartIcon, ShieldIcon, TelegramIcon } from './icons';

function Meter({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-smoke">{hint}</p>
      </div>
      <div className="mt-2 h-1 bg-ivory/10">
        <motion.div
          className="h-full bg-gold"
          style={{ originX: 0, width: `${Math.min(value, 1) * 100}%` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/** таблица состава: что слышно и когда */
function NotesTable({ notes }: { notes: Product['notes'] }) {
  const rows = [
    { label: 'Верхние ноты', hint: 'первые 15–30 минут', items: notes.top },
    { label: 'Ноты сердца', hint: 'следующие 2–4 часа', items: notes.heart },
    { label: 'Базовые ноты', hint: 'остаются до конца дня', items: notes.base },
  ];
  return (
    <div className="divide-y divide-ivory/10 border-y border-ivory/10">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[130px_1fr] gap-4 py-4 sm:grid-cols-[180px_1fr]">
          <div>
            <p className="font-display text-[15px] leading-tight">{r.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-smoke">{r.hint}</p>
          </div>
          <p className="self-center text-[15px] leading-relaxed text-ivory/90">
            {r.items.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  );
}

/* полка состава под флаконом: до 4 главных нот в одну строгую строку */
function CompositionShelf({ notes }: { notes: string[] }) {
  return (
    <div className="relative border-t border-ivory/10 bg-[#FBF9F3]/70 px-3 py-3.5">
      <div className="flex flex-wrap items-center justify-center gap-y-2">
        {notes.map((n, i) => {
          const art = noteArtKey(n);
          return (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
              className={`flex items-center gap-2 px-3 py-1 sm:px-4 ${
                i > 0 ? 'border-l-0 sm:border-l sm:border-ivory/10' : ''
              }`}
            >
              {art ? (
                <img
                  src={noteArtSrc(art)}
                  alt=""
                  width={72}
                  height={72}
                  loading="lazy"
                  className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                />
              ) : (
                <span className="h-1 w-1 rounded-full bg-gold" />
              )}
              <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.16em] text-smoke">
                {n}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** сцена: флакон с параллаксом и выносками состава */
function BottleStage({ product }: { product: Product }) {
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 15 });
  const my = useSpring(rawY, { stiffness: 60, damping: 15 });

  const rotateY = useTransform(mx, (v) => v * 8);
  const rotateX = useTransform(my, (v) => v * -5);

  /* до 4 главных нот для полки состава, без повторов */
  const shelfNotes = [
    ...new Set(
      [
        product.notes.top[0],
        product.notes.heart[0],
        product.notes.base[0],
        product.notes.top[1] ?? product.notes.heart[1] ?? product.notes.base[1],
      ].filter((n): n is string => Boolean(n)),
    ),
  ].slice(0, 4);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    /* наклон — только для мыши: на тач-свайпе флакон не должен перекашиваться */
    if (reduced || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div className="border hairline bg-graphite lg:sticky lg:top-24">
      {/* сцена-витрина */}
      <div
        onPointerMove={onPointerMove}
        onPointerLeave={onLeave}
        onPointerUp={onLeave}
        onPointerCancel={onLeave}
        className="relative h-[420px] touch-pan-y overflow-hidden sm:h-[500px]"
        style={{
          perspective: 900,
          background: 'linear-gradient(180deg, #FDFBF7 0%, #F4EEE3 100%)',
        }}
      >
        {/* паспарту — тонкая внутренняя рамка */}
        <div className="pointer-events-none absolute inset-3 z-20 border border-ivory/10" />

        {/* деликатная аура в цвет аромата */}
        <div className="pointer-events-none absolute left-1/2 top-[54%] h-[65%] w-[78%] -translate-x-1/2 -translate-y-1/2">
          <div
            className="h-full w-full rounded-full"
            style={{ background: `radial-gradient(ellipse, ${product.accent}1f, transparent 62%)` }}
          />
        </div>

        {!product.inStock ? (
          <span className="absolute left-6 top-6 z-30 border border-ivory/30 bg-graphite px-2.5 py-1 text-[10px] uppercase tracking-widest2 text-smoke">
            Нет в наличии
          </span>
        ) : (
          product.tags.length > 0 && (
            <span className="absolute left-6 top-6 z-30 border border-gold/60 bg-graphite px-2.5 py-1 text-[10px] uppercase tracking-widest2 text-gold">
              {product.tags[0]}
            </span>
          )
        )}
        <span className="absolute right-6 top-6 z-30 text-[10px] uppercase tracking-widest2 text-smoke">
          {product.volume} мл · {product.concentration}
        </span>

        {/* флакон */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <motion.div
            animate={reduced ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="relative h-[74%] w-auto"
          >
            <img
              src={photoSrc(product)}
              alt={`${product.brand} ${product.name} — оригинальный флакон`}
              width={750}
              height={1000}
              className={`h-full w-auto drop-shadow-[0_30px_38px_rgba(23,19,16,0.24)] ${
                product.inStock ? '' : 'opacity-60 grayscale'
              }`}
            />
          </motion.div>
        </motion.div>

        {/* естественная тень под флаконом */}
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-4 w-52 -translate-x-1/2 rounded-full bg-[#171310]/15 blur-xl" />
      </div>

      {/* полка состава */}
      <CompositionShelf notes={shelfNotes} />
    </div>
  );
}

export default function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const { add, toggleFav, isFav } = useStore();
  const [added, setAdded] = useState(false);
  const fav = isFav(product.slug);

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
    <div className="container-m27 py-8 pb-28 sm:py-12 md:pb-12">
      {/* хлебные крошки */}
      <nav className="flex items-center whitespace-nowrap text-xs text-smoke">
        <Link href="/" className="transition-colors hover:text-ivory">Главная</Link>
        <span className="mx-2 text-smoke/50">/</span>
        <Link href="/catalog/" className="transition-colors hover:text-ivory">Каталог</Link>
        <span className="mx-2 text-smoke/50">/</span>
        <span className="min-w-0 truncate text-ivory/80">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <BottleStage product={product} />

        {/* информация и покупка */}
        <div>
          <p className="text-[13px] uppercase tracking-[0.14em] text-smoke">{product.brand}</p>
          <h1 className="mt-1.5 font-display text-3xl leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-smoke">
            {product.concentration}, {product.volume} мл · {GENDER_LABEL[product.gender]}
          </p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-smoke line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ivory/85">{product.desc}</p>

          {/* кнопки покупки */}
          {product.inStock ? (
            <div className="mt-7 grid grid-cols-[1fr_auto] gap-3 sm:max-w-md sm:grid-cols-[1fr_1fr_auto]">
              <button onClick={buyNow} className="btn-gold col-span-2 sm:col-span-1">
                Купить сейчас
              </button>
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
                className={`flex items-center justify-center border px-4 py-4 transition-colors ${
                  fav ? 'border-gold text-gold' : 'border-ivory/25 text-smoke hover:border-gold hover:text-gold'
                }`}
              >
                <HeartIcon className="h-5 w-5" filled={fav} />
              </button>
            </div>
          ) : (
            <div className="mt-7 sm:max-w-md">
              <p className="border border-ivory/15 bg-coal px-4 py-3 text-sm text-smoke">
                Сейчас нет в наличии. Напишите нам — сообщим, как только появится, и отложим для вас флакон.
              </p>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
                <a href={notifyHref} target="_blank" rel="noopener noreferrer" className="btn-gold">
                  <TelegramIcon className="h-4 w-4" /> Сообщить о поступлении
                </a>
                <button
                  onClick={() => toggleFav(product.slug)}
                  aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
                  className={`flex items-center justify-center border px-4 py-4 transition-colors ${
                    fav ? 'border-gold text-gold' : 'border-ivory/25 text-smoke hover:border-gold hover:text-gold'
                  }`}
                >
                  <HeartIcon className="h-5 w-5" filled={fav} />
                </button>
              </div>
            </div>
          )}

          <p className="mt-3 flex items-center gap-2 text-[13px] text-smoke">
            <ShieldIcon className="h-4 w-4 text-gold" />
            Оригинал · чек · фото батч-кода до отправки
          </p>

          {/* стойкость и шлейф */}
          <div className="mt-8 grid gap-5 border-t hairline pt-7 sm:max-w-md">
            <Meter
              label="Стойкость"
              value={product.longevityHours / 14}
              hint={`около ${product.longevityHours} часов`}
            />
            <Meter
              label="Шлейф"
              value={product.sillage / 5}
              hint={['едва заметный', 'лёгкий', 'умеренный', 'заметный', 'мощный'][product.sillage - 1]}
            />
          </div>

          {/* состав аромата */}
          <div className="mt-8 border-t hairline pt-7">
            <p className="kicker">Как раскрывается аромат</p>
            <div className="mt-4">
              <NotesTable notes={product.notes} />
            </div>
          </div>

          {/* доставка и оплата */}
          <div className="mt-8 border-t hairline pt-7">
            <p className="kicker">Доставка и оплата</p>
            <ul className="mt-4 space-y-2 text-sm text-smoke">
              {DELIVERY_OPTIONS.map((d) => (
                <li key={d.id} className="flex justify-between gap-4">
                  <span>{d.label}</span>
                  <span className="shrink-0 text-ivory/80">
                    {d.price === 0 ? '—' : `${d.price} ₽`} · {d.days}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-smoke">
              Бесплатная доставка от {SHOP.freeShippingFrom.toLocaleString('ru-RU')} ₽.
              Оплата при получении или по СБП.
            </p>
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

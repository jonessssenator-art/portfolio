'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HITS, photoSrc, type Product } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { useStore } from '@/lib/store';
import { ArrowRightIcon } from './icons';

/** пул ароматов со сценами: каждый день сайт сам выбирает пятёрку по дате */
const SCENE_POOL = [
  'lattafa-khamrah',
  'dior-sauvage-elixir',
  'pdm-delina',
  'mfk-baccarat-rouge-540',
  'creed-aventus',
  'tom-ford-lost-cherry',
  'nishane-hacivat',
  'ysl-black-opium',
  'armaf-club-de-nuit-intense',
  'kilian-love-dont-be-shy',
];
const SHOWCASE_SIZE = 5;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
/** вертикальная сцена (телефон) */
const scenePortrait = (slug: string) => `${BASE}/hero/${slug}.jpg`;
/** широкая дорисованная сцена (компьютер) */
const sceneWide = (slug: string) => `${BASE}/hero/${slug}-wide.jpg`;

function resolveFeatured(slugs: string[]): Product[] {
  return slugs
    .map((s) => HITS.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p && p.inStock));
}

const SWITCH_MS = 8000;

export default function Hero() {
  const router = useRouter();
  const { add } = useStore();
  const reduced = useReducedMotion();

  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  /* стартовая пятёрка стабильна для пререндера; после загрузки — сдвиг по дню */
  const [featured, setFeatured] = useState<Product[]>(() =>
    resolveFeatured(SCENE_POOL.slice(0, SHOWCASE_SIZE)),
  );
  const product = featured[Math.min(idx, featured.length - 1)];

  useEffect(() => {
    const day = Math.floor(Date.now() / 86_400_000);
    const start = day % SCENE_POOL.length;
    const slugs = Array.from(
      { length: SHOWCASE_SIZE },
      (_, i) => SCENE_POOL[(start + i) % SCENE_POOL.length],
    );
    const daily = resolveFeatured(slugs);
    if (daily.length >= 3) {
      setFeatured(daily);
      setIdx(0);
    }
  }, []);

  useEffect(() => {
    if (!auto || reduced || featured.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % featured.length), SWITCH_MS);
    return () => clearInterval(t);
  }, [auto, reduced, featured.length]);

  /* лёгкий параллакс сцены при скролле */
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 80]);

  const buyNow = () => {
    add(product.slug);
    router.push('/cart/');
  };

  /* страховка: без товаров со сценами секцию не рендерим вовсе */
  if (!product) return null;

  return (
    <section className="relative h-[88svh] max-h-[960px] min-h-[560px] overflow-hidden bg-[#171310]">
      <h1 className="sr-only">
        27 Souls — оригинальная нишевая парфюмерия. Ароматы, которые запоминают.
      </h1>

      {/* сцена-постер: вертикальная на телефоне, широкая — на компьютере */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={product.slug}
          initial={{ opacity: 0, scale: reduced ? 1 : 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: imgY }}
          className="absolute inset-0"
        >
          {/* picture: браузер грузит только одну версию сцены */}
          <picture>
            <source media="(min-width: 1024px)" srcSet={sceneWide(product.slug)} />
            <img
              src={scenePortrait(product.slug)}
              alt={`${product.brand} ${product.name} — атмосфера аромата`}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        </motion.div>
      </AnimatePresence>

      {/* затемнения для читаемости текста */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

      {/* верхняя строка */}
      <p className="absolute inset-x-0 top-6 z-10 text-center text-[11px] uppercase tracking-widest2 text-[#F6F1E8]/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
        Оригинальная нишевая парфюмерия · проверка батч-кода
      </p>

      {/* гигантское имя аромата */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`title-${product.slug}`}
          aria-hidden
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-x-3 top-[10%] z-10 select-none text-center font-display uppercase leading-[0.98] text-[#F6F1E8]/30"
          style={{ fontSize: 'clamp(34px, 7.5vw, 104px)' }}
        >
          {product.name.split(' ').map((word, wi) => (
            <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
              {wi > 0 && <span className="inline-block w-[0.25em]" />}
              {word.split('').map((ch, ci) => (
                <span key={`${ch}-${ci}`} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3 + (wi * 6 + ci) * 0.02, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </motion.p>
      </AnimatePresence>

      {/* нижняя плита: товар и покупка (кнопки статичны, анимируется только текст) */}
      <div
        onPointerDown={() => setAuto(false)}
        className="absolute inset-x-0 bottom-0 z-10 pb-7 sm:pb-9"
      >
        <div className="container-m27 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`plate-${product.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#F6F1E8]/70">{product.brand}</p>
              <p className="mt-1 font-display text-2xl text-[#F6F1E8] sm:text-3xl">{product.name}</p>
              <p className="mt-1 text-lg font-semibold text-[#D9B36A]">{formatPrice(product.price)}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-3">
            <button
              onClick={buyNow}
              className="inline-flex items-center justify-center gap-2 bg-[#F6F1E8] px-4 py-3.5 text-sm font-semibold tracking-wide text-[#171310] transition-all duration-300 hover:bg-[#D9B36A] active:scale-[0.98]"
            >
              Купить сейчас
            </button>
            <Link
              href={`/product/${product.slug}/`}
              className="inline-flex items-center justify-center gap-2 border border-[#F6F1E8]/45 px-4 py-3.5 text-sm tracking-wide text-[#F6F1E8] transition-all duration-300 hover:border-[#D9B36A] hover:text-[#D9B36A] active:scale-[0.98]"
            >
              Об аромате <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* переключатель сцен (пятёрка дня) + пауза */}
          <div className="mt-5 flex items-center gap-3">
            {featured.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => {
                  setIdx(i);
                  setAuto(false);
                }}
                aria-label={`${p.brand} ${p.name}`}
                aria-current={i === idx}
                className={`flex h-14 w-11 items-center justify-center border backdrop-blur-sm transition-all duration-300 ${
                  i === idx
                    ? 'border-[#D9B36A] bg-black/30'
                    : 'border-[#F6F1E8]/25 bg-black/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={photoSrc(p)} alt="" width={38} height={50} className="h-10 w-auto object-contain" />
              </button>
            ))}
            <button
              onClick={() => setAuto((a) => !a)}
              aria-label={auto ? 'Остановить смену ароматов' : 'Запустить смену ароматов'}
              aria-pressed={!auto}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#F6F1E8]/30 bg-black/20 text-[#F6F1E8]/80 backdrop-blur-sm transition-colors hover:border-[#D9B36A]"
            >
              {auto ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <rect x="7" y="5" width="3.5" height="14" />
                  <rect x="13.5" y="5" width="3.5" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

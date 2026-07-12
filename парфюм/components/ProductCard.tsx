'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { photoSrc, type Product } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { useStore } from '@/lib/store';
import { BagIcon, CheckIcon, HeartIcon } from './icons';

export default function ProductCard({ product }: { product: Product }) {
  const { add, toggleFav, isFav } = useStore();
  const [added, setAdded] = useState(false);
  const fav = isFav(product.slug);
  const available = product.inStock;

  /* деликатный 3D-наклон за курсором (только мышь) */
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 7);
    rx.set(py * -7);
  };

  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  const quickAdd = () => {
    if (!available) return;
    add(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group relative" style={{ perspective: 800 }}>
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="border hairline bg-graphite shadow-card transition-shadow duration-500 group-hover:shadow-[0_30px_55px_-18px_rgba(23,19,16,0.3)]"
      >
        {/* растянутая ссылка на весь блок; кнопки — поверх неё */}
        <Link
          href={`/product/${product.slug}/`}
          className="absolute inset-0 z-10"
          aria-label={`${product.brand} ${product.name}`}
        />

        <div className="relative aspect-[3/4] overflow-hidden bg-stage">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background: `radial-gradient(ellipse 70% 55% at 50% 62%, ${product.accent}1f, transparent 70%)`,
            }}
          />
          <img
            src={photoSrc(product)}
            alt={`${product.brand} ${product.name}`}
            width={750}
            height={1000}
            loading="lazy"
            decoding="async"
            className={`pointer-events-none absolute inset-0 h-full w-full object-contain p-6 drop-shadow-[0_14px_22px_rgba(23,19,16,0.18)] transition-transform duration-500 ease-out group-hover:scale-[1.05] ${
              available ? '' : 'opacity-55 grayscale'
            }`}
            style={{ transform: 'translateZ(28px)' }}
          />
          {!available ? (
            <span className="absolute left-3 top-3 border border-ivory/25 bg-graphite/80 px-2 py-1 text-[10px] uppercase tracking-widest2 text-smoke">
              Нет в наличии
            </span>
          ) : (
            product.tags.length > 0 && (
              <span className="absolute left-3 top-3 border border-gold/60 bg-graphite/80 px-2 py-1 text-[10px] uppercase tracking-widest2 text-gold">
                {product.tags[0]}
              </span>
            )
          )}
          <button
            onClick={() => toggleFav(product.slug)}
            aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
            className={`absolute right-1.5 top-1.5 z-20 p-3 transition-colors ${
              fav ? 'text-gold' : 'text-smoke hover:text-ivory'
            }`}
          >
            <HeartIcon className="h-5 w-5" filled={fav} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-smoke">{product.brand}</p>
          <p className="mt-1 line-clamp-2 min-h-[2.6em] font-display text-lg leading-snug">
            {product.name}
          </p>
          <p className="mt-0.5 text-xs text-smoke">
            {product.concentration}, {product.volume} мл
          </p>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              {product.oldPrice && (
                <span className="block text-xs text-smoke line-through">{formatPrice(product.oldPrice)}</span>
              )}
              <span className={`text-[17px] font-semibold ${available ? 'text-ivory' : 'text-smoke'}`}>
                {formatPrice(product.price)}
              </span>
            </div>
            <button
              onClick={quickAdd}
              disabled={!available}
              aria-label={available ? 'Добавить в корзину' : 'Нет в наличии'}
              className={`relative z-20 flex h-10 w-10 shrink-0 items-center justify-center border transition-all ${
                !available
                  ? 'cursor-not-allowed border-ivory/10 text-smoke/40'
                  : added
                    ? 'border-gold bg-gold text-graphite'
                    : 'border-gold/50 text-gold hover:bg-gold hover:text-graphite'
              }`}
            >
              {added ? <CheckIcon className="h-5 w-5" /> : <BagIcon className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

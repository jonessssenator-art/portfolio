'use client';

import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { useStore } from '@/lib/store';
import ProductCard from './ProductCard';
import { HeartIcon } from './icons';

export default function FavoritesView() {
  const { hydrated, favs } = useStore();
  const items = PRODUCTS.filter((p) => favs.includes(p.slug));

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="container-m27 flex flex-col items-center py-20 text-center">
        <HeartIcon className="h-12 w-12 text-smoke/50" />
        <h1 className="mt-5 font-display text-3xl">В избранном пусто</h1>
        <p className="mt-2 max-w-sm text-smoke">
          Нажимайте на сердечко у аромата, чтобы вернуться к нему позже
        </p>
        <Link href="/catalog/" className="btn-gold mt-7">
          Смотреть каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container-m27 py-8 sm:py-12">
      <p className="kicker">Сохранённое</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">Избранное</h1>
      <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}

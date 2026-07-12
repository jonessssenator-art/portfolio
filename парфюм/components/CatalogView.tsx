'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BRANDS, PRODUCTS, type Gender } from '@/lib/products';
import ProductCard from './ProductCard';
import { SearchIcon } from './icons';

type Sort = 'pop' | 'price-asc' | 'price-desc';
type Segment = 'all' | 'lo' | 'mid' | 'hi';

const GENDER_TITLE: Record<Gender, string> = {
  м: 'Мужские ароматы',
  ж: 'Женские ароматы',
  у: 'Ароматы унисекс',
};

const GENDER_FILTERS: Array<{ value: Gender | 'all'; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'м', label: 'Мужские' },
  { value: 'ж', label: 'Женские' },
  { value: 'у', label: 'Унисекс' },
];

const SEGMENT_FILTERS: Array<{ value: Segment; label: string; test: (price: number) => boolean }> = [
  { value: 'all', label: 'Все цены', test: () => true },
  { value: 'lo', label: 'До 6 500 ₽', test: (p) => p <= 6500 },
  { value: 'mid', label: '6 500–20 000 ₽', test: (p) => p > 6500 && p <= 20000 },
  { value: 'hi', label: 'От 20 000 ₽', test: (p) => p > 20000 },
];

const PAGE = 24;

export default function CatalogView() {
  const params = useSearchParams();
  const initialGender = (params.get('g') as Gender | null) ?? 'all';
  const initialSeg = (params.get('seg') as Segment | null) ?? 'all';

  const [q, setQ] = useState('');
  const [gender, setGender] = useState<Gender | 'all'>(
    ['м', 'ж', 'у'].includes(initialGender) ? (initialGender as Gender) : 'all',
  );
  const [seg, setSeg] = useState<Segment>(
    ['lo', 'mid', 'hi'].includes(initialSeg) ? initialSeg : 'all',
  );
  const [brand, setBrand] = useState<string>('all');
  const [sort, setSort] = useState<Sort>('pop');
  const [shown, setShown] = useState(PAGE);

  /* клик по ссылке с ?g=/?seg=, когда каталог уже открыт, должен менять фильтр */
  useEffect(() => {
    const g = params.get('g') as Gender | null;
    const s = params.get('seg') as Segment | null;
    setGender(g && ['м', 'ж', 'у'].includes(g) ? g : 'all');
    setSeg(s && ['lo', 'mid', 'hi'].includes(s) ? s : 'all');
  }, [params]);

  useEffect(() => {
    setShown(PAGE);
  }, [q, gender, seg, brand, sort]);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    const segTest = SEGMENT_FILTERS.find((s) => s.value === seg)!.test;
    let list = PRODUCTS.filter(
      (p) =>
        (gender === 'all' || p.gender === gender) &&
        (brand === 'all' || p.brand === brand) &&
        segTest(p.price) &&
        (!query ||
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.accords.some((a) => a.includes(query))),
    );
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'pop')
      list = [...list].sort(
        (a, b) => Number(b.tags.includes('хит')) - Number(a.tags.includes('хит')),
      );
    /* отсутствующие — в конец */
    return [...list.filter((p) => p.inStock), ...list.filter((p) => !p.inStock)];
  }, [q, gender, seg, brand, sort]);

  const visible = items.slice(0, shown);

  return (
    <div className="container-m27 py-8 sm:py-12">
      <p className="kicker">Каталог · {PRODUCTS.length} ароматов</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">
        {gender === 'all' ? 'Все ароматы' : GENDER_TITLE[gender]}
      </h1>

      {/* поиск */}
      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-smoke" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Название, бренд или нота…"
          className="field pl-12"
          aria-label="Поиск по каталогу"
        />
      </div>

      {/* фильтры: один скролл-ряд чипов, селекты отдельной строкой */}
      <div className="scrollbar-hide -mx-4 mt-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {GENDER_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setGender(value)}
            aria-pressed={gender === value}
            className={`shrink-0 border px-4 py-2.5 text-[13px] tracking-wide transition-colors ${
              gender === value
                ? 'border-gold bg-gold/10 text-gold-dark'
                : 'border-ivory/15 text-smoke hover:border-gold/60 hover:text-ivory'
            }`}
          >
            {label}
          </button>
        ))}

        <span className="mx-1 hidden h-5 w-px bg-ivory/15 sm:block" />

        {SEGMENT_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSeg(value)}
            aria-pressed={seg === value}
            className={`shrink-0 border px-4 py-2.5 text-[13px] tracking-wide transition-colors ${
              seg === value
                ? 'border-gold bg-gold/10 text-gold-dark'
                : 'border-ivory/15 text-smoke hover:border-gold/60 hover:text-ivory'
            }`}
          >
            {label}
          </button>
        ))}

      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-md">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border border-ivory/15 bg-graphite px-3 py-2.5 text-[13px] text-ivory outline-none focus:border-gold/60"
          aria-label="Фильтр по бренду"
        >
          <option value="all">Все бренды</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="w-full border border-ivory/15 bg-graphite px-3 py-2.5 text-[13px] text-ivory outline-none focus:border-gold/60"
          aria-label="Сортировка"
        >
          <option value="pop">Сначала популярные</option>
          <option value="price-asc">Дешевле</option>
          <option value="price-desc">Дороже</option>
        </select>
      </div>

      <p className="mt-5 text-sm text-smoke">
        {items.length > 0 ? `Найдено: ${items.length}` : 'Ничего не нашлось — попробуйте изменить запрос'}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {items.length > shown && (
        <div className="mt-8 text-center">
          <button onClick={() => setShown((n) => n + PAGE)} className="btn-ghost px-10">
            Показать ещё ({items.length - shown})
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PRODUCTS } from './products';

export interface CartItem {
  slug: string;
  qty: number;
}

interface StoreState {
  hydrated: boolean;
  cart: CartItem[];
  favs: string[];
  cartCount: number;
  cartTotal: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clearCart: () => void;
  toggleFav: (slug: string) => void;
  isFav: (slug: string) => boolean;
  inCart: (slug: string) => boolean;
}

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = 'm27-cart';
const FAVS_KEY = 'm27-favs';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    const validSlugs = new Set(PRODUCTS.map((p) => p.slug));
    const inStock = new Set(PRODUCTS.filter((p) => p.inStock).map((p) => p.slug));
    // из корзины вычищаем и удалённые, и снятые с продажи товары
    setCart(readJSON<CartItem[]>(CART_KEY, []).filter((i) => inStock.has(i.slug) && i.qty > 0));
    setFavs(readJSON<string[]>(FAVS_KEY, []).filter((s) => validSlugs.has(s)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
  }, [favs, hydrated]);

  const value = useMemo<StoreState>(() => {
    const priceOf = (slug: string) => PRODUCTS.find((p) => p.slug === slug)?.price ?? 0;
    return {
      hydrated,
      cart,
      favs,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      cartTotal: cart.reduce((s, i) => s + i.qty * priceOf(i.slug), 0),
      add: (slug, qty = 1) => {
        const product = PRODUCTS.find((p) => p.slug === slug);
        if (!product || !product.inStock) return;
        setCart((c) => {
          const existing = c.find((i) => i.slug === slug);
          if (existing) {
            return c.map((i) => (i.slug === slug ? { ...i, qty: Math.min(i.qty + qty, 9) } : i));
          }
          return [...c, { slug, qty: Math.min(qty, 9) }];
        });
      },
      setQty: (slug, qty) =>
        setCart((c) =>
          qty <= 0
            ? c.filter((i) => i.slug !== slug)
            : c.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, 9) } : i)),
        ),
      remove: (slug) => setCart((c) => c.filter((i) => i.slug !== slug)),
      clearCart: () => setCart([]),
      toggleFav: (slug) =>
        setFavs((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug])),
      isFav: (slug) => favs.includes(slug),
      inCart: (slug) => cart.some((i) => i.slug === slug),
    };
  }, [hydrated, cart, favs]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore должен использоваться внутри StoreProvider');
  return ctx;
}

import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { SHOP } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SHOP.url}/`, priority: 1 },
    { url: `${SHOP.url}/catalog/`, priority: 0.9 },
    ...PRODUCTS.map((p) => ({
      url: `${SHOP.url}/product/${p.slug}/`,
      priority: 0.8,
    })),
  ];
}

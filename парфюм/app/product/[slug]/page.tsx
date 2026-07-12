import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getSimilar, PRODUCTS } from '@/lib/products';
import { SHOP } from '@/lib/config';
import ProductView from '@/components/ProductView';
import Rail from '@/components/Rail';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = `${product.brand} ${product.name} — купить оригинал`;
  const description = `${product.brand} ${product.name}, ${product.concentration} ${product.volume} мл за ${product.price.toLocaleString('ru-RU')} ₽. Оригинал с проверкой батч-кода. ${product.desc}`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.name}`,
    description: product.desc,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'RUB',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SHOP.url}/product/${product.slug}/`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} />
      <Rail kicker="Вам может понравиться" title="Похожие ароматы" products={getSimilar(product)} href="/catalog/" />
    </>
  );
}

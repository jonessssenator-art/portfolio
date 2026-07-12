import Link from 'next/link';
import type { Product } from '@/lib/products';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { ArrowRightIcon } from './icons';

interface RailProps {
  kicker: string;
  title: string;
  products: Product[];
  href?: string;
  id?: string;
}

export default function Rail({ kicker, title, products, href, id }: RailProps) {
  return (
    <section id={id} className="py-12 sm:py-16">
      <Reveal className="container-m27 mb-6 flex items-end justify-between">
        <div>
          <p className="kicker">{kicker}</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="hidden items-center gap-1.5 text-sm text-gold-dark transition-colors hover:text-gold sm:flex"
          >
            Смотреть все <ArrowRightIcon className="h-4 w-4" />
          </Link>
        )}
      </Reveal>
      {/* карточки без индивидуальных анимаций — при горизонтальном листании ничего не «догоняет» */}
      <Reveal y={20}>
        <div className="scrollbar-hide flex snap-x snap-proximity gap-4 overflow-x-auto px-4 sm:px-6 lg:mx-auto lg:max-w-6xl">
          {products.map((p) => (
            <div key={p.slug} className="w-[230px] shrink-0 snap-start sm:w-[260px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Reveal>
      {href && (
        <div className="container-m27 mt-6 sm:hidden">
          <Link href={href} className="btn-ghost w-full">
            Смотреть все <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}

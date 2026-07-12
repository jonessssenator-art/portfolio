import type { Metadata } from 'next';
import { Suspense } from 'react';
import CatalogView from '@/components/CatalogView';

export const metadata: Metadata = {
  title: 'Каталог оригинальной парфюмерии',
  description:
    'Оригинальные духи Tom Ford, Creed, Maison Francis Kurkdjian, Le Labo, Byredo, Xerjoff. Мужские, женские и унисекс ароматы с доставкой по России.',
};

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogView />
    </Suspense>
  );
}

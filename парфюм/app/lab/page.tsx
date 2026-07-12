import type { Metadata } from 'next';
import LabView from '@/components/LabView';

export const metadata: Metadata = {
  title: 'Лаборатория: 10 вариантов блока товара',
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return <LabView />;
}

import type { Metadata } from 'next';
import CartView from '@/components/CartView';

export const metadata: Metadata = {
  title: 'Корзина',
  description: 'Оформление заказа за 20 секунд: без регистрации, оплата при получении или по СБП.',
  robots: { index: false },
};

export default function CartPage() {
  return <CartView />;
}

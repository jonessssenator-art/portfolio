/**
 * ЕДИНОЕ МЕСТО НАСТРОЙКИ МАГАЗИНА.
 * Замени telegram на свой ник (без @) — туда будут приходить заказы.
 */
export const SHOP = {
  /** «27 Souls»: духи = души, 27 душ → 27 souls */
  name: '27 Souls',
  monogram: '27',
  tagline: 'Оригинальная нишевая парфюмерия',
  /** ник Telegram, куда приходят заказы (без @) */
  telegram: 'xxviiexe',
  city: 'Россия',
  /** порог бесплатной доставки, ₽ */
  freeShippingFrom: 20000,
  promoCodes: { SOULS10: 0.1 } as Record<string, number>,
  url: 'https://jonessssenator-art.github.io/portfolio/maison27',
};

export const DELIVERY_OPTIONS = [
  { id: 'cdek', label: 'СДЭК — пункт выдачи', price: 390, days: '2–5 дней', external: false },
  { id: 'boxberry', label: 'Boxberry — пункт выдачи', price: 390, days: '3–6 дней', external: false },
  { id: 'post', label: 'Почта России', price: 350, days: '4–10 дней', external: false },
  /** external: тариф считает сам сервис — не показываем «бесплатно» */
  { id: 'avito', label: 'Авито Доставка', price: 0, days: 'по тарифам Авито', external: true },
] as const;

export const PAYMENT_OPTIONS = [
  { id: 'receive', label: 'При получении', hint: 'наложенный платёж в пункте выдачи', disabled: false },
  { id: 'transfer', label: 'Перевод по СБП', hint: 'реквизиты пришлём в Telegram', disabled: false },
  { id: 'online', label: 'Онлайн-оплата картой', hint: 'скоро — Apple Pay, СБП, карты', disabled: true },
] as const;

'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getProduct, photoSrc } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { useStore } from '@/lib/store';
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS, SHOP } from '@/lib/config';
import { BagIcon, CheckIcon, MinusIcon, PlusIcon, TelegramIcon, XIcon } from './icons';

export default function CartView() {
  const { hydrated, cart, cartTotal, setQty, remove, clearCart } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [delivery, setDelivery] = useState<string>(DELIVERY_OPTIONS[0].id);
  const [payment, setPayment] = useState<string>(PAYMENT_OPTIONS[0].id);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const [orderText, setOrderText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const discount = promo ? Math.round(cartTotal * (SHOP.promoCodes[promo] ?? 0)) : 0;
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
  /* external-доставку (Авито) считает сам сервис — это не «бесплатно» */
  const deliveryPrice = deliveryOption.external
    ? 0
    : cartTotal - discount >= SHOP.freeShippingFrom
      ? 0
      : deliveryOption.price;
  const deliveryLabel = deliveryOption.external
    ? 'по тарифам Авито'
    : deliveryPrice === 0
      ? 'бесплатно'
      : formatPrice(deliveryPrice);
  const total = cartTotal - discount + deliveryPrice;

  const items = useMemo(
    () =>
      cart
        .map((i) => ({ ...i, product: getProduct(i.slug)! }))
        .filter((i) => i.product),
    [cart],
  );

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (SHOP.promoCodes[code]) {
      setPromo(code);
      setPromoError(false);
    } else {
      setPromo(null);
      setPromoError(true);
    }
  };

  const telegramHref = (text: string) =>
    `https://t.me/${SHOP.telegram}?text=${encodeURIComponent(text)}`;

  const placeOrder = () => {
    if (items.length === 0) return;
    const errs: string[] = [];
    if (name.trim().length < 2) errs.push('Укажите имя');
    if (phone.replace(/\D/g, '').length < 10) errs.push('Укажите телефон полностью');
    if (city.trim().length < 2) errs.push('Укажите город');
    setErrors(errs);
    if (errs.length) return;

    const orderId = `M27-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    const lines = [
      `Заказ ${SHOP.name} № ${orderId}`,
      '',
      ...items.map(
        (i, n) =>
          `${n + 1}. ${i.product.brand} ${i.product.name}, ${i.product.volume} мл — ${formatPrice(i.product.price)} × ${i.qty}`,
      ),
      '',
      `Товары: ${formatPrice(cartTotal)}`,
      ...(discount ? [`Промокод ${promo}: −${formatPrice(discount)}`] : []),
      `Доставка: ${deliveryOption.label} (${deliveryLabel})`,
      `ИТОГО: ${formatPrice(total)}`,
      '',
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
      `Город: ${city.trim()}`,
      `Оплата: ${PAYMENT_OPTIONS.find((p) => p.id === payment)?.label}`,
      ...(comment.trim() ? [`Комментарий: ${comment.trim()}`] : []),
    ];
    const text = lines.join('\n');
    setOrderText(text);
    /* корзину чистим только после реального ухода в Telegram — заказ не потеряется */
    window.open(telegramHref(text), '_blank', 'noopener');
  };

  const copyOrder = async () => {
    if (!orderText) return;
    try {
      await navigator.clipboard.writeText(orderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* буфер обмена недоступен — текст заказа виден на экране */
    }
  };

  /* экран успеха */
  if (orderText) {
    return (
      <div className="container-m27 flex flex-col items-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl">Заказ сформирован</h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-smoke">
          Сейчас откроется Telegram с текстом заказа — просто нажмите «Отправить».
          Если Telegram не открылся, воспользуйтесь кнопками ниже.
        </p>
        <div className="mt-7 grid w-full max-w-sm gap-3">
          <a
            href={telegramHref(orderText)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => clearCart()}
            className="btn-gold"
          >
            <TelegramIcon className="h-4 w-4" /> Отправить заказ в Telegram
          </a>
          <button onClick={copyOrder} className="btn-ghost">
            {copied ? 'Скопировано ✓' : 'Скопировать текст заказа'}
          </button>
          <Link href="/catalog/" className="text-sm text-smoke transition-colors hover:text-ivory">
            Вернуться в каталог
          </Link>
        </div>
        <pre className="mt-8 w-full max-w-md overflow-x-auto whitespace-pre-wrap border hairline bg-coal p-5 text-left text-[13px] leading-relaxed text-smoke">
          {orderText}
        </pre>
      </div>
    );
  }

  /* до чтения корзины с устройства ничего не показываем — чтобы не мелькала пустая форма */
  if (!hydrated) return null;

  /* пустая корзина */
  if (items.length === 0) {
    return (
      <div className="container-m27 flex flex-col items-center py-20 text-center">
        <BagIcon className="h-12 w-12 text-smoke/50" />
        <h1 className="mt-5 font-display text-3xl">Корзина пуста</h1>
        <p className="mt-2 text-smoke">Загляните в хиты продаж — там самое любимое</p>
        <Link href="/catalog/" className="btn-gold mt-7">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container-m27 py-8 sm:py-12">
      <p className="kicker">Корзина</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">Оформление заказа</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* товары */}
        <div className="space-y-4">
          {items.map(({ product, qty }) => (
            <div key={product.slug} className="flex gap-4 border hairline bg-graphite p-4">
              <Link href={`/product/${product.slug}/`} className="block h-28 w-20 shrink-0 bg-coal">
                <img
                  src={photoSrc(product)}
                  alt={`${product.brand} ${product.name}`}
                  width={375}
                  height={500}
                  className="h-full w-full object-contain p-1.5"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-smoke">{product.brand}</p>
                    <Link
                      href={`/product/${product.slug}/`}
                      className="mt-0.5 block truncate font-display text-lg transition-colors hover:text-gold-light"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-smoke">{product.volume} мл</p>
                  </div>
                  <button
                    onClick={() => remove(product.slug)}
                    aria-label="Удалить"
                    className="p-2.5 text-smoke transition-colors hover:text-ivory"
                  >
                    <XIcon className="h-[18px] w-[18px]" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border border-gold/25">
                    <button
                      onClick={() => setQty(product.slug, qty - 1)}
                      aria-label="Меньше"
                      className="p-3 text-smoke transition-colors hover:text-gold"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty(product.slug, qty + 1)}
                      aria-label="Больше"
                      className="p-3 text-smoke transition-colors hover:text-gold"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="font-semibold">{formatPrice(product.price * qty)}</p>
                </div>
              </div>
            </div>
          ))}

          {/* промокод */}
          <div className="border hairline bg-graphite p-4">
            <p className="text-sm font-semibold">Промокод</p>
            <div className="mt-3 flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError(false);
                }}
                placeholder="Например, SOULS10"
                className="field py-2.5"
                aria-label="Промокод"
              />
              <button onClick={applyPromo} className="btn-ghost shrink-0 px-5 py-2.5 text-sm">
                Применить
              </button>
            </div>
            {promo && (
              <p className="mt-2 text-sm text-gold">
                Промокод {promo} применён: −{formatPrice(discount)}
              </p>
            )}
            {promoError && <p className="mt-2 text-sm text-red-600">Такого промокода нет</p>}
          </div>
        </div>

        {/* форма и итог */}
        <div className="space-y-5">
          <div className="space-y-3 border hairline bg-graphite p-5">
            <p className="font-display text-xl">Получатель</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="field" aria-label="Имя" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон: +7 900 000-00-00"
              inputMode="tel"
              className="field"
              aria-label="Телефон"
            />
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Город" className="field" aria-label="Город" />

            <p className="pt-2 font-display text-xl">Доставка</p>
            <div className="space-y-2">
              {DELIVERY_OPTIONS.map((d) => (
                <label
                  key={d.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 text-sm transition-colors ${
                    delivery === d.id ? 'border-gold bg-gold/5' : 'border-gold/20 hover:border-gold/50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === d.id}
                      onChange={() => setDelivery(d.id)}
                      className="accent-[#A07C33]"
                    />
                    {d.label}
                  </span>
                  <span className="shrink-0 text-xs text-smoke">{d.days}</span>
                </label>
              ))}
            </div>

            <p className="pt-2 font-display text-xl">Оплата</p>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                    p.disabled
                      ? 'cursor-not-allowed border-gold/10 text-smoke/50'
                      : payment === p.id
                        ? 'cursor-pointer border-gold bg-gold/5'
                        : 'cursor-pointer border-gold/20 hover:border-gold/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    disabled={p.disabled}
                    checked={payment === p.id}
                    onChange={() => setPayment(p.id)}
                    className="accent-[#A07C33]"
                  />
                  <span>
                    {p.label}
                    <span className="block text-xs text-smoke">{p.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий к заказу (необязательно)"
              rows={2}
              className="field resize-none"
              aria-label="Комментарий"
            />
          </div>

          <div className="border hairline bg-coal p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-smoke">
                <span>Товары</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Скидка</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-smoke">
                <span>Доставка</span>
                <span>{deliveryLabel}</span>
              </div>
              <div className="flex justify-between border-t hairline pt-3 text-lg font-bold text-ivory">
                <span>Итого</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {errors.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-red-600">
                {errors.map((e) => (
                  <li key={e}>• {e}</li>
                ))}
              </ul>
            )}

            <button onClick={placeOrder} className="btn-gold mt-5 w-full">
              <TelegramIcon className="h-4 w-4" /> Оформить заказ
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-smoke">
              Заказ откроется в Telegram готовым сообщением — останется нажать «Отправить».
              Мы подтвердим наличие и согласуем доставку.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

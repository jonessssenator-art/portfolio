import Link from 'next/link';
import Hero from '@/components/Hero';
import Rail from '@/components/Rail';
import Reveal from '@/components/Reveal';
import { ArrowRightIcon, ShieldIcon, TelegramIcon, TruckIcon } from '@/components/icons';
import { BUDGET, HITS, NEW, PRODUCTS, photoSrc, type Gender } from '@/lib/products';
import { SHOP } from '@/lib/config';

const USP = [
  { icon: ShieldIcon, title: 'Только оригинал', text: 'Чек и проверка батч-кода в каждом заказе' },
  { icon: TruckIcon, title: 'Доставка 2–5 дней', text: `СДЭК и Boxberry, бесплатно от ${SHOP.freeShippingFrom.toLocaleString('ru-RU')} ₽` },
];

const CATEGORIES: Array<{ g: Gender; title: string; text: string }> = [
  { g: 'м', title: 'Мужские', text: 'Aventus, Layton, Sauvage Elixir' },
  { g: 'ж', title: 'Женские', text: 'Coco Mademoiselle, Libre' },
  { g: 'у', title: 'Унисекс', text: 'Baccarat Rouge, Santal 33' },
];

const FAQ = [
  {
    q: 'Это точно оригиналы?',
    a: 'Да. Мы работаем только с проверенными дистрибьюторами. Каждый флакон можно проверить по батч-коду (код партии на дне флакона и коробке) — покажем, как это сделать, прямо при получении. К заказу прилагается чек.',
  },
  {
    q: 'Как быстро придёт заказ?',
    a: 'СДЭК и Boxberry — 2–5 дней в крупные города, Почта России — 4–10 дней. Отправляем в день заказа или на следующий день.',
  },
  {
    q: 'Как оплатить?',
    a: 'При получении в пункте выдачи (наложенный платёж) или переводом по СБП после подтверждения заказа. Онлайн-оплата картой скоро появится.',
  },
  {
    q: 'Можно ли вернуть?',
    a: 'Нераспечатанный флакон в заводской плёнке — в течение 7 дней. Вскрытая парфюмерия по закону возврату не подлежит, поэтому перед покупкой поможем с выбором в Telegram.',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* преимущества */}
      <section className="border-b hairline bg-coal">
        <div className="container-m27 grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
          {USP.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <Icon className="h-8 w-8 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-[13px] text-smoke">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* в витринах главной — только то, что есть в наличии */}
      <Rail id="hits" kicker="Выбор покупателей" title="Хиты продаж" products={HITS.filter((p) => p.inStock).slice(0, 12)} href="/catalog/" />

      {/* категории */}
      <section className="container-m27 grid gap-4 sm:grid-cols-3">
        {CATEGORIES.map(({ g, title, text }, i) => {
          const sample = PRODUCTS.find((p) => p.gender === g)!;
          const count = PRODUCTS.filter((p) => p.gender === g).length;
          return (
            <Reveal key={g} delay={i * 0.12}>
            <Link
              href={`/catalog/?g=${g}`}
              className="card-shine group relative flex items-center justify-between overflow-hidden border hairline bg-graphite p-6 transition-colors hover:border-gold/40"
            >
              <div>
                <p className="font-display text-xl">{title}</p>
                <p className="mt-1 text-xs text-smoke">{text}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold">
                  {count} ароматов <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
              <img
                src={photoSrc(sample)}
                alt={`${sample.brand} ${sample.name}`}
                width={375}
                height={500}
                loading="lazy"
                decoding="async"
                className="h-28 w-20 object-contain drop-shadow-[0_10px_16px_rgba(23,19,16,0.22)] transition-transform duration-500 group-hover:scale-110"
              />
            </Link>
            </Reveal>
          );
        })}
      </section>

      <Rail
        kicker="Lattafa, Afnan, Armaf — оригиналы"
        title="Арабские хиты до 6 500 ₽"
        products={BUDGET.filter((p) => p.inStock).slice(0, 10)}
        href="/catalog/?seg=lo"
      />

      <Rail
        kicker="Свежие поступления"
        title="Новинки"
        products={NEW.filter((p) => p.inStock).slice(0, 12)}
        href="/catalog/"
      />

      {/* как заказать */}
      <section className="border-y hairline bg-coal">
        <div className="container-m27 py-14">
          <Reveal>
            <p className="kicker">Просто и быстро</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">Заказ занимает 20 секунд</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              ['01', 'Выберите аромат', 'Каталог с нотами, стойкостью и честными описаниями — без «воды».'],
              ['02', 'Оформите заказ', 'Имя, телефон, город — и заказ улетает нам в Telegram. Без регистрации.'],
              ['03', 'Получите и проверьте', 'В пункте выдачи проверяете флакон и батч-код, потом оплачиваете.'],
            ].map(([n, title, text], i) => (
              <Reveal key={n} delay={i * 0.12}>
                <div className="h-full border hairline bg-graphite p-6">
                  <p className="font-display text-3xl text-gold">{n}</p>
                  <p className="mt-3 font-semibold">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* гарантия подлинности */}
      <section id="trust" className="container-m27 py-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <Reveal>
          <div>
            <p className="kicker">Гарантия подлинности</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">
              Подделку видно по батч-коду. Мы сами покажем, где смотреть
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-smoke">
              Батч-код — это код партии, который производитель наносит на дно флакона и коробку.
              Он проверяется в открытых базах. У подделок кода нет или он не совпадает.
              Мы отправляем фото батч-кода до отправки заказа — вы проверяете его ещё до оплаты.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-ivory/90">
              {['Чек в каждом заказе', 'Фото батч-кода до отправки', 'Возврат нераспечатанного флакона 7 дней'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <ShieldIcon className="h-5 w-5 shrink-0 text-gold" /> {t}
                  </li>
                ),
              )}
            </ul>
          </div>
          </Reveal>
          <Reveal delay={0.15}>
          <div className="flex flex-col gap-3 border hairline bg-graphite p-6">
            <p className="text-sm text-smoke">Сомневаетесь в выборе?</p>
            <p className="font-display text-xl leading-snug">
              Напишите нам — подберём аромат под характер, сезон и бюджет
            </p>
            <a
              href={`https://t.me/${SHOP.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-2"
            >
              <TelegramIcon className="h-4 w-4" /> Получить консультацию
            </a>
          </div>
          </Reveal>
        </div>
      </section>

      {/* вопросы */}
      <section id="faq" className="border-t hairline bg-coal">
        <div className="container-m27 max-w-3xl py-14">
          <p className="kicker">Частые вопросы</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">Что спрашивают перед покупкой</h2>
          <div className="mt-7 divide-y divide-gold/10 border-y hairline">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-gold transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-smoke">{a}</p>
              </details>
            ))}
          </div>
          <Link href="/catalog/" className="btn-gold mt-8 w-full sm:w-auto">
            Перейти в каталог <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

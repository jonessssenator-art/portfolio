'use client';

/**
 * Служебная страница: 10 вариантов оформления блока товара (на примере Lost Cherry).
 * Назир выбирает номер — выбранный вариант внедряется в ProductView.
 */

import { useState } from 'react';
import { getProduct, PRODUCTS, photoSrc } from '@/lib/products';
import { noteArtKey, noteArtSrc } from '@/lib/note-art';

const product = getProduct('tom-ford-lost-cherry') ?? PRODUCTS[0];
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const SCENE = `${BASE}/hero/tom-ford-lost-cherry.jpg`;

const ALL_NOTES = [
  ...product.notes.top.map((n) => ({ n, t: 'верхняя' })),
  ...product.notes.heart.map((n) => ({ n, t: 'сердце' })),
  ...product.notes.base.map((n) => ({ n, t: 'база' })),
];
const ART_NOTES = ALL_NOTES.filter((x) => noteArtKey(x.n)).slice(0, 4);

function Bottle({ className }: { className?: string }) {
  return (
    <img
      src={photoSrc(product)}
      alt={product.name}
      width={375}
      height={500}
      className={className ?? 'h-[300px] w-auto object-contain drop-shadow-[0_24px_32px_rgba(23,19,16,0.3)]'}
    />
  );
}

function Frame({ n, title, desc, children }: { n: number; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section id={`v${n}`} className="mb-14">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-display text-3xl text-gold">{String(n).padStart(2, '0')}</span>
        <div>
          <h2 className="font-display text-xl">{title}</h2>
          <p className="text-sm text-smoke">{desc}</p>
        </div>
      </div>
      <div className="overflow-hidden border hairline">{children}</div>
    </section>
  );
}

export default function LabView() {
  return (
    <div className="container-m27 py-10">
      <p className="kicker">Лаборатория дизайна</p>
      <h1 className="mt-2 font-display text-3xl">10 вариантов блока товара</h1>
      <p className="mt-2 max-w-xl text-sm text-smoke">
        Все на примере Lost Cherry. Посмотри и назови номер (или несколько) — выбранный вариант
        поставлю на страницы всех 102 товаров.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => (
          <a key={i} href={`#v${i + 1}`} className="border border-ivory/20 px-3 py-1.5 text-sm hover:border-gold">
            {i + 1}
          </a>
        ))}
      </div>

      {/* ── Переходы «панель → сцена» на главной ── */}
      <div className="mt-12">
        <h2 className="font-display text-2xl">Переходы «панель → сцена» на главной</h2>
        <p className="mt-1 text-sm text-smoke">Как тёмная панель встречается с картинкой. Назови П1–П5.</p>
        <div className="mt-5 space-y-8">
          {TRANSITIONS.map((t) => (
            <div key={t.id}>
              <p className="mb-2 text-sm"><span className="font-display text-lg text-gold">{t.id}</span> — {t.name}. <span className="text-smoke">{t.desc}</span></p>
              <div className="relative h-[280px] overflow-hidden border hairline bg-[#171310]">
                <TransitionDemo kind={t.id} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 border-t hairline pt-10">
        <h2 className="font-display text-2xl">Блок товара — 10 раскладок</h2>
      </div>

      <div className="mt-10">
        {/* 1. Кино-сцена */}
        <Frame n={1} title="Кино-сцена" desc="Сгенерированная атмосферная сцена аромата вместо белой карточки, ноты — светлыми выносками поверх">
          <div className="relative h-[480px]">
            <img src={SCENE} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
            {[
              { n: 'Чёрная вишня', pos: 'left-[6%] top-[14%]' },
              { n: 'Горький миндаль', pos: 'right-[6%] top-[22%]' },
              { n: 'Роза', pos: 'left-[8%] top-[62%]' },
              { n: 'Бобы тонка', pos: 'right-[8%] top-[70%]' },
            ].map((c) => (
              <div key={c.n} className={`absolute ${c.pos} flex items-center gap-2`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D9B36A]" />
                <span className="h-px w-10 bg-[#D9B36A]/60" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#F6F1E8]/90">{c.n}</span>
              </div>
            ))}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest2 text-[#F6F1E8]/70">
              {product.brand} · {product.name}
            </p>
          </div>
        </Frame>

        {/* 2. Цвет аромата */}
        <Frame n={2} title="Цвет аромата" desc="Заливка в фирменный цвет духов, гигантское имя, ингредиенты лентой внизу">
          <div className="relative flex h-[480px] flex-col items-center justify-between overflow-hidden py-6" style={{ background: `linear-gradient(170deg, ${product.accent}, #2A0A12)` }}>
            <p className="pointer-events-none absolute top-8 select-none font-display uppercase leading-none text-[#F6F1E8]/15" style={{ fontSize: 'clamp(40px,9vw,110px)' }}>
              {product.name}
            </p>
            <span />
            <Bottle className="relative h-[280px] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]" />
            <div className="relative flex gap-6">
              {ART_NOTES.map((x) => (
                <div key={x.n} className="flex flex-col items-center gap-1.5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F6F1E8]/10 backdrop-blur-sm">
                    <img src={noteArtSrc(noteArtKey(x.n)!)} alt="" className="h-9 w-9 object-contain" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#F6F1E8]/80">{x.n}</span>
                </div>
              ))}
            </div>
          </div>
        </Frame>

        {/* 3. Журнальный разворот */}
        <Frame n={3} title="Журнальный разворот" desc="Флакон слева, справа — нумерованный список нот с тонкими линиями, как оглавление Vogue">
          <div className="grid h-[480px] grid-cols-1 sm:grid-cols-[1.1fr_1fr]">
            <div className="relative flex items-center justify-center bg-graphite">
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 55% at 50% 62%, ${product.accent}22, transparent 70%)` }} />
              <Bottle />
            </div>
            <div className="flex flex-col justify-center divide-y divide-ivory/10 border-l hairline bg-noir px-6">
              {ALL_NOTES.slice(0, 6).map((x, i) => (
                <div key={x.n} className="group flex items-baseline gap-4 py-3">
                  <span className="font-display text-lg text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[15px] transition-colors group-hover:text-gold-dark">{x.n}</span>
                  <span className="ml-auto text-[11px] uppercase tracking-widest2 text-smoke">{x.t}</span>
                </div>
              ))}
            </div>
          </div>
        </Frame>

        {/* 4. Гербарий */}
        <Frame n={4} title="Гербарий" desc="Ингредиенты — как коллекционные карточки-образцы, приколотые вокруг флакона">
          <div className="relative flex h-[480px] items-center justify-center bg-coal">
            <Bottle />
            {ART_NOTES.map((x, i) => {
              const spots = ['left-[6%] top-[10%] -rotate-6', 'right-[7%] top-[14%] rotate-4', 'left-[9%] bottom-[10%] rotate-3', 'right-[9%] bottom-[12%] -rotate-3'];
              return (
                <div key={x.n} className={`absolute ${spots[i]} w-28 bg-graphite p-2 pb-3 shadow-card`}>
                  <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-gold bg-noir" />
                  <img src={noteArtSrc(noteArtKey(x.n)!)} alt="" className="h-16 w-full object-contain" />
                  <p className="mt-1.5 text-center text-[10px] uppercase tracking-[0.12em] text-ivory/80">{x.n}</p>
                </div>
              );
            })}
          </div>
        </Frame>

        {/* 5. Орбита */}
        <Frame n={5} title="Орбита" desc="Ноты на тонком золотом кольце вокруг флакона — как схема молекулы">
          <div className="relative flex h-[480px] items-center justify-center overflow-hidden bg-graphite">
            <div className="absolute h-[380px] w-[380px] rounded-full border border-gold/30" />
            <div className="absolute h-[280px] w-[280px] rounded-full border border-gold/15" />
            <Bottle className="relative z-10 h-[260px] w-auto object-contain drop-shadow-[0_24px_32px_rgba(23,19,16,0.3)]" />
            {ART_NOTES.map((x, i) => {
              const spots = ['left-1/2 top-[6%] -translate-x-1/2', 'right-[13%] top-1/2 -translate-y-1/2', 'left-1/2 bottom-[6%] -translate-x-1/2', 'left-[13%] top-1/2 -translate-y-1/2'];
              return (
                <div key={x.n} className={`absolute ${spots[i]} z-20 flex flex-col items-center gap-1`}>
                  <img src={noteArtSrc(noteArtKey(x.n)!)} alt="" className="h-12 w-12 object-contain drop-shadow" />
                  <span className="bg-graphite/80 px-1.5 text-[10px] uppercase tracking-[0.14em] text-ivory/75">{x.n}</span>
                </div>
              );
            })}
          </div>
        </Frame>

        {/* 6. Три акта */}
        <Frame n={6} title="Три акта" desc="Флакон и под ним раскрытие по времени: сначала → затем → шлейф. Продаёт «путешествие» аромата">
          <div className="flex h-[480px] flex-col bg-graphite">
            <div className="relative flex flex-1 items-center justify-center">
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 70% at 50% 45%, ${product.accent}1f, transparent 70%)` }} />
              <Bottle className="h-[220px] w-auto object-contain drop-shadow-[0_20px_28px_rgba(23,19,16,0.3)]" />
            </div>
            <div className="grid grid-cols-3 divide-x divide-ivory/10 border-t hairline">
              {[
                { t: 'Сначала', d: '15–30 минут', notes: product.notes.top },
                { t: 'Затем', d: '2–4 часа', notes: product.notes.heart },
                { t: 'Шлейф', d: 'до конца дня', notes: product.notes.base },
              ].map((a) => (
                <div key={a.t} className="px-4 py-4 text-center transition-colors hover:bg-gold/5">
                  <p className="font-display text-lg">{a.t}</p>
                  <p className="text-[10px] uppercase tracking-widest2 text-smoke">{a.d}</p>
                  <p className="mt-2 text-[13px] leading-snug text-ivory/80">{a.notes.slice(0, 3).join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>
        </Frame>

        {/* 7. Точки-секреты */}
        <Frame n={7} title="Точки-секреты" desc="Чистый флакон и три золотые точки: наводишь — раскрывается нота. Интерактив без визуального шума">
          <HoverDots />
        </Frame>

        {/* 8. Макро-фон */}
        <Frame n={8} title="Макро-фон" desc="Главный ингредиент — огромный, размытый, как аромат в воздухе. Флакон резкий на его фоне">
          <div className="relative flex h-[480px] items-center justify-center overflow-hidden bg-coal">
            <img src={noteArtSrc('cherry')} alt="" className="absolute left-[8%] top-[10%] h-64 w-64 object-contain opacity-30 blur-2xl" />
            <img src={noteArtSrc('rose')} alt="" className="absolute bottom-[8%] right-[6%] h-72 w-72 object-contain opacity-25 blur-2xl" />
            <Bottle />
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-5">
              {ALL_NOTES.slice(0, 4).map((x) => (
                <span key={x.n} className="text-[11px] uppercase tracking-[0.18em] text-ivory/70">{x.n}</span>
              ))}
            </div>
          </div>
        </Frame>

        {/* 9. Сетка-паспарту */}
        <Frame n={9} title="Сетка-паспарту" desc="Печатная вёрстка: флакон в центре сетки, ингредиенты и факты — в ячейках с тонкими рамками">
          <div className="grid h-[480px] grid-cols-[1fr_1.6fr_1fr] grid-rows-[1fr_1fr] divide-x divide-y divide-ivory/10 bg-graphite">
            <div className="flex flex-col items-center justify-center gap-1 !border-t-0">
              <img src={noteArtSrc('cherry')} alt="" className="h-16 w-16 object-contain" />
              <span className="text-[10px] uppercase tracking-widest2 text-smoke">Чёрная вишня</span>
            </div>
            <div className="row-span-2 flex items-center justify-center !border-t-0">
              <Bottle />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 !border-t-0">
              <img src={noteArtSrc('rose')} alt="" className="h-16 w-16 object-contain" />
              <span className="text-[10px] uppercase tracking-widest2 text-smoke">Роза</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <img src={noteArtSrc('vanilla')} alt="" className="h-16 w-16 object-contain" />
              <span className="text-[10px] uppercase tracking-widest2 text-smoke">Ваниль</span>
            </div>
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <p className="font-display text-2xl text-gold">{product.longevityHours} ч</p>
              <p className="text-[10px] uppercase tracking-widest2 text-smoke">стойкость</p>
            </div>
          </div>
        </Frame>

        {/* 10. Тёмная витрина */}
        <Frame n={10} title="Тёмная витрина" desc="Контрастная чёрная сцена с лучом света и отражением — бутик ночью посреди светлого сайта">
          <div className="relative flex h-[480px] flex-col items-center justify-center overflow-hidden bg-[#14100D]">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[75%] w-[44%] -translate-x-1/2" style={{ background: 'linear-gradient(180deg, rgba(246,241,232,0.10), transparent 75%)', clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)', filter: 'blur(4px)' }} />
            <Bottle className="relative z-10 h-[260px] w-auto object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.8)]" />
            <img src={photoSrc(product)} alt="" aria-hidden className="z-10 -mt-1 h-[90px] w-auto object-cover object-top opacity-25" style={{ transform: 'scaleY(-1)', maskImage: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.5) 100%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.5) 100%)' }} />
            {[
              { n: 'Чёрная вишня', pos: 'left-[7%] top-[18%]' },
              { n: 'Горький миндаль', pos: 'right-[6%] top-[26%]' },
              { n: 'Бобы тонка', pos: 'left-[9%] bottom-[20%]' },
              { n: 'Ваниль', pos: 'right-[9%] bottom-[14%]' },
            ].map((c) => (
              <div key={c.n} className={`absolute ${c.pos} z-20 flex items-center gap-2`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D9B36A] shadow-[0_0_8px_rgba(217,179,106,0.8)]" />
                <span className="h-px w-10 bg-[#D9B36A]/50" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#F6F1E8]/80">{c.n}</span>
              </div>
            ))}
          </div>
        </Frame>
      </div>
    </div>
  );
}

/* ── 5 вариантов перехода панель→сцена ── */
const DELINA = `${BASE}/hero/pdm-delina.jpg`;

const TRANSITIONS = [
  { id: 'П1', name: 'Мягкое затухание', desc: 'плавный eased-градиент без видимой полосы (сейчас стоит на сайте)' },
  { id: 'П2', name: 'Чистый стык + золото', desc: 'резкая граница с тонкой золотой линией — строгий журнальный вариант' },
  { id: 'П3', name: 'Растворение сцены', desc: 'сцена сама становится прозрачной у края — цвета не темнеют и не грязнятся' },
  { id: 'П4', name: 'Диагональный срез', desc: 'панель срезана лёгкой диагональю — динамика без градиентов' },
  { id: 'П5', name: 'Сцена-карточка', desc: 'картинка отступает от панели и живёт в тонкой золотой рамке с воздухом' },
];

function TransitionDemo({ kind }: { kind: string }) {
  const panelText = (
    <div className="absolute left-6 top-1/2 z-20 -translate-y-1/2">
      <p className="text-[10px] uppercase tracking-widest2 text-[#F6F1E8]/60">Parfums de Marly</p>
      <p className="font-display text-2xl text-[#F6F1E8]">Delina</p>
      <p className="text-sm font-semibold text-[#D9B36A]">28 900 ₽</p>
    </div>
  );

  if (kind === 'П5') {
    return (
      <div className="flex h-full">
        <div className="relative w-[42%]">{panelText}</div>
        <div className="flex-1 p-4">
          <div className="h-full border border-[#D9B36A]/50 p-1.5">
            <img src={DELINA} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute inset-y-0 right-0 w-[62%]">
        <img
          src={DELINA}
          alt=""
          className="h-full w-full object-cover"
          style={
            kind === 'П3'
              ? {
                  maskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 12%, black 30%)',
                  WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 12%, black 30%)',
                }
              : kind === 'П4'
                ? { clipPath: 'polygon(9% 0, 100% 0, 100% 100%, 0 100%)' }
                : undefined
          }
        />
        {kind === 'П1' && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-24"
            style={{
              background:
                'linear-gradient(90deg, #171310 0%, rgba(23,19,16,0.74) 19%, rgba(23,19,16,0.54) 34%, rgba(23,19,16,0.38) 47%, rgba(23,19,16,0.28) 56%, rgba(23,19,16,0.19) 65%, rgba(23,19,16,0.13) 73%, rgba(23,19,16,0.075) 80%, rgba(23,19,16,0.04) 86%, rgba(23,19,16,0.02) 91%, rgba(23,19,16,0.008) 95%, rgba(23,19,16,0) 100%)',
            }}
          />
        )}
        {kind === 'П2' && <div className="absolute inset-y-0 left-0 w-px bg-[#D9B36A]/70" />}
      </div>
      {panelText}
    </div>
  );
}

/* вариант 7: интерактивные точки */
function HoverDots() {
  const [active, setActive] = useState<number | null>(null);
  const dots = [
    { n: 'Чёрная вишня', d: 'сочное сладко-кислое открытие', pos: 'left-[38%] top-[18%]', art: 'cherry' },
    { n: 'Роза и миндаль', d: 'бархатное сердце аромата', pos: 'left-[60%] top-[45%]', art: 'rose' },
    { n: 'Ваниль и тонка', d: 'тёплый шлейф до вечера', pos: 'left-[40%] top-[72%]', art: 'vanilla' },
  ];
  return (
    <div className="relative flex h-[480px] items-center justify-center bg-graphite">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 55%, #C4183322, transparent 70%)' }} />
      <Bottle />
      {dots.map((d, i) => (
        <button
          key={d.n}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          onClick={() => setActive(active === i ? null : i)}
          className={`absolute ${d.pos} z-20 flex h-7 w-7 items-center justify-center rounded-full border border-gold bg-graphite/90 font-display text-xs text-gold shadow-card transition-transform hover:scale-110`}
          aria-label={d.n}
        >
          {i + 1}
          {active === i && (
            <span className="absolute left-9 top-1/2 flex w-52 -translate-y-1/2 items-center gap-3 border hairline bg-graphite p-3 text-left shadow-card">
              <img src={noteArtSrc(d.art)} alt="" className="h-10 w-10 shrink-0 object-contain" />
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory">{d.n}</span>
                <span className="block text-[11px] leading-snug text-smoke">{d.d}</span>
              </span>
            </span>
          )}
        </button>
      ))}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] tracking-wide text-smoke">
        Наведи или нажми на точки 1–3
      </p>
    </div>
  );
}

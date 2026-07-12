import type { Config } from 'tailwindcss';

/**
 * Две темы через CSS-переменные (значения в globals.css: :root — светлая, .dark — тёмная).
 * Имена токенов исторические (сайт был тёмным), в светлой теме значения светлые:
 *   noir     — фон страницы (слоновая кость / почти чёрный)
 *   coal     — фон секций (чуть темнее / тёплый чёрный)
 *   graphite — карточки и поля (белый / тёмный уголь)
 *   ivory    — основной текст (почти чёрный / слоновая кость)
 *   smoke    — вторичный текст (тёплый серый)
 *   stage    — подложка больших фото товара
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  future: {
    /* hover-стили только там, где есть настоящий hover — не залипают на тач-экранах */
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        noir: 'rgb(var(--c-noir) / <alpha-value>)',
        coal: 'rgb(var(--c-coal) / <alpha-value>)',
        graphite: 'rgb(var(--c-graphite) / <alpha-value>)',
        smoke: 'rgb(var(--c-smoke) / <alpha-value>)',
        ivory: 'rgb(var(--c-ivory) / <alpha-value>)',
        stage: 'rgb(var(--c-stage) / <alpha-value>)',
        gold: {
          DEFAULT: 'rgb(var(--c-gold) / <alpha-value>)',
          dark: 'rgb(var(--c-gold-dark) / <alpha-value>)',
          light: 'rgb(var(--c-gold-light) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 40px -18px rgb(var(--c-shadow) / var(--shadow-a))',
        glow: '0 0 60px rgb(var(--c-gold) / 0.25)',
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
};

export default config;

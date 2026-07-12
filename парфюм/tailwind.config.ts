import type { Config } from 'tailwindcss';

/**
 * Светлая «editorial» тема в духе Chanel/Byredo/Le Labo.
 * Имена токенов исторические (сайт был тёмным), значения — светлые:
 *   noir     — фон страницы (слоновая кость)
 *   coal     — фон секций (чуть темнее)
 *   graphite — карточки и поля (белый)
 *   ivory    — основной текст (почти чёрный)
 *   smoke    — вторичный текст (тёплый серый)
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  future: {
    /* hover-стили только там, где есть настоящий hover — не залипают на тач-экранах */
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        noir: '#F6F1E8',
        coal: '#EFE8DB',
        graphite: '#FFFFFF',
        smoke: '#75695A',
        ivory: '#171310',
        gold: {
          DEFAULT: '#A07C33',
          dark: '#7C5F26',
          light: '#B99450',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 40px -18px rgba(23,19,16,0.16)',
        glow: '0 0 60px rgba(160,124,51,0.25)',
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
};

export default config;

'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './icons';

/**
 * Переключатель темы. По умолчанию тема берётся из настроек системы
 * (inline-скрипт в layout ставит .dark на <html> до первой отрисовки),
 * ручной выбор запоминается в localStorage('theme27').
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme27', next ? 'dark' : 'light');
    } catch {
      /* приватный режим — просто не запоминаем */
    }
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute('content', next ? '#0B0908' : '#F6F1E8'));
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      className="p-2.5 text-ivory transition-colors hover:text-gold"
    >
      {mounted && dark ? <SunIcon className="h-[21px] w-[21px]" /> : <MoonIcon className="h-[21px] w-[21px]" />}
    </button>
  );
}

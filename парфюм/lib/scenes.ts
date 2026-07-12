/** Ароматы, для которых сгенерированы кинематографичные сцены (Higgsfield). */
export const SCENE_SLUGS = [
  'lattafa-khamrah',
  'dior-sauvage-elixir',
  'pdm-delina',
  'mfk-baccarat-rouge-540',
  'creed-aventus',
  'tom-ford-lost-cherry',
  'nishane-hacivat',
  'ysl-black-opium',
  'armaf-club-de-nuit-intense',
  'kilian-love-dont-be-shy',
];

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** вертикальная сцена 3:4 (телефон, витрина товара) */
export function scenePortrait(slug: string): string {
  return `${BASE}/hero/${slug}.jpg`;
}

/** широкая дорисованная сцена 16:9 (десктопный hero) */
export function sceneWide(slug: string): string {
  return `${BASE}/hero/${slug}-wide.jpg`;
}

export function hasScene(slug: string): boolean {
  return SCENE_SLUGS.includes(slug);
}

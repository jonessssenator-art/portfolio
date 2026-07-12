/**
 * Сопоставление названия ноты с картинкой ингредиента (public/notes/<key>.png).
 * Первое совпадение выигрывает — порядок важен («розовый перец» до «розы»).
 */
const RULES: Array<[RegExp, string]> = [
  [/перец/i, 'pepper'],
  [/шафран/i, 'saffron'],
  [/кориц/i, 'cinnamon'],
  [/ваниль/i, 'vanilla'],
  [/кофе/i, 'coffee'],
  [/какао|шоколад|пралине/i, 'cocoa'],
  [/мёд|медов/i, 'honey'],
  [/табак/i, 'tobacco'],
  [/кожа/i, 'leather'],
  [/финик/i, 'dates'],
  [/кокос/i, 'coconut'],
  [/чай/i, 'tea'],
  [/мята|мятн/i, 'mint'],
  [/лаванд/i, 'lavender'],
  [/жасмин|тубероз|нероли|апельсиновый цвет|иланг|ландыш|магнол|лотос|пион|орхиде|фрези|белые цветы/i, 'jasmine'],
  [/роза|розы/i, 'rose'],
  [/фиалк|ирис|гелиотроп/i, 'violet'],
  [/апельсин|мандарин/i, 'orange'],
  [/лимон|бергамот|лайм|цитрон|юдзу|грейпфрут|вербен/i, 'lemon'],
  [/яблок/i, 'apple'],
  [/ананас/i, 'pineapple'],
  [/вишн/i, 'cherry'],
  [/персик|абрикос/i, 'peach'],
  [/груш/i, 'pear'],
  [/смородин|малин|ежевик|черник|клубник|гранат|ягод|личи|маракуй/i, 'berries'],
  [/ладан|смол|бензоин|амбра|амброксан|янтар|опопонакс|амбергрис|амбров/i, 'resin'],
  [/сандал|кедр|берёз|ветивер|пачули|гваяк|мох|папирус|древес|розовое дерево|кашмеран/i, 'wood'],
];

/** ноты, для которых картинок нет и не будет — вернём null, покажется текстовая выноска */
export function noteArtKey(note: string): string | null {
  const clean = note.trim().toLowerCase();
  if (clean === 'уд' || clean.includes('агаров')) return 'wood';
  for (const [re, key] of RULES) {
    if (re.test(note)) return key;
  }
  return null;
}

export function noteArtSrc(key: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/notes/${key}.png`;
}
import type { RawProduct } from '../products';

/* ─── СЕЛЕКТИВНАЯ ПАРФЮМЕРИЯ: ТОПОВЫЕ НИШЕВЫЕ ДОМА ─── */
export const SEG_SELECTIVE: RawProduct[] = [
  /* — Attar Collection — */
  {
    slug: 'attar-queen-of-sheba', brand: 'Attar Collection', name: 'The Queen of Sheba',
    price: 15900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Персик', 'Османтус', 'Табачный лист'], heart: ['Тубероза', 'Жасмин', 'Роза'], base: ['Белый мускус', 'Амбра'] },
    longevityHours: 10, sillage: 4, accords: ['восточный', 'цветочный', 'табачный'],
    desc: 'Тёмный восточный портрет царицы: персик и табак на туберозе — вечерний аромат, который делает выход эффектным.',
    accent: '#8B1E3F',
  },
  {
    slug: 'attar-khaltat-night', brand: 'Attar Collection', name: 'Khaltat Night',
    price: 17400, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Корица', 'Красное яблоко'], heart: ['Вишня', 'Ваниль'], base: ['Пачули', 'Белый мускус'] },
    longevityHours: 12, sillage: 5, accords: ['сладкий', 'пряный', 'восточный'],
    desc: 'Вишнёвый пирог с корицей на восточный лад: гремит как парфюм втрое дороже — главный бестселлер бренда.',
    accent: '#5B2333',
  },
  {
    slug: 'attar-azora', brand: 'Attar Collection', name: 'Azora',
    price: 14900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Персик', 'Абрикос'], heart: ['Орхидея', 'Белые цветы'], base: ['Мускус', 'Амбра'] },
    longevityHours: 8, sillage: 3, accords: ['фруктовый', 'цветочный', 'мускусный'],
    desc: 'Сочный персик в кремовых цветах — лёгкая альтернатива Fleur Narcotique на каждый день.',
    accent: '#E8965A',
  },
  {
    slug: 'attar-crystal-love-for-her', brand: 'Attar Collection', name: 'Crystal Love For Her',
    price: 15400, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Личи', 'Мандарин'], heart: ['Пион', 'Роза'], base: ['Белый мускус', 'Амбра'] },
    longevityHours: 8, sillage: 3, accords: ['цветочный', 'мускусный', 'фруктовый'],
    desc: 'Прозрачный букет пиона и личи в хрустальном мускусе — нежный дневной аромат для свиданий.',
    accent: '#D9A7C7',
  },

  /* — Sospiro — */
  {
    slug: 'sospiro-erba-pura', brand: 'Sospiro', name: 'Erba Pura',
    price: 33900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Апельсин', 'Бергамот', 'Лимон'], heart: ['Фруктовый коктейль', 'Белые цветы'], base: ['Белый мускус', 'Амбра', 'Ваниль'] },
    longevityHours: 12, sillage: 5, accords: ['фруктовый', 'сладкий', 'мускусный'],
    desc: 'Взрыв цитрусов и сладких фруктов на ванильном мускусе — шлейф, за которым оборачивается вся улица.',
    accent: '#F28C28',
  },

  /* — BDK Parfums — */
  {
    slug: 'bdk-gris-charnel', brand: 'BDK Parfums', name: 'Gris Charnel',
    price: 21900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Кардамон', 'Инжир', 'Чёрный чай'], heart: ['Ирис', 'Ветивер'], base: ['Сандал', 'Бобы тонка'] },
    longevityHours: 8, sillage: 3, accords: ['древесный', 'пряный', 'пудровый'],
    desc: 'Кашемировый свитер в аромате: инжир, чай и сандал — самый обнимательный парижский унисекс.',
    accent: '#8A8683',
  },
  {
    slug: 'bdk-rouge-smoking', brand: 'BDK Parfums', name: 'Rouge Smoking',
    price: 21500, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: [],
    notes: { top: ['Вишня', 'Розовый перец', 'Бергамот'], heart: ['Гелиотроп', 'Флёрдоранж'], base: ['Бобы тонка', 'Ваниль', 'Амброксан'] },
    longevityHours: 9, sillage: 4, accords: ['сладкий', 'фруктовый', 'ваниль'],
    desc: 'Вишня в красном смокинге: пудровая, дорогая, без приторности — ответ Парижа вишнёвым хитам.',
    accent: '#B3123B',
  },
  {
    slug: 'bdk-ambre-safrano', brand: 'BDK Parfums', name: 'Ambre Safrano',
    price: 24900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: ['новинка'],
    notes: { top: ['Шафран', 'Слива'], heart: ['Ладан', 'Кожа'], base: ['Ваниль', 'Сандал', 'Дуб'] },
    longevityHours: 10, sillage: 4, accords: ['амбра', 'пряный', 'кожаный'],
    desc: 'Медовый шафран и сочная слива на кожаной амбре — недооценённая жемчужина BDK для холодов.',
    accent: '#C67B2E',
  },

  /* — Marc-Antoine Barrois — */
  {
    slug: 'mab-ganymede', brand: 'Marc-Antoine Barrois', name: 'Ganymede',
    price: 28900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Шафран', 'Мандарин'], heart: ['Османтус', 'Иммортель', 'Лист фиалки'], base: ['Замша', 'Акигалавуд', 'Минеральные ноты'] },
    longevityHours: 10, sillage: 4, accords: ['кожаный', 'свежий', 'пряный'],
    desc: 'Минеральная замша с другой планеты: аромат, вошедший в историю парфюмерии, — узнаваем с первой секунды.',
    accent: '#5B6E8C',
  },
  {
    slug: 'mab-encelade', brand: 'Marc-Antoine Barrois', name: 'Encelade',
    price: 27900, volume: 100, concentration: 'Eau de Parfum', gender: 'м', tags: [],
    notes: { top: ['Ревень', 'Зелёные ноты'], heart: ['Кедр', 'Дым'], base: ['Ветивер', 'Кожа', 'Бобы тонка'] },
    longevityHours: 11, sillage: 4, accords: ['зелёный', 'древесный', 'кожаный'],
    desc: 'Кислый ревень над джунглями у жерла вулкана — зелёный кожаный аромат с космической стойкостью.',
    accent: '#3E5C43',
  },

  /* — Maison Crivelli — */
  {
    slug: 'crivelli-hibiscus-mahajad', brand: 'Maison Crivelli', name: 'Hibiscus Mahajád',
    price: 29900, volume: 50, concentration: 'Extrait de Parfum', gender: 'у', tags: ['новинка'],
    notes: { top: ['Гибискус', 'Чёрная смородина'], heart: ['Дамасская роза', 'Мята'], base: ['Ваниль', 'Кожа', 'Амбретта'] },
    longevityHours: 12, sillage: 4, accords: ['цветочный', 'сладкий', 'восточный'],
    desc: 'Каркаде на рынке самоцветов: роза и гибискус в ванильной коже — экстракт 32%, шлейф уровня люкс.',
    accent: '#A62653',
  },
  {
    slug: 'crivelli-osmanthe-kodoshan', brand: 'Maison Crivelli', name: 'Osmanthe Kodoshan',
    price: 23900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: [],
    notes: { top: ['Османтус', 'Сычуаньский перец'], heart: ['Чёрный чай', 'Звёздчатый анис'], base: ['Табак', 'Пачули', 'Амбра'] },
    longevityHours: 7, sillage: 3, accords: ['цветочный', 'табачный', 'пряный'],
    desc: 'Абрикосовый османтус с чёрным чаем и табаком — тихая роскошь для тех, кто не любит кричащие ароматы.',
    accent: '#C98A3D',
  },

  /* — Stéphane Humbert Lucas 777 — */
  {
    slug: 'shl-god-of-fire', brand: 'Stéphane Humbert Lucas 777', name: 'God of Fire',
    price: 31900, volume: 50, concentration: 'Extrait de Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Манго', 'Имбирь', 'Красные ягоды'], heart: ['Жасмин', 'Кумарин', 'Кедр'], base: ['Уд', 'Амбра', 'Мускус'] },
    longevityHours: 14, sillage: 5, accords: ['фруктовый', 'сладкий', 'уд'],
    desc: 'Пылающее манго на уде и амбре — самый обсуждаемый селектив последних лет, звучит сутки.',
    accent: '#D64B1E',
  },
  {
    slug: 'shl-soleil-de-jeddah', brand: 'Stéphane Humbert Lucas 777', name: 'Soleil de Jeddah',
    price: 29900, volume: 50, concentration: 'Eau de Parfum', gender: 'у', tags: [],
    notes: { top: ['Ромашка', 'Османтус', 'Лимон'], heart: ['Амбергрис', 'Ирис'], base: ['Кожа', 'Ваниль'] },
    longevityHours: 10, sillage: 4, accords: ['кожаный', 'фруктовый', 'медовый'],
    desc: 'Солнце Джидды: абрикосовая кожа с мёдом и ирисом — тёплый восток без тяжести, визитная карточка дома.',
    accent: '#E8A735',
  },

  /* — Franck Boclet — */
  {
    slug: 'boclet-cocaine', brand: 'Franck Boclet', name: 'Cocaïne',
    price: 15900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Карамель', 'Табак', 'Горький апельсин'], heart: ['Тубероза', 'Орхидея'], base: ['Ваниль', 'Пачули', 'Масло монои'] },
    longevityHours: 12, sillage: 5, accords: ['сладкий', 'табачный', 'ваниль'],
    desc: 'Карамельный табак с дерзким именем — абсолютный бестселлер Boclet, вызывающий зависимость с первого пшика.',
    accent: '#9BA3AF',
  },
  {
    slug: 'boclet-tonka', brand: 'Franck Boclet', name: 'Tonka',
    price: 14900, volume: 100, concentration: 'Eau de Parfum', gender: 'м', tags: [],
    notes: { top: ['Фиговый лист', 'Имбирь', 'Лимон'], heart: ['Миндаль', 'Белый персик', 'Кедр'], base: ['Бобы тонка', 'Перуанский бальзам', 'Сандал'] },
    longevityHours: 9, sillage: 4, accords: ['гурманский', 'древесный', 'пряный'],
    desc: 'Миндаль и тонка на тёплом сандале — уютная мужская классика для осени с отличной проекцией.',
    accent: '#8C5A2B',
  },

  /* — Orto Parisi — */
  {
    slug: 'orto-parisi-megamare', brand: 'Orto Parisi', name: 'Megamare',
    price: 22900, volume: 50, concentration: 'Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Бергамот', 'Лимон'], heart: ['Водоросли', 'Калон'], base: ['Амброксан', 'Мускус', 'Кедр'] },
    longevityHours: 14, sillage: 5, accords: ['акватический', 'свежий', 'мускусный'],
    desc: 'Океан, возведённый в абсолют: солёная мощь, которую слышно через комнату, — самый громкий морской аромат в мире.',
    accent: '#1F6F8B',
  },
  {
    slug: 'orto-parisi-terroni', brand: 'Orto Parisi', name: 'Terroni',
    price: 21900, volume: 50, concentration: 'Parfum', gender: 'у', tags: [],
    notes: { top: ['Малина', 'Дымные ноты'], heart: ['Берёза', 'Амбра', 'Бензоин'], base: ['Гваяковое дерево', 'Ветивер', 'Пачули'] },
    longevityHours: 12, sillage: 5, accords: ['дымный', 'древесный', 'восточный'],
    desc: 'Сладкий дым Везувия: малина на горящих смолах и дереве — вулканический характер для смелых.',
    accent: '#B22D1D',
  },

  /* — Nasomatto — */
  {
    slug: 'nasomatto-black-afgano', brand: 'Nasomatto', name: 'Black Afgano',
    price: 19900, volume: 30, concentration: 'Extrait de Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Каннабис', 'Зелёные ноты', 'Шафран'], heart: ['Табак', 'Кофе', 'Смолы'], base: ['Уд', 'Ладан', 'Амбра'] },
    longevityHours: 12, sillage: 5, accords: ['дымный', 'уд', 'восточный'],
    desc: 'Культовое «чёрное зелье» Гуалтьери: смолы, табак и уд — тёмный властелин нишевой парфюмерии.',
    accent: '#1C1C1C',
  },
  {
    slug: 'nasomatto-pardon', brand: 'Nasomatto', name: 'Pardon',
    price: 18900, volume: 30, concentration: 'Extrait de Parfum', gender: 'м', tags: [],
    notes: { top: ['Магнолия', 'Белые цветы'], heart: ['Тёмный шоколад', 'Бобы тонка', 'Корица'], base: ['Уд', 'Сандал'] },
    longevityHours: 10, sillage: 4, accords: ['гурманский', 'древесный', 'пряный'],
    desc: 'Шоколадный антидепрессант в бархатном пиджаке — элегантный уд с корицей для уверенных мужчин.',
    accent: '#4A2C2A',
  },

  /* — Zarkoperfume — */
  {
    slug: 'zarkoperfume-molecule-234-38', brand: 'Zarkoperfume', name: 'MOLéCULE 234.38',
    price: 13900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: [],
    notes: { top: ['Изо Е Супер', 'Прозрачный аккорд'], heart: ['Пудровые ноты', 'Цветочная дымка'], base: ['Полициклический мускус', 'Амбровые ноты'] },
    longevityHours: 8, sillage: 2, accords: ['древесный', 'мускусный', 'пудровый'],
    desc: 'Скандинавская молекула-феномен: сливается с кожей и звучит как «твой запах, только лучше».',
    accent: '#BFD7EA',
  },
  {
    slug: 'zarkoperfume-pink-molecule-090-09', brand: 'Zarkoperfume', name: 'PINK MOLéCULE 090.09',
    price: 12900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Шампанское', 'Абрикос', 'Чёрная бузина'], heart: ['Чёрная орхидея', 'Цветочные ноты'], base: ['Взбитые сливки', 'Красное дерево'] },
    longevityHours: 8, sillage: 3, accords: ['фруктовый', 'сладкий', 'мускусный'],
    desc: 'Розовое шампанское с абрикосом и взбитыми сливками — игристое настроение в каждом пшике.',
    accent: '#F291B0',
  },

  /* — Escentric Molecules — */
  {
    slug: 'escentric-molecule-01', brand: 'Escentric Molecules', name: 'Molecule 01',
    price: 13400, volume: 100, concentration: 'Eau de Toilette', gender: 'у', tags: ['хит'],
    notes: { top: ['Изо Е Супер', 'Прозрачный аккорд'], heart: ['Бархатистые древесные ноты', 'Кедр'], base: ['Мягкий мускус', 'Амбровые ноты'] },
    longevityHours: 8, sillage: 2, accords: ['древесный', 'мускусный'],
    desc: 'Легендарная монофония из одной молекулы: феромонный эффект — комплименты получаете вы, а не парфюм.',
    accent: '#A9A9B0',
  },
  {
    slug: 'escentric-molecule-02', brand: 'Escentric Molecules', name: 'Molecule 02',
    price: 13400, volume: 100, concentration: 'Eau de Toilette', gender: 'у', tags: [],
    notes: { top: ['Амброксан', 'Морской воздух'], heart: ['Амбра', 'Минеральные ноты'], base: ['Мускус', 'Сухие древесные ноты'] },
    longevityHours: 9, sillage: 2, accords: ['амбра', 'свежий', 'мускусный'],
    desc: 'Чистый амброксан — солёная «вторая кожа», идеальная база для лееринга и офисных будней.',
    accent: '#7B9EA8',
  },
  {
    slug: 'escentric-01', brand: 'Escentric Molecules', name: 'Escentric 01',
    price: 12900, volume: 100, concentration: 'Eau de Toilette', gender: 'у', tags: [],
    notes: { top: ['Лаймовая цедра', 'Розовый перец'], heart: ['Ирис', 'Изо Е Супер'], base: ['Амброкс', 'Мускус'] },
    longevityHours: 7, sillage: 2, accords: ['свежий', 'древесный', 'пряный'],
    desc: 'Лайм и розовый перец вокруг культовой молекулы — минимализм, который носится как любимая белая рубашка.',
    accent: '#B5C689',
  },

  /* — Acqua di Parma — */
  {
    slug: 'adp-colonia', brand: 'Acqua di Parma', name: 'Colonia',
    price: 16900, volume: 100, concentration: 'Eau de Cologne', gender: 'у', tags: ['хит'],
    notes: { top: ['Лимон', 'Бергамот', 'Апельсин'], heart: ['Лаванда', 'Роза', 'Розмарин'], base: ['Ветивер', 'Сандал', 'Пачули'] },
    longevityHours: 6, sillage: 2, accords: ['цитрусовый', 'свежий', 'фужерный'],
    desc: 'Итальянский шик с 1916 года: сицилийские цитрусы и лаванда — одеколон, не выходящий из моды сто лет.',
    accent: '#F0C93B',
  },
  {
    slug: 'adp-fico-di-amalfi', brand: 'Acqua di Parma', name: 'Blu Mediterraneo Fico di Amalfi',
    price: 15900, volume: 75, concentration: 'Eau de Toilette', gender: 'у', tags: [],
    notes: { top: ['Грейпфрут', 'Лимон', 'Цитрон'], heart: ['Фиговый нектар', 'Жасмин', 'Розовый перец'], base: ['Фиговое дерево', 'Кедр', 'Бензоин'] },
    longevityHours: 7, sillage: 3, accords: ['цитрусовый', 'фруктовый', 'зелёный'],
    desc: 'Инжир Амальфитанского побережья: солнце, море и фиговое дерево — лето в флаконе круглый год.',
    accent: '#7FB069',
  },
  {
    slug: 'adp-colonia-pura', brand: 'Acqua di Parma', name: 'Colonia Pura',
    price: 17400, volume: 100, concentration: 'Eau de Cologne', gender: 'у', tags: [],
    notes: { top: ['Бергамот', 'Апельсин'], heart: ['Жасмин самбак', 'Нарцисс', 'Кориандр'], base: ['Белый мускус', 'Кедр', 'Пачули'] },
    longevityHours: 6, sillage: 2, accords: ['цитрусовый', 'мускусный', 'свежий'],
    desc: 'Современное прочтение классики от Франсуа Демаши: хрустящая свежесть белой рубашки на каждый день.',
    accent: '#D9C778',
  },

  /* — Frederic Malle — */
  {
    slug: 'malle-portrait-of-a-lady', brand: 'Frederic Malle', name: 'Portrait of a Lady',
    price: 39900, volume: 50, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Роза', 'Малина', 'Корица'], heart: ['Пачули', 'Ладан', 'Сандал'], base: ['Мускус', 'Амбра', 'Бензоин'] },
    longevityHours: 14, sillage: 5, accords: ['цветочный', 'восточный', 'шипровый'],
    desc: 'Тёмная роза на пачули и ладане — мега-культ Доминика Ропьона, эталон роскошной женственности.',
    accent: '#7D1128',
  },
  {
    slug: 'malle-musc-ravageur', brand: 'Frederic Malle', name: 'Musc Ravageur',
    price: 34900, volume: 50, concentration: 'Eau de Parfum', gender: 'у', tags: [],
    notes: { top: ['Лаванда', 'Мандарин', 'Бергамот'], heart: ['Корица', 'Гвоздика'], base: ['Мускус', 'Ваниль', 'Бобы тонка', 'Амбра'] },
    longevityHours: 12, sillage: 4, accords: ['мускусный', 'восточный', 'ваниль'],
    desc: 'Самый знаменитый мускус в истории ниши: животный, тёплый, откровенный — аромат-соблазнение.',
    accent: '#8E4A2E',
  },
  {
    slug: 'malle-carnal-flower', brand: 'Frederic Malle', name: 'Carnal Flower',
    price: 38900, volume: 50, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Эвкалипт', 'Дыня', 'Бергамот'], heart: ['Тубероза', 'Жасмин', 'Кокос'], base: ['Белый мускус', 'Амбра'] },
    longevityHours: 10, sillage: 4, accords: ['цветочный', 'зелёный', 'мускусный'],
    desc: 'Рекордная доза абсолюта туберозы: пышный запретный цветок Калифорнии — лучшая тубероза современности.',
    accent: '#A7C796',
  },

  /* — Parfums MDCI — */
  {
    slug: 'mdci-invasion-barbare', brand: 'Parfums MDCI', name: 'Invasion Barbare',
    price: 36900, volume: 75, concentration: 'Eau de Parfum', gender: 'м', tags: [],
    notes: { top: ['Лист фиалки', 'Грейпфрут', 'Бергамот'], heart: ['Лаванда', 'Кардамон', 'Тимьян'], base: ['Ваниль', 'Мускус', 'Пачули'] },
    longevityHours: 9, sillage: 3, accords: ['фужерный', 'пряный', 'свежий'],
    desc: 'Пять звёзд от Луки Турина: аристократичный фужер с кардамоном — эталон мужской элегантности.',
    accent: '#3B4C7A',
  },
  {
    slug: 'mdci-chypre-palatin', brand: 'Parfums MDCI', name: 'Chypre Palatin',
    price: 34900, volume: 75, concentration: 'Eau de Parfum', gender: 'у', tags: [],
    notes: { top: ['Гальбанум', 'Альдегиды', 'Клементин'], heart: ['Слива', 'Ирис', 'Гардения'], base: ['Дубовый мох', 'Кожа', 'Ваниль'] },
    longevityHours: 10, sillage: 4, accords: ['шипровый', 'кожаный', 'восточный'],
    desc: 'Неоклассический шипр Бертрана Дюшофура: смолы, мох и кожа — окутывает как бархатная мантия.',
    accent: '#556B2F',
  },

  /* — Xerjoff Casamorati — */
  {
    slug: 'casamorati-lira', brand: 'Xerjoff Casamorati', name: 'Lira',
    price: 27900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Красный апельсин', 'Бергамот', 'Лаванда'], heart: ['Корица', 'Жасмин', 'Роза'], base: ['Ваниль', 'Карамель', 'Мускус'] },
    longevityHours: 9, sillage: 4, accords: ['гурманский', 'сладкий', 'цитрусовый'],
    desc: 'Карамель, апельсин и корица — гурманский шедевр Xerjoff, в который влюбляются с первого вдоха.',
    accent: '#C0392B',
  },
  {
    slug: 'casamorati-mefisto', brand: 'Xerjoff Casamorati', name: 'Mefisto',
    price: 26900, volume: 100, concentration: 'Eau de Parfum', gender: 'м', tags: [],
    notes: { top: ['Бергамот', 'Лимон', 'Лаванда'], heart: ['Ирис', 'Роза', 'Белый чай'], base: ['Мускус', 'Сандал', 'Кедр'] },
    longevityHours: 8, sillage: 3, accords: ['цитрусовый', 'фужерный', 'мускусный'],
    desc: 'Редкий «единорог»: свежий цитрусовый аромат, который звучит громко и держится весь день.',
    accent: '#4682B4',
  },
  {
    slug: 'casamorati-italica', brand: 'Xerjoff Casamorati', name: 'Italica',
    price: 28900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: [],
    notes: { top: ['Миндаль', 'Молоко', 'Шафран'], heart: ['Ваниль', 'Ириска'], base: ['Сандал', 'Мускус', 'Кедр'] },
    longevityHours: 10, sillage: 4, accords: ['гурманский', 'ваниль', 'пудровый'],
    desc: 'Молочное амаретто-печенье на сандале — один из лучших гурманов десятилетия по версии читателей Fragrantica.',
    accent: '#D7B48A',
  },
];

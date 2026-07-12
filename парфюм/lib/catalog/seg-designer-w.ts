import type { RawProduct } from '../products';

/* ─── СЕГМЕНТ: ЖЕНСКИЕ ДИЗАЙНЕРСКИЕ И НИШЕВЫЕ БЕСТСЕЛЛЕРЫ ─── */
export const SEG_DESIGNER_W: RawProduct[] = [
  /* ── Chanel ── */
  {
    slug: 'chanel-chance-eau-fraiche', brand: 'Chanel', name: 'Chance Eau Fraîche',
    price: 18900, volume: 100, concentration: 'Eau de Toilette', gender: 'ж', tags: [],
    notes: { top: ['Лимон', 'Цитрон', 'Кедр'], heart: ['Жасмин', 'Водяной гиацинт', 'Розовый перец'], base: ['Белый мускус', 'Ветивер', 'Ирис'] },
    longevityHours: 6, sillage: 2, accords: ['свежий', 'цитрусовый', 'зелёный'],
    desc: 'Искристая зелёная свежесть Chanel: лимон и жасмин, как глоток прохладного воздуха. Дневная классика на весну и лето.',
    accent: '#BFD98F',
  },
  {
    slug: 'chanel-gabrielle', brand: 'Chanel', name: 'Gabrielle',
    price: 19900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Грейпфрут', 'Мандарин', 'Чёрная смородина'], heart: ['Жасмин', 'Иланг-иланг', 'Тубероза'], base: ['Мускус', 'Сандал', 'Кашмеран'] },
    longevityHours: 7, sillage: 3, accords: ['цветочный', 'свежий', 'мускусный'],
    desc: 'Сияющий букет четырёх белых цветов, посвящённый самой Габриэль Шанель. Элегантность без тяжести.',
    accent: '#E8C868',
  },
  {
    slug: 'chanel-no5-leau', brand: 'Chanel', name: "N°5 L'Eau",
    price: 18500, volume: 100, concentration: 'Eau de Toilette', gender: 'ж', tags: [],
    notes: { top: ['Альдегиды', 'Лимон', 'Нероли'], heart: ['Роза', 'Жасмин', 'Иланг-иланг'], base: ['Белый мускус', 'Кедр', 'Ваниль'] },
    longevityHours: 6, sillage: 2, accords: ['цветочный', 'пудровый', 'свежий'],
    desc: 'Легендарный N°5 в лёгком современном прочтении — вся роскошь классики без винтажной тяжести.',
    accent: '#F0E0B0',
  },

  /* ── Dior ── */
  {
    slug: 'dior-hypnotic-poison', brand: 'Dior', name: 'Hypnotic Poison',
    price: 15900, volume: 100, concentration: 'Eau de Toilette', gender: 'ж', tags: ['хит'],
    notes: { top: ['Кокос', 'Слива', 'Абрикос'], heart: ['Жасмин', 'Тубероза', 'Ландыш'], base: ['Ваниль', 'Миндаль', 'Мускус'] },
    longevityHours: 10, sillage: 4, accords: ['ваниль', 'гурманский', 'восточный'],
    desc: 'Ваниль, миндаль и кокос в красном флаконе-яблоке: культовый вечерний гипноз, от которого не отказываются десятилетиями.',
    accent: '#8E1F2E',
  },
  {
    slug: 'dior-miss-dior-blooming-bouquet', brand: 'Dior', name: 'Miss Dior Blooming Bouquet',
    price: 15500, volume: 100, concentration: 'Eau de Toilette', gender: 'ж', tags: ['новинка'],
    notes: { top: ['Бергамот', 'Душистый горошек'], heart: ['Пион', 'Дамасская роза'], base: ['Белый мускус', 'Кедр'] },
    longevityHours: 6, sillage: 2, accords: ['цветочный', 'свежий', 'пудровый'],
    desc: 'Нежный букет пиона и розы в дымке мускуса — самый деликатный Miss Dior для дня и весны.',
    accent: '#F2C4D0',
  },
  {
    slug: 'dior-addict', brand: 'Dior', name: 'Addict',
    price: 16900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Лист мандарина', 'Апельсиновый цвет'], heart: ['Жасмин самбак', 'Тубероза'], base: ['Бурбонская ваниль', 'Сандал'] },
    longevityHours: 9, sillage: 4, accords: ['ваниль', 'цветочный', 'восточный'],
    desc: 'Ночной цветок на горячей ванили: томный, затягивающий, очень «вечерний» Dior.',
    accent: '#2E3A8E',
  },

  /* ── Guerlain ── */
  {
    slug: 'guerlain-mon-guerlain', brand: 'Guerlain', name: 'Mon Guerlain',
    price: 16500, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Лаванда', 'Бергамот'], heart: ['Жасмин самбак', 'Ирис', 'Роза'], base: ['Таитянская ваниль', 'Сандал', 'Кумарин'] },
    longevityHours: 9, sillage: 3, accords: ['ваниль', 'пудровый', 'фужерный'],
    desc: 'Лаванда и таитянская ваниль, созданные для Анджелины Джоли: нежная сила в хрустальном флаконе.',
    accent: '#D8C8A0',
  },
  {
    slug: 'guerlain-shalimar', brand: 'Guerlain', name: 'Shalimar',
    price: 17900, volume: 90, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Бергамот', 'Лимон', 'Мандарин'], heart: ['Ирис', 'Жасмин', 'Роза'], base: ['Ваниль', 'Ладан', 'Бобы тонка', 'Кожа'] },
    longevityHours: 10, sillage: 4, accords: ['восточный', 'ваниль', 'пудровый'],
    desc: 'Первый восточный аромат в истории парфюмерии: дымная ваниль и ирис — столетняя легенда Guerlain.',
    accent: '#3A5AA0',
  },
  {
    slug: 'guerlain-la-petite-robe-noire', brand: 'Guerlain', name: 'La Petite Robe Noire',
    price: 14900, volume: 75, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Вишня', 'Миндаль', 'Бергамот'], heart: ['Роза', 'Лакрица', 'Чай'], base: ['Ваниль', 'Бобы тонка', 'Ирис'] },
    longevityHours: 8, sillage: 4, accords: ['сладкий', 'фруктовый', 'гурманский'],
    desc: '«Маленькое чёрное платье»: вишня с миндалём и розой — парижский флирт, который узнают с первой ноты.',
    accent: '#7A1F3A',
  },

  /* ── Lancôme ── */
  {
    slug: 'lancome-la-nuit-tresor', brand: 'Lancôme', name: 'La Nuit Trésor',
    price: 13900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Личи', 'Бергамот'], heart: ['Чёрная роза', 'Ванильная орхидея'], base: ['Пралине', 'Пачули', 'Ладан'] },
    longevityHours: 10, sillage: 4, accords: ['сладкий', 'гурманский', 'ваниль'],
    desc: 'Чёрная роза на ванили с пралине — аромат-приворот для свиданий, главный вечерний Lancôme.',
    accent: '#5A1F3A',
  },
  {
    slug: 'lancome-hypnose', brand: 'Lancôme', name: 'Hypnôse',
    price: 11900, volume: 75, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Пассифлора', 'Абрикос'], heart: ['Гардения', 'Жасмин'], base: ['Ваниль', 'Ветивер'] },
    longevityHours: 8, sillage: 3, accords: ['ваниль', 'цветочный', 'восточный'],
    desc: 'Кремовая ваниль с белыми цветами — тёплый гипноз, который до сих пор собирает комплименты.',
    accent: '#6E4A8E',
  },

  /* ── Yves Saint Laurent ── */
  {
    slug: 'ysl-mon-paris', brand: 'Yves Saint Laurent', name: 'Mon Paris',
    price: 14500, volume: 90, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Клубника', 'Малина', 'Бергамот'], heart: ['Пион', 'Жасмин', 'Апельсиновый цвет'], base: ['Белый мускус', 'Пачули', 'Амбра'] },
    longevityHours: 8, sillage: 3, accords: ['фруктовый', 'сладкий', 'цветочный'],
    desc: 'Головокружительные ягоды и пион — Париж влюблённых во флаконе с чёрным бантом.',
    accent: '#E88AA8',
  },

  /* ── Giorgio Armani ── */
  {
    slug: 'armani-acqua-di-gioia', brand: 'Giorgio Armani', name: 'Acqua di Gioia',
    price: 12900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Лимон', 'Мята'], heart: ['Водяной жасмин', 'Пион'], base: ['Кедр', 'Коричневый сахар', 'Лабданум'] },
    longevityHours: 7, sillage: 3, accords: ['акватический', 'свежий', 'цитрусовый'],
    desc: 'Женская версия морской легенды Armani: мята, лимон и водяной жасмин — чистая радость лета.',
    accent: '#7AB8B0',
  },
  {
    slug: 'armani-si-passione', brand: 'Giorgio Armani', name: 'Sì Passione',
    price: 14900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Груша', 'Чёрная смородина', 'Розовый перец'], heart: ['Роза', 'Жасмин', 'Ананас'], base: ['Ваниль', 'Кедр', 'Амбровое дерево'] },
    longevityHours: 9, sillage: 4, accords: ['фруктовый', 'цветочный', 'сладкий'],
    desc: 'Алая страсть Armani: сочная груша и роза на ванили. Уверенный вечерний характер.',
    accent: '#C2182E',
  },

  /* ── Versace ── */
  {
    slug: 'versace-eros-pour-femme', brand: 'Versace', name: 'Eros Pour Femme',
    price: 12500, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Сицилийский лимон', 'Гранат', 'Бергамот'], heart: ['Жасмин самбак', 'Пион', 'Цветы лимона'], base: ['Мускус', 'Амброксан', 'Сандал'] },
    longevityHours: 8, sillage: 3, accords: ['цветочный', 'цитрусовый', 'мускусный'],
    desc: 'Богиня в золотом: лимонные цветы и жасмин на чувственном мускусе — женский ответ легендарному Eros.',
    accent: '#D8C060',
  },
  {
    slug: 'versace-crystal-noir', brand: 'Versace', name: 'Crystal Noir',
    price: 11500, volume: 90, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Имбирь', 'Кардамон', 'Перец'], heart: ['Гардения', 'Кокос', 'Пион'], base: ['Сандал', 'Мускус', 'Амбра'] },
    longevityHours: 8, sillage: 3, accords: ['цветочный', 'восточный', 'пряный'],
    desc: 'Ночная гардения с имбирём — аромат роковой женщины, двадцать лет не выходящий из моды.',
    accent: '#2A2430',
  },
  {
    slug: 'versace-dylan-blue-femme', brand: 'Versace', name: 'Dylan Blue Pour Femme',
    price: 11900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Чёрная смородина', 'Яблоко', 'Незабудка'], heart: ['Жасмин', 'Шиповник'], base: ['Мускус', 'Белые древесные ноты', 'Стиракс'] },
    longevityHours: 8, sillage: 3, accords: ['фруктовый', 'цветочный', 'мускусный'],
    desc: 'Смородиновый сорбет и жасмин в античной амфоре — дерзкая женственность от Донателлы Versace.',
    accent: '#1E3A8E',
  },

  /* ── Dolce & Gabbana ── */
  {
    slug: 'dg-the-one', brand: 'Dolce & Gabbana', name: 'The One',
    price: 13900, volume: 75, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Персик', 'Личи', 'Бергамот'], heart: ['Лилия', 'Жасмин', 'Слива'], base: ['Ваниль', 'Амбра', 'Мускус'] },
    longevityHours: 8, sillage: 3, accords: ['цветочный', 'фруктовый', 'восточный'],
    desc: 'Кремовая лилия и персик со шлейфом тёплой ванили — золотая классика для той самой единственной.',
    accent: '#C8A040',
  },
  {
    slug: 'dg-limperatrice', brand: 'Dolce & Gabbana', name: "L'Impératrice",
    price: 9900, volume: 100, concentration: 'Eau de Toilette', gender: 'ж', tags: ['хит'],
    notes: { top: ['Киви', 'Ревень', 'Розовый перец'], heart: ['Арбуз', 'Цикламен', 'Жасмин'], base: ['Мускус', 'Сандал'] },
    longevityHours: 6, sillage: 3, accords: ['фруктовый', 'свежий', 'акватический'],
    desc: 'Арбуз и киви со льдом — «Императрица», самый освежающий летний бестселлер D&G в России.',
    accent: '#E85A8E',
  },

  /* ── Gucci ── */
  {
    slug: 'gucci-flora-gorgeous-gardenia', brand: 'Gucci', name: 'Flora Gorgeous Gardenia',
    price: 14900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Цветы груши', 'Красные ягоды'], heart: ['Белая гардения', 'Жасмин'], base: ['Коричневый сахар', 'Пачули'] },
    longevityHours: 8, sillage: 3, accords: ['цветочный', 'сладкий', 'фруктовый'],
    desc: 'Сливочная гардения с грушевым цветом и сахаром — вирусный хит в розовом флаконе Gucci.',
    accent: '#E8A0B8',
  },
  {
    slug: 'gucci-guilty', brand: 'Gucci', name: 'Guilty Pour Femme',
    price: 13500, volume: 90, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Розовый перец', 'Мандарин', 'Бергамот'], heart: ['Сирень', 'Фиалка', 'Роза'], base: ['Пачули', 'Амбра'] },
    longevityHours: 8, sillage: 3, accords: ['цветочный', 'пудровый', 'амбра'],
    desc: 'Пудровая сирень и фиалка — «виноватое удовольствие» Gucci для тех, кто играет не по правилам.',
    accent: '#B08AC0',
  },

  /* ── Prada ── */
  {
    slug: 'prada-paradoxe', brand: 'Prada', name: 'Paradoxe',
    price: 15900, volume: 90, concentration: 'Eau de Parfum', gender: 'ж', tags: ['новинка'],
    notes: { top: ['Груша', 'Мандарин', 'Бергамот'], heart: ['Нероли', 'Жасмин самбак', 'Апельсиновый цвет'], base: ['Бурбонская ваниль', 'Амбра', 'Белый мускус'] },
    longevityHours: 8, sillage: 3, accords: ['цветочный', 'ваниль', 'амбра'],
    desc: 'Нероли на тёплой ванили во флаконе-треугольнике: современный бестселлер Prada о женщине-парадоксе.',
    accent: '#E0D8C8',
  },
  {
    slug: 'prada-candy', brand: 'Prada', name: 'Candy',
    price: 12900, volume: 80, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Мускус', 'Пудровые ноты'], heart: ['Бензоин', 'Карамель'], base: ['Ваниль', 'Мускус'] },
    longevityHours: 8, sillage: 4, accords: ['гурманский', 'сладкий', 'пудровый'],
    desc: 'Карамель на пудровом мускусе — дерзкая сладость Prada, которая звучит дорого, а не приторно.',
    accent: '#E86A8E',
  },

  /* ── Carolina Herrera ── */
  {
    slug: 'ch-212-vip-rose', brand: 'Carolina Herrera', name: '212 VIP Rosé',
    price: 11900, volume: 80, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Шампанское розе', 'Розовый перец'], heart: ['Роза', 'Цветы персика'], base: ['Белый мускус', 'Древесные ноты'] },
    longevityHours: 8, sillage: 3, accords: ['фруктовый', 'цветочный', 'мускусный'],
    desc: 'Розовое шампанское и персиковый цвет — пропуск на закрытые вечеринки Нью-Йорка.',
    accent: '#E8B0C8',
  },

  /* ── Givenchy ── */
  {
    slug: 'givenchy-linterdit', brand: 'Givenchy', name: "L'Interdit",
    price: 13900, volume: 80, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Груша', 'Бергамот'], heart: ['Тубероза', 'Апельсиновый цвет', 'Жасмин самбак'], base: ['Пачули', 'Ваниль', 'Ветивер'] },
    longevityHours: 9, sillage: 4, accords: ['цветочный', 'восточный', 'ваниль'],
    desc: 'Запретные белые цветы на тёмном пачули: современная легенда Givenchy — дерзкая и элегантная сразу.',
    accent: '#2A2028',
  },
  {
    slug: 'givenchy-ange-ou-demon-le-secret', brand: 'Givenchy', name: 'Ange ou Démon Le Secret',
    price: 12500, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Чайный лист', 'Клюква', 'Лимон'], heart: ['Жасмин', 'Пион', 'Водяная лилия'], base: ['Белый мускус', 'Пачули', 'Ваниль'] },
    longevityHours: 7, sillage: 3, accords: ['цветочный', 'свежий', 'мускусный'],
    desc: 'Ангел или демон? Чайный жасмин с чистым мускусом хранит секрет своей обладательницы.',
    accent: '#D8C8E0',
  },

  /* ── Kenzo ── */
  {
    slug: 'kenzo-flower', brand: 'Kenzo', name: 'Flower by Kenzo',
    price: 11900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Чёрная смородина', 'Мандарин', 'Боярышник'], heart: ['Пармская фиалка', 'Роза', 'Опопонакс'], base: ['Белый мускус', 'Ваниль', 'Ладан'] },
    longevityHours: 8, sillage: 3, accords: ['пудровый', 'цветочный', 'ваниль'],
    desc: 'Красный мак над городом: пудровая фиалка и ваниль — икона, у которой нет возраста.',
    accent: '#C82E3A',
  },
  {
    slug: 'kenzo-world', brand: 'Kenzo', name: 'World',
    price: 9900, volume: 75, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Красные ягоды', 'Фруктовые ноты'], heart: ['Пион', 'Египетский жасмин'], base: ['Амброксан', 'Мускус'] },
    longevityHours: 7, sillage: 3, accords: ['цветочный', 'фруктовый', 'амбра'],
    desc: 'Пион и ягоды на чистом амброксане от Франсиса Куркджяна — современный минимализм с характером.',
    accent: '#8E2E5A',
  },

  /* ── Narciso Rodriguez ── */
  {
    slug: 'narciso-for-her', brand: 'Narciso Rodriguez', name: 'For Her Eau de Parfum',
    price: 14500, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Роза', 'Персик'], heart: ['Мускус', 'Амбра'], base: ['Пачули', 'Сандал'] },
    longevityHours: 9, sillage: 3, accords: ['мускусный', 'пудровый', 'цветочный'],
    desc: 'Тот самый «дорогой мускус», по которому узнают ухоженных женщин. Эталон чувственной чистоты.',
    accent: '#1F1B1D',
  },
  {
    slug: 'narciso-poudree', brand: 'Narciso Rodriguez', name: 'Narciso Poudrée',
    price: 14900, volume: 90, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Болгарская роза', 'Белый жасмин'], heart: ['Мускус', 'Пудровые ноты'], base: ['Кедр', 'Ветивер'] },
    longevityHours: 9, sillage: 3, accords: ['пудровый', 'мускусный', 'древесный'],
    desc: 'Облако пудрового мускуса в белом кубе — нежность кашемирового свитера на голой коже.',
    accent: '#EFEBE4',
  },

  /* ── Chloé ── */
  {
    slug: 'chloe-eau-de-parfum', brand: 'Chloé', name: 'Chloé Eau de Parfum',
    price: 14900, volume: 75, concentration: 'Eau de Parfum', gender: 'ж', tags: ['хит'],
    notes: { top: ['Пион', 'Личи', 'Фрезия'], heart: ['Роза', 'Магнолия', 'Ландыш'], base: ['Кедр', 'Амбра'] },
    longevityHours: 7, sillage: 3, accords: ['цветочный', 'пудровый', 'свежий'],
    desc: 'Свежая роза и пион в плиссированном флаконе: парижский шик, ставший фирменным запахом миллионов.',
    accent: '#E8D0B8',
  },
  {
    slug: 'chloe-nomade', brand: 'Chloé', name: 'Nomade',
    price: 13900, volume: 75, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Мирабель', 'Бергамот'], heart: ['Фрезия', 'Персик', 'Жасмин'], base: ['Дубовый мох', 'Пачули', 'Белый мускус'] },
    longevityHours: 8, sillage: 3, accords: ['шипровый', 'фруктовый', 'цветочный'],
    desc: 'Слива мирабель на дубовом мхе — шипровый характер для свободных и лёгких на подъём.',
    accent: '#C8A878',
  },

  /* ── Jo Malone ── */
  {
    slug: 'jo-malone-english-pear-freesia', brand: 'Jo Malone', name: 'English Pear & Freesia',
    price: 14500, volume: 100, concentration: 'Cologne', gender: 'ж', tags: ['хит'],
    notes: { top: ['Груша', 'Дыня'], heart: ['Фрезия', 'Роза'], base: ['Мускус', 'Пачули', 'Амбра'] },
    longevityHours: 6, sillage: 2, accords: ['фруктовый', 'свежий', 'цветочный'],
    desc: 'Спелая английская груша и фрезия — самый продаваемый Jo Malone: свежо, дорого, никогда не слишком.',
    accent: '#D8C888',
  },
  {
    slug: 'jo-malone-peony-blush-suede', brand: 'Jo Malone', name: 'Peony & Blush Suede',
    price: 14900, volume: 100, concentration: 'Cologne', gender: 'ж', tags: [],
    notes: { top: ['Красное яблоко', 'Гвоздика'], heart: ['Пион', 'Роза', 'Жасмин'], base: ['Замша', 'Мускус'] },
    longevityHours: 6, sillage: 2, accords: ['цветочный', 'пудровый', 'кожаный'],
    desc: 'Пион на нежной замше с хрустом красного яблока — весенний фаворит невест и минималисток.',
    accent: '#E8B8C0',
  },

  /* ── Escada / Moschino ── */
  {
    slug: 'escada-moon-sparkle', brand: 'Escada', name: 'Moon Sparkle',
    price: 8900, volume: 100, concentration: 'Eau de Toilette', gender: 'ж', tags: [],
    notes: { top: ['Клубника', 'Красное яблоко', 'Чёрная смородина'], heart: ['Фрезия', 'Жасмин', 'Душистый горошек'], base: ['Малина', 'Мускус', 'Сандал'] },
    longevityHours: 6, sillage: 3, accords: ['фруктовый', 'сладкий', 'свежий'],
    desc: 'Клубника с малиной в лунном свете: весёлый ягодный флирт — культовая Escada.',
    accent: '#C05AB8',
  },
  {
    slug: 'moschino-toy-2', brand: 'Moschino', name: 'Toy 2',
    price: 10900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: [],
    notes: { top: ['Яблоко', 'Мандарин', 'Магнолия'], heart: ['Пион', 'Жасмин', 'Белая смородина'], base: ['Мускус', 'Сандал', 'Амбровое дерево'] },
    longevityHours: 7, sillage: 3, accords: ['цветочный', 'мускусный', 'фруктовый'],
    desc: 'Запах чистоты и свежевыглаженного белья во флаконе-мишке: игрушка снаружи, элегантность внутри.',
    accent: '#C8D8E0',
  },
  {
    slug: 'moschino-toy-2-bubble-gum', brand: 'Moschino', name: 'Toy 2 Bubble Gum',
    price: 10500, volume: 100, concentration: 'Eau de Toilette', gender: 'ж', tags: ['хит'],
    notes: { top: ['Засахаренные цитрусы', 'Бабл-гам'], heart: ['Цветы персика', 'Болгарская роза', 'Имбирь'], base: ['Мускус', 'Кедр'] },
    longevityHours: 6, sillage: 3, accords: ['сладкий', 'фруктовый', 'мускусный'],
    desc: 'Розовый мишка с запахом жвачки из детства — вирусный хит соцсетей и самый весёлый подарок.',
    accent: '#F090B8',
  },

  /* ── НИША: Tiziana Terenzi / Sospiro / Ex Nihilo / Juliette Has A Gun ── */
  {
    slug: 'tiziana-terenzi-andromeda', brand: 'Tiziana Terenzi', name: 'Andromeda',
    price: 22900, volume: 100, concentration: 'Extrait de Parfum', gender: 'у', tags: [],
    notes: { top: ['Иланг-иланг', 'Водяной жасмин', 'Бергамот'], heart: ['Персик', 'Цветы груши', 'Лилия'], base: ['Кашемировое дерево', 'Ваниль', 'Амбра', 'Кокос'] },
    longevityHours: 12, sillage: 5, accords: ['сладкий', 'фруктовый', 'амбра'],
    desc: 'Созвездие из персика и ванили с космической стойкостью — сестра легендарной Kirke.',
    accent: '#4A3A6E',
  },
  {
    slug: 'sospiro-accento', brand: 'Sospiro', name: 'Accento',
    price: 27900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: ['хит'],
    notes: { top: ['Ананас', 'Гиацинт'], heart: ['Ирис', 'Жасмин', 'Розовый перец'], base: ['Мускус', 'Амбра', 'Ваниль'] },
    longevityHours: 10, sillage: 4, accords: ['фруктовый', 'цветочный', 'мускусный'],
    desc: 'Оперный ананас с ирисом: итальянская ниша с роскошным шлейфом — визитная карточка Sospiro.',
    accent: '#BFC7D6',
  },
  {
    slug: 'ex-nihilo-lust-in-paradise', brand: 'Ex Nihilo', name: 'Lust in Paradise',
    price: 26900, volume: 100, concentration: 'Eau de Parfum', gender: 'ж', tags: ['новинка'],
    notes: { top: ['Розовый перец', 'Личи'], heart: ['Пион', 'Роза'], base: ['Мускус', 'Белый кедр', 'Амбра'] },
    longevityHours: 8, sillage: 3, accords: ['цветочный', 'фруктовый', 'мускусный'],
    desc: 'Райский пион и личи от парижской лаборатории Ex Nihilo — младшая сестра Fleur Narcotique.',
    accent: '#E8C8D8',
  },
  {
    slug: 'juliette-vanilla-vibes', brand: 'Juliette Has A Gun', name: 'Vanilla Vibes',
    price: 15900, volume: 100, concentration: 'Eau de Parfum', gender: 'у', tags: [],
    notes: { top: ['Морская соль', 'Орхидея'], heart: ['Абсолют ванили', 'Бобы тонка'], base: ['Мускус', 'Сандал', 'Бензоин'] },
    longevityHours: 8, sillage: 3, accords: ['ваниль', 'мускусный', 'акватический'],
    desc: 'Солёная ваниль на тёплой коже — пляж, загар и «вкусный» шлейф без приторности.',
    accent: '#E8D8B8',
  },
];

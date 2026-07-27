/**
 * GUDOVA GROUP — centralized reference data.
 * Source of truth for the WhatsApp fallback message builder and
 * analytics event payloads. The visible page markup is authored
 * statically in index.html (reliable render, no FOUC, crawlable);
 * this file exists so JS-only features don't hardcode duplicate copies
 * of the same facts.
 */
window.GUDOVA_CONTENT = {
  contacts: {
    phone: '+79896650707',
    phoneDisplay: '+7 989 665-07-07',
    whatsapp: '79896650707',
    email: 'gudbuilding@gmail.com',
    address: 'РД, г. Махачкала, ул. Радищева, 4'
  },
  services: [
    { id: 'smeta', title: 'Сметное сопровождение' },
    { id: 'audit', title: 'Аудит инвестиционного проекта' },
    { id: 'legal', title: 'Юридическое сопровождение' },
    { id: 'zakazchik', title: 'Технический заказчик и строительный контроль' },
    { id: 'docs', title: 'Исполнительно-техническая документация' }
  ],
  projects: [
    { name: 'Школа на 1224 места (СОШ №58), п. Семендер', region: 'Республика Дагестан', price: '1 160 000 000 ₽' },
    { name: 'Реконструкция Азербайджанского гос. драмтеатра, г. Дербент', region: 'Республика Дагестан', price: '379 576 820 ₽' },
    { name: 'Водовод «Кайтаг — Дербент», 1 этап', region: 'Республика Дагестан', price: '1 129 474 760 ₽' },
    { name: 'Тепличный комплекс: блоки и ирригация, 3 этап', region: 'Россия', price: '512 940 946 ₽' },
    { name: 'Мясоперерабатывающее предприятие, 1 этап', region: 'Россия', price: '678 000 000 ₽' },
    { name: '«Мариинская гимназия», п. Шолоховский', region: 'Ростовская область', price: 'по запросу' }
  ],
  totalDisclosed: '3,86 млрд ₽'
};

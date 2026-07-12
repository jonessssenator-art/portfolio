export function formatPrice(value: number): string {
  // toLocaleString('ru-RU') разделяет разряды неразрывным пробелом —
  // сохраняем его и приклеиваем ₽ тоже неразрывно, чтобы цена не рвалась по строкам
  return `${value.toLocaleString('ru-RU')} ₽`;
}

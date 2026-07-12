import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-m27 flex flex-col items-center py-24 text-center">
      <p className="font-display text-6xl text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl">Такой страницы нет</h1>
      <p className="mt-2 text-smoke">Зато есть ароматы, которые стоит понюхать</p>
      <Link href="/catalog/" className="btn-gold mt-7">
        Перейти в каталог
      </Link>
    </div>
  );
}

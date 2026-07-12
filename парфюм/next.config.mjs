// сайт живёт на GitHub Pages в подпапке; при переезде на свой домен поставить ''
const basePath = '/portfolio/maison27';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  // прокидываем basePath в код: <img> сам его не подставляет
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;

import { MetadataRoute } from 'next'

// Замініть 'https://fpvmaster.com.ua' на ваш домен
const BASE_URL = 'https://fpvmaster.com.ua';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*', // Правила застосовуються до всіх пошукових роботів
        allow: [
          '/',
          '/$',
        ],
        disallow: [
          '/cart', // Заборонити сканування кошика
          '/checkout', // Заборонити сканування сторінок оформлення замовлення
          '/api/', // Заборонити сканування API-маршрутів
          '/_next/static/', // Заборонити сканування статичних файлів Next.js, які не є важливими для індексації
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
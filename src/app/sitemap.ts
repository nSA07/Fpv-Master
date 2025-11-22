import { getCategoriesSlugs, getProductsForSitemap } from '@/lib/directus';
import { MetadataRoute } from 'next';


const BASE_URL = 'https://fpvmaster.com.ua';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoriesSlugs = await getCategoriesSlugs();
  const productPaths = await getProductsForSitemap();
  
  // 1. Статичні сторінки (незалежні від CMS)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${BASE_URL}/dostavka-i-oplata`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/sale`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/contacts`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
  ];

  // 2. Сторінки категорій
  const categoryRoutes: MetadataRoute.Sitemap = categoriesSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Сторінки товарів (використовуємо об'єднані шляхи)
  const productRoutes: MetadataRoute.Sitemap = productPaths.map((item) => ({
    // Створення URL у форматі /categorySlug/productSlug
    url: `${BASE_URL}/${item.categorySlug}/${item.productSlug}`, 
    lastModified: new Date(item.lastModified),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
  ];
}
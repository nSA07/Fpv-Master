export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/directus';

const BASE_URL = 'https://fpvmaster.com.ua';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await getProducts();

    // Головна сторінка
    const routes: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        priority: 0.9,
      },
    ];

    // Товари
    const productRoutes = products
      .filter(
        (product) =>
          product.active &&
          product.slug &&
          product.subcategories?.slug
      )
      .map((product) => ({
        url: `${BASE_URL}/${product.subcategories.slug}/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error('❌ SITEMAP ERROR:', error);
    return [];
  }
}

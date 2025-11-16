import { getOneCategory, getProductsByCategorySlug } from "@/lib/directus";
import { CategoryClient } from "@/components/category/category-client";

export default async function Page({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params; 
  const category = await getOneCategory(categorySlug);
  
  const products: Product[] = await getProductsByCategorySlug(categorySlug);
  
  return (
    <CategoryClient
      category={category}
      products={products}
    />
  );
}

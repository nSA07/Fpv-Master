import { getOneCategory, getProductsByCategoryId } from "@/lib/directus";
import { CategoryClient } from "@/components/category/category-client";

export default async function Page({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params; 
  const category = await getOneCategory(categoryId);
  
  const products: Product[] = await getProductsByCategoryId(categoryId);
  
  return (
    <CategoryClient
      category={category}
      products={products}
    />
  );
}

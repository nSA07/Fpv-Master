import {CategorySection} from "@/components/category/category-section";
import { getCategories, getProducts } from "@/lib/directus";

export default async function Home() {
  const categories = await getCategories();
  const products = await getProducts();  
  
  return (
    <CategorySection categories={categories} products={products}/>
  );
}

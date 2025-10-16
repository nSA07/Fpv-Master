interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  sku: string;
  features?: string[];
  product_attributes: ProductAttribute[] | null;
  equipment?: string[];
  producer: string;
  images: { directus_files_id: string }[];
  brand: string;
  category: string;
  subcategories: Subcategory;
}

interface ProductAttribute {
  id: number;
  name: string;
  value: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category: string
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children_subcategory: Subcategory[];
}

interface CategorySectionProps {
  categories: Category[];
  products: Product[];
}
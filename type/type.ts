interface Product {
  product: any;
  id: string;
  name: string;
  active: boolean;
  price: number;
  price_old?: number | null;
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
  active: boolean;
  name: string;
  slug: string;
  category: Category;
}

interface Category {
  id: string;
  active: boolean;
  name: string;
  slug: string;
  children_subcategory: Subcategory[];
}

interface CategorySectionProps {
  categories: Category[];
  products: Product[];
}
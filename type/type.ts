interface Product {
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

interface CartProduct {
  id: string;
  name: string;
  price: number; // у гривнях
  sku: string;
  images: { directus_files_id: string }[];
  brand: string;
  description?: string;
  stock?: number;
}

interface CartItem {
  id: string;
  quantity: number;
}

interface OrderPayload {
  local_order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  comment?: string;
  city: string;
  city_ref: string;
  warehouse: string;
  warehouse_ref: string;
  products: any[]; // Поле з деталями товарів
  payment_status: "pending" | "paid" | "failed";
  shipping_status: "not_shipped" | "shipped" | "delivered";
}
export const API_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
export const API_TOKEN = process.env.DIRECTUS_TOKEN!;
import { notFound } from "next/navigation";

interface FetchOptions extends RequestInit {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  cache?: RequestCache;
  body?: any;
}

export async function directusFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error(`❌ Directus error: ${res.status}`, errorData);
    throw new Error(errorData?.errors?.[0]?.message || "Помилка запиту до Directus");
  }

  const data = await res.json();
  return data.data as T;
}

// === КАТЕГОРІЇ ===
export async function getCategories() {
  const data = await directusFetch<any[]>(
    `/items/categories?filter[active][_eq]=true&fields=
      id,
      active,
      name,
      slug,
      children_subcategory.id,
      children_subcategory.active,
      children_subcategory.name,
      children_subcategory.category.id,
      children_subcategory.category.slug`
  );

  return data.map(cat => ({
    ...cat,
    children_subcategory: cat.children_subcategory?.filter((sub: { active: any; }) => sub.active),
  }));
}

export async function getOneCategory(slug: string) {
  const res = await directusFetch<any>(
    `/items/categories?filter[slug][_eq]=${slug}&fields=
      id,
      active,
      name,
      slug,
      children_subcategory.id,
      children_subcategory.slug,
      children_subcategory.active,
      children_subcategory.name`
  );

  const data: Category | undefined = res[0];  

  if (!data || !data.active) notFound();

  return {
    ...data,
    children_subcategory: data.children_subcategory?.filter(sub => sub.active),
  };
}

// === ПРОДУКТИ ===
export async function getProducts(onlyDiscounted?: boolean) {
  const params = new URLSearchParams({
    "filter[active][_eq]": "true",
    fields: "id,slug,active,name,description,price,price_old,sku,brand,stock,images.directus_files_id.filename_disk,features,product_attributes,subcategories.id,subcategories.slug,subcategories.active,subcategories.name,subcategories.category.id, subcategories.category.slug",
  });

  if (onlyDiscounted) {
    params.append("filter[price_old][_nnull]", "true");
  }

  return await directusFetch<any[]>(`/items/products?${params.toString()}`);
}

export async function getOneProduct(slug: string) {
  const data = await directusFetch<any[]>(
    `/items/products?filter[slug][_eq]=${slug}&fields=
      id,
      slug,
      active,
      name,
      description,
      price,
      price_old,
      sku,
      brand,
      stock,
      images.directus_files_id.filename_disk,
      features,
      equipment,
      producer,
      product_attributes.id,
      product_attributes.name,
      product_attributes.value,
      subcategories.id,
      subcategories.slug,
      subcategories.active,
      subcategories.name,
      subcategories.category.id,
      subcategories.category.slug,
      subcategories.category.active`
  );

  // Directus повертає масив
  return data[0] ?? null;
}

export async function getProductsByCategorySlug(slug: string) {
  return await directusFetch<any[]>(
    `/items/products?filter[subcategories][category][slug][_eq]=${slug}&filter[active][_eq]=true&filter[subcategories][active][_eq]=true&fields=
      id,
      slug,
      active,
      name,
      description,
      price,
      price_old,
      sku,
      brand,
      stock,
      images.directus_files_id.filename_disk,
      features,
      equipment,
      producer,
      product_attributes.id,
      product_attributes.name,
      product_attributes.value,
      subcategories.id,
      subcategories.slug,
      subcategories.active,
      subcategories.name,
      subcategories.category.id,
      subcategories.category.slug,
      subcategories.category.active`
  );
}

// === ЗАМОВЛЕННЯ ===
export async function getOrderByLocalId(orderId: string) {
  const orders = await directusFetch<any[]>(
    `/items/orders?filter[local_order_id][_eq]=${orderId}`
  );
  return orders.length > 0 ? orders[0] : null;
}

export async function createOrder(data: OrderPayload) {
    try {
        const res = await fetch(`${API_URL}/items/orders`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Directus CREATE error:", error);
            // Повертаємо об'єкт помилки, щоб обробити його у route.ts
            return { errors: error.errors || [{ message: "Failed to create order" }] };
        }

        const result = await res.json();
        // Повертаємо дані з Directus, включаючи згенерований ID
        return { data: result.data }; 

    } catch (error) {
        console.error("Directus CREATE fetch error:", error);
        return { errors: [{ message: "Network error during order creation" }] };
    }
}

// --- 2. Оновлення існуючого замовлення (PATCH) ---
export async function updateOrder(orderId: string | number, data: Partial<OrderPayload>) {
    try {
        // PATCH-запит напряму за ID Directus
        const res = await fetch(`${API_URL}/items/orders/${orderId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });

        if (!res.ok) {
            const error = await res.json();
            console.error(`Directus PATCH error for ID ${orderId}:`, error);
            return { errors: error.errors || [{ message: "Failed to update order" }] };
        }
        
        const result = await res.json();
        // Повертаємо оновлені дані
        return { data: result.data };

    } catch (error) {
        console.error("Directus PATCH fetch error:", error);
        return { errors: [{ message: "Network error during order update" }] };
    }
}


import { notFound } from "next/navigation";

export const API_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
export const API_TOKEN = process.env.DIRECTUS_TOKEN;

export async function getCategories() {
  const res = await fetch(
    `${API_URL}/items/categories?filter[active][_eq]=true&fields=
      id,
      active,
      name,
      slug,
      children_subcategory.id,
      children_subcategory.active,
      children_subcategory.name,
      children_subcategory.category.id`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Помилка отримання категорій");
  }

  const data = await res.json();

  const filtered = data.data.map((cat: { children_subcategory: any[]; }) => ({
    ...cat,
    children_subcategory: cat.children_subcategory?.filter(
      (sub) => sub.active
    ),
  }));

  return filtered;
}


export async function getProducts(onlyDiscounted?: boolean) {
  const params = new URLSearchParams();

  // Основний фільтр — активні товари
  params.append("filter[active][_eq]", "true");

  // Якщо треба тільки зі знижкою
  if (onlyDiscounted) {
    params.append("filter[price_old][_nnull]", "true");
  }

  // Поля
  params.append(
    "fields",
    `
      id,
      active,
      name,
      description,
      price,
      price_old,
      sku,
      images.directus_files_id,
      brand,
      stock,
      features,
      product_attributes,
      subcategories,
        subcategories.id,
        subcategories.active,
        subcategories.name,
        subcategories.category.id
    `
  );

  const res = await fetch(`${API_URL}/items/products?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Помилка отримання категорій");
  }

  const data = await res.json();
  return data.data;
}


export async function getOneProducts(id: string) {
  const res = await fetch(
    `${API_URL}/items/products/${id}?fields=
      id,
      active,
      name,
      description,
      price,
      price_old,
      sku,
      brand,
      stock,
      images.directus_files_id,
      features,
      equipment,
      producer,
      product_attributes,
      product_attributes.id,
      product_attributes.name,
      product_attributes.value,
      subcategories,
        subcategories.id,
        subcategories.active,
        subcategories.name,
        subcategories.category,
        subcategories.category.id,
        subcategories.category.active`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Помилка отримання категорій");
  }

  const data = await res.json();
  return data.data;
}

export async function getOneCategory(id: string) {
  const res = await fetch(
    `${API_URL}/items/categories/${id}?fields=
      id,
      active,
      name,
      slug,
      children_subcategory.id,
      children_subcategory.active,
      children_subcategory.name`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Помилка отримання категорії");
  }

  const data = await res.json();
  
  if (!data.data || !data.data.active) {
    notFound();
  }

  return {
    ...data.data,
    children_subcategory: data.data.children_subcategory?.filter(
      (sub: any) => sub.active
    ),
  };
}

export async function getProductsByCategoryId(id: string) {
  const res = await fetch(
    `${API_URL}/items/products?filter[subcategories][category][id][_eq]=${id}&filter[active][_eq]=true&filter[subcategories][active][_eq]=true&fields=
        id,
        active,
        name,
        description,
        price,
        price_old,
        sku,
        brand,
        stock,
        images.directus_files_id,
        features,
        equipment,
        producer,
        product_attributes.id,
        product_attributes.name,
        product_attributes.value,
        subcategories,
          subcategories.id,
          subcategories.active,
          subcategories.name,
          subcategories.category.id,
          subcategories.category.active`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Помилка отримання товарів");
  }
  
  const data = await res.json();
  return data.data;
}


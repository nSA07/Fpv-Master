export const API_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
export const API_TOKEN = process.env.DIRECTUS_TOKEN;

export async function getCategories() {
  const res = await fetch(
    `${API_URL}/items/categories?fields=
      id,
      name,
      slug,
      children_subcategory,
      children_subcategory.id,
      children_subcategory.name`,
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
      name,
      slug,
      children_subcategory,
      children_subcategory.id,
      children_subcategory.name`,
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

export async function getProducts() {
  const res = await fetch(
    `${API_URL}/items/products?fields=
      id,
      name,
      description,
      price,
      sku,
      images.directus_files_id,
      brand,
      stock,
      features,
      product_attributes,
      subcategories,
        subcategories.id,
        subcategories.name,
        subcategories.category`,
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

export async function getOneProducts(id: string) {
  const res = await fetch(
    `${API_URL}/items/products/${id}?fields=
      id,
      name,
      description,
      price,
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
        subcategories.name,
        subcategories.category`,
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

export async function getProductsByCategoryId(id: string) {
  
  const res = await fetch(
    `${API_URL}/items/products?filter[subcategories][category][_eq]=${id}&fields=
      id,
      name,
      description,
      price,
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
        subcategories.name,
        subcategories.category`,
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

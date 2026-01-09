import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function handleStockUpdate(products: any[], directusUrl: string, directusToken: string, directusOrderId: string) {
  if (!products || products.length === 0) {
    console.log(`Замовлення ${directusOrderId}: Товари для оновлення стоку не знайдено.`);
    return;
  }

  for (const item of products) {
    const productSku = item.sku;
    const purchasedQuantity = item.quantity;
    
    if (!productSku || typeof purchasedQuantity !== 'number' || purchasedQuantity <= 0) {
      console.error(`Помилка: Пропущено SKU або кількість для елемента замовлення в замовленні ${directusOrderId}.`);
      continue; 
    }

    let productId: string;
    let currentStock: number;

    try {
      const getProductRes = await fetch(
        `${directusUrl}/items/products?filter[sku][_eq]=${productSku}&fields=id,stock`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${directusToken}`,
        },
      });

      if (!getProductRes.ok) {
        console.error(`Помилка GET-запиту товару за SKU ${productSku}:`, await getProductRes.text());
        continue;
      }

      const productSearchData = await getProductRes.json();
      const product = productSearchData.data?.[0]; // Очікуємо, що SKU унікальний, беремо перший результат

      if (!product) {
        console.error(`Помилка: Товар з SKU ${productSku} не знайдено в колекції 'products'.`);
        continue;
      }
      
      productId = product.id;
      currentStock = product.stock;
      
      if (typeof currentStock !== 'number') {
        console.error(`Помилка: Поле 'stock' товару ${productId} не є числом. Поточне значення: ${currentStock}`);
        continue;
      }
      const newStock = currentStock - purchasedQuantity;
      
      if (newStock < 0) {
        console.warn(`Увага: Стік продукту ${productId} (SKU: ${productSku}) став від'ємним (${newStock}) після замовлення ${directusOrderId}.`);
      }

      const stockUpdateRes = await fetch(`${directusUrl}/items/products/${productId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${directusToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            stock: newStock, 
        }),
      });

      if (!stockUpdateRes.ok) {
        const errorText = await stockUpdateRes.text();
        console.error(`Directus stock PATCH failed for product ID ${productId} (SKU: ${productSku}) in order ${directusOrderId}:`, errorText);
      } else {
        console.log(`✅ Успішно оновлено сток для товару ID ${productId} (SKU: ${productSku}): ${currentStock} -> ${newStock}.`);
      }
    } catch (stockErr) {
      console.error(`Критична помилка обробки стоку для SKU ${productSku} в замовленні ${directusOrderId}:`, stockErr);
    }
  }
}

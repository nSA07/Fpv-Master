export function buildMonoPayload(
  products: CartProduct[],
  cartItems: CartItem[],
  orderId: string
) {
  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const MONO_URL = process.env.NEXT_PUBLIC_ASSETS_URL;

  const items = products
    .map((product) => {
      const item = cartItems.find((i) => i.id === product.id);
      if (!item) return null;

      const qty = item.quantity || 1;
      const sum = (product.price ?? 0) * qty * 100;

      let iconUrl: string | undefined;

      if (product.images?.[0]?.directus_files_id && DIRECTUS_URL) {
        iconUrl = `${DIRECTUS_URL}/assets/${product.images[0].directus_files_id}`;
      }
      return {
        name: product.name,
        qty,
        sum,
        unit: "шт",
        icon: iconUrl,
        code: product.sku || product.id, 
      };
    })
    .filter(Boolean);

  const total = items.reduce((sum, i: any) => sum + i.sum, 0);

  return {
    amount: total,
    ccy: 980,
    merchantPaymInfo: {
      reference: orderId,
      destination: "Оплата замовлення з FPV Master",
      basketOrder: items,
    },
    webHookUrl: `${MONO_URL}/api/mono/webhook`, 
    redirectUrl: `${MONO_URL}/cart`,
  };
}

// Функція createMonoInvoice залишається без змін:
export async function createMonoInvoice(payload: any) {
  // ... (Ваша оригінальна функція)
  const monoRes = await fetch("https://api.monobank.ua/api/merchant/invoice/create", {
    method: "POST",
    headers: {
      "X-Token": process.env.MONO_TOKEN!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!monoRes.ok) {
    const error = await monoRes.text();
    throw new Error(`Mono error: ${error}`);
  }

  return monoRes.json();
}
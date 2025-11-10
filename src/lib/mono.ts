export function buildMonoPayload(
  products: CartProduct[],
  cartItems: CartItem[],
  orderId: string
) {
  const items = products
    .map((product) => {
      const item = cartItems.find((i) => i.id === product.id);
      if (!item) return null;

      const qty = item.quantity || 1;
      const sum = product.price * qty * 100;

      return {
        name: product.name,
        qty,
        sum,
        unit: "шт",
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
  };
}

export async function createMonoInvoice(payload: any) {
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
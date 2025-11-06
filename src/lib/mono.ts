import { CartItem, CartProduct } from "../../type/type";

export function buildMonoPayload(
  products: CartProduct[],
  cartItems: CartItem[]
) {
  const items = products
    .map((product) => {
      const item = cartItems.find((i) => i.id === product.id);
      if (!item) return null;
      const qty = item.quantity || 1;
      const sum = product.price * qty * 100; // у копійках

      return {
        name: product.name,
        qty,
        sum,
        icon: `${process.env.DIRECTUS_BASE_URL}${product.images?.[0]?.directus_files_id}`,
        unit: "шт",
      };
    })
    .filter(Boolean);

  const total = items.reduce((sum, i: any) => sum + i.sum, 0);

  return {
    amount: total,
    ccy: 980,
    merchantPaymInfo: {
      reference: `ORDER-${Date.now()}`,
      destination: "Оплата замовлення з FPV Master",
      basketOrder: items,
    },
    redirectUrl: process.env.REDIRECT_URL,
    webHookUrl: process.env.WEBHOOK_URL,
  };
}

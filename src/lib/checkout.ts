// submitCheckout (Клієнтський код)

import { CheckoutFormValues } from "@/app/checkout/page";
import { useCartStore } from "@/store/cartStore";

export async function submitCheckout(data: CheckoutFormValues, products: Product[], cartItems: CartItem[]) {
    const cartStore = useCartStore.getState();
    const orderIdLocal = cartStore.orderId; // Ваш локальний ID
    
    // 1️⃣ Перевірка замовлення
    const checkRes = await fetch(`/api/check-order?orderId=${orderIdLocal}`);
    const checkData = await checkRes.json();
    
    if (checkData.exists && checkData.payment_status === "paid") {
        cartStore.resetCartState();
        return { error: "ORDER_ALREADY_PAID" };
    }
    
    // Визначаємо Directus ID для передачі в єдиний API
    const directusOrderId = checkData.exists ? checkData.orderIdDirectus : null;
    
    // 2️⃣ Єдиний виклик API
    const res = await fetch("/api/checkout", {
        method: "POST", // Завжди POST для зручності
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            customer: data, 
            products, 
            cartItems, 
            orderId: orderIdLocal, // Ваш локальний ID
            directusOrderId: directusOrderId // Directus ID (null, якщо нове)
        }),
    });

    const result = await res.json();

    if (result.pageUrl) {
        window.location.href = result.pageUrl;
    } else {
        alert(result.error || "Помилка створення оплати");
    }
}
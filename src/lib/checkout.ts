import { CheckoutFormValues } from "@/app/checkout/page";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export async function submitCheckout(data: CheckoutFormValues, products: Product[], cartItems: CartItem[]) {
    const cartStore = useCartStore.getState();
    const orderIdLocal = cartStore.orderId;
    
    const checkRes = await fetch(`/api/check-order?orderId=${orderIdLocal}`);
    const checkData = await checkRes.json();
    
    if (checkData.exists && checkData.payment_status === "paid") {
        cartStore.resetCartState();
        return { error: "ORDER_ALREADY_PAID" };
    }
    
    const directusOrderId = checkData.exists ? checkData.orderIdDirectus : null;

    const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            customer: data, 
            products, 
            cartItems, 
            orderId: orderIdLocal,
            directusOrderId: directusOrderId,
            paymentMethod: data.paymentMethod,
        }),
    });

    const result = await res.json();

    if (result.pageUrl) {
        window.location.href = result.pageUrl;
        return;
    }
    if (result.success) {
        const orderUrl = `https://www.fpvmaster.com.ua/order-status?order=${orderIdLocal}`;

        toast("Замовлення створено!", {
            description: "Ми вже працюємо над його відправкою 😊",
            action: {
                label: "Переглянути",
                onClick: () => window.open(orderUrl, "_blank"),
            },
        });

        cartStore.resetCartState();
        return;
    }

    toast.error(result.error || "Помилка при створенні замовлення");
}
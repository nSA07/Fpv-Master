import { CheckoutFormValues } from "@/app/checkout/page";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export async function submitCheckout(data: CheckoutFormValues, products: Product[], cartItems: CartItem[]) {
    const cartStore = useCartStore.getState();
    const orderIdLocal = cartStore.orderId; // Ваш локальний ID
    
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
            directusOrderId: directusOrderId
        }),
    });

    const result = await res.json();

    if (result.pageUrl) {
        window.location.href = result.pageUrl;
    } else {
        toast.error(result.error || "Помилка створення оплати");
    }
}
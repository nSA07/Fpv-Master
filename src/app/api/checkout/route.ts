
import { createOrder, updateOrder } from "@/lib/directus";
import { buildMonoPayload } from "@/lib/mono";
import { createMonoInvoice } from "@/lib/mono";

export async function POST(req: Request) {

    try {
        const body = await req.json();
        const {
            customer,
            products,
            cartItems,
            orderId,
            directusOrderId,
            paymentMethod
        } = body;
        
        let directusIdToUse = directusOrderId; 
        let directusRes;
        
        const orderData: OrderPayload = {
            local_order_id: orderId, // Ваш локальний ID
            customer_name: `${customer.lastName} ${customer.firstName} ${customer.middleName}`,
            email: customer.email,
            phone: customer.phone,
            comment: customer.comment,
            city: customer.city.label,
            city_ref: customer.city.ref,
            warehouse: customer.warehouse.label,
            warehouse_ref: customer.warehouse.ref,
            products: cartItems.map((i: any) => {
                const product = products.find((p: { id: string; }) => p.id === i.id);
                return {
                    id: product?.id,
                    sku: product?.sku,
                    name: product?.name,
                    quantity: i.quantity,
                    price: product?.price,
                    subtotal: product ? product.price * i.quantity : 0,
                };
            }),
            payment_status:  paymentMethod === "cod"
                ? "pay_on_delivery"
                : "pending",
            shipping_status: "not_shipped",
        };
        
        if (directusOrderId) {
            // ОНОВЛЕННЯ (якщо Directus ID вже існує)
            // Примітка: Ви можете передавати оновлені дані напряму без updateOrder, використовуючи fetch з методом PATCH
            directusRes = await updateOrder(directusOrderId, orderData); // Або ваш PATCH-запит
        } else {
            directusRes = await createOrder(orderData); // Ваш існуючий код
            
            directusIdToUse = directusRes.data.id;
        }

        if (!directusRes || directusRes.errors) {
            return new Response(JSON.stringify({ error: `Directus error...` }), { status: 500 });
        }
        
        if (paymentMethod === "mono") {
            const payload = buildMonoPayload(products, cartItems, directusIdToUse);
            const monoData = await createMonoInvoice(payload);

            return new Response(JSON.stringify({ pageUrl: monoData.pageUrl }));
        }

        if (paymentMethod === "cod") {
            return new Response(JSON.stringify({ success: true }));
        }

    } catch (err) {
        console.error("Checkout error:", err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
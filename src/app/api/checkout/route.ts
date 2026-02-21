import { Resend } from "resend";
import { createOrder, getAdminEmails, updateOrder } from "@/lib/directus";
import { generateAdminOrderEmail } from "@/lib/email-templates";
import { buildMonoPayload } from "@/lib/mono";
import { createMonoInvoice } from "@/lib/mono";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

const resend = new Resend(RESEND_API_KEY);

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
        
        let paymentStatus: "pending" | "paid" | "failed" | "pay_on_delivery" | "awaiting_invoice_payment" = "pending";
        if (paymentMethod === "cod") {
            paymentStatus = "pay_on_delivery";
        } else if (paymentMethod === "invoice") {
            paymentStatus = "awaiting_invoice_payment";
        }

        const orderData: OrderPayload = {
            local_order_id: orderId,
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
                    image_id: product.images || null,
                };
            }),
            payment_status: paymentStatus,
            shipping_status: "not_shipped",
        };
        
        if (directusOrderId) {
        } else {
            directusRes = await createOrder(orderData);
            
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
        if (paymentMethod === "cod" || paymentMethod === "invoice") {
            try {
                const adminEmails = await getAdminEmails();
                
                if (adminEmails && adminEmails.length > 0) {
                    const subjectEmoji = paymentMethod === "invoice" ? "📄 РАХУНОК" : "📦 НАКЛАДЕНИЙ";
                    
                    await resend.emails.send({
                        from: 'FpvMaster <support@info.fpvmaster.com.ua>',
                        to: adminEmails,
                        subject: `${subjectEmoji} №${orderId}`,
                        html: generateAdminOrderEmail(
                            { 
                                ...orderData, 
                                first_name: customer.firstName, 
                                last_name: customer.lastName,
                                payment_method_label: paymentMethod === "invoice" ? "Оплата на рахунок" : "Накладений платіж"
                            }, 
                            orderData.products, 
                            process.env.DIRECTUS_URL!
                        ),
                    });
                }
            } catch (emailErr) {
                console.error("Admin Email Error:", emailErr);
            }

            return new Response(JSON.stringify({ success: true }));
        }

    } catch (err) {
        console.error("Checkout error:", err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
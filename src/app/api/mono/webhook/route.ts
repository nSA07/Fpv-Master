import { getAdminEmails } from "@/lib/directus";
import { generateAdminOrderEmail, generateOrderConfirmationEmail } from "@/lib/email-templates";
import { verifyMonoBankSignature } from "@/lib/mono";
import { handleStockUpdate } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const DIRECTUS_URL = process.env.DIRECTUS_URL!; 
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!; 
const CLIENT_ORDER_URL_BASE = process.env.CLIENT_ORDER_URL_BASE!;
const MONOBANK_PUBKEY = process.env.MONOBANK_PUBKEY!;

const resend = new Resend(RESEND_API_KEY);


export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const xSignBase64 = req.headers.get("x-sign");
    
    if (!xSignBase64) {
        console.error("Заголовок X-Sign відсутній. Ймовірна атака або невірне налаштування MonoBank.");
        return NextResponse.json({ error: "Missing X-Sign header" }, { status: 403 }); // Заборонено
    }
    if (!MONOBANK_PUBKEY) {
        console.error("Змінна оточення MONOBANK_PUBKEY не встановлена.");
        return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }
    const isSignatureValid = verifyMonoBankSignature(xSignBase64, rawBody, MONOBANK_PUBKEY);

    if (!isSignatureValid) {
        console.error("Верифікація підпису MonoBank не пройшла. Потенційна підробка запиту.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    let webhookData: any;
    try {
        webhookData = JSON.parse(rawBody);
    } catch (e) {
        console.error("Неможливо розпарсити тіло вебхука як JSON:", e);
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    try {
        if (!webhookData.reference) {
            return NextResponse.json({ error: "Missing reference" }, { status: 400 });
        }
        
        const directusOrderId = webhookData.reference; 
        const newStatus = webhookData.status === "success" ? "paid" : "failed";

        const updateRes = await fetch(`${DIRECTUS_URL}/items/orders/${directusOrderId}?fields=local_order_id,email,products`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${DIRECTUS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payment_status: newStatus,
            }),
        });
        
        if (!updateRes.ok) {
            const errorText = await updateRes.text();
            console.error(`Directus PATCH failed for ID ${directusOrderId}:`, errorText);
            return NextResponse.json({ error: "Directus update failed" }, { status: updateRes.status });
        }
        
        const directusResponse = await updateRes.json();
        const { local_order_id: localOrderId, email: customerEmail, products } = directusResponse.data;


        if (newStatus === "paid") {
            
            await handleStockUpdate(products, DIRECTUS_URL, DIRECTUS_TOKEN, directusOrderId);

            const totalSumInBaseUnits = (products || []).reduce((total: any, product: { subtotal: any; }) => {
                if (typeof product.subtotal === 'number') {
                    return total + product.subtotal;
                }
                return total;
            }, 0);
            const amount = `${totalSumInBaseUnits.toFixed(2)} UAH`;
            const orderUrl = `${CLIENT_ORDER_URL_BASE}?order=${localOrderId}`;
            
            try {
                const { data, error } = await resend.emails.send({
                    from: 'support@info.fpvmaster.com.ua',
                    to: [customerEmail],
                    subject: `✅ Замовлення №${localOrderId} успішно оплачено!`,
                    html: generateOrderConfirmationEmail({ 
                        localOrderId, 
                        amount, 
                        orderUrl
                    }),
                });

                const adminEmails = await getAdminEmails();
                if (adminEmails.length > 0) {
                    await resend.emails.send({
                        from: 'system@info.fpvmaster.com.ua',
                        to: adminEmails,
                        subject: `🚀 Нове замовлення №${directusOrderId}`,
                        html: generateAdminOrderEmail(orderUrl, products, process.env.DIRECTUS_URL!)
                    });
                }

                if (error) {
                    console.error("Resend error:", error);
                } else {
                    console.log("Email успішно відправлено:", data);
                }
            } catch (emailError) {
                console.error("Critical Resend error:", emailError);
            }
        }
        
        return NextResponse.json({ 
            message: "Webhook processed successfully", 
            local_order_id: localOrderId,
            newStatus,
        }, { status: 200 });

    } catch (err) {
        console.error("Webhook processing error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const DIRECTUS_URL = process.env.DIRECTUS_URL!; 
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!; 
const CLIENT_ORDER_URL_BASE = process.env.CLIENT_ORDER_URL_BASE!;

// Ініціалізація Resend
const resend = new Resend(RESEND_API_KEY);

/**
 * Оновлює сток товарів у Directus, віднімаючи куплену кількість.
 *
 * @param products - Масив товарів, які містять `sku` та `quantity`.
 * @param directusUrl - URL Directus.
 * @param directusToken - Токен доступу Directus.
 * @param directusOrderId - ID замовлення для логування.
 */
async function handleStockUpdate(products: any[], directusUrl: string, directusToken: string, directusOrderId: string) {
    if (!products || products.length === 0) {
        console.log(`Замовлення ${directusOrderId}: Товари для оновлення стоку не знайдено.`);
        return;
    }

    // Ітеруємо по кожному придбаному товару в замовленні
    for (const item of products) {
        const productSku = item.sku;
        const purchasedQuantity = item.quantity;
        
        // 1. Перевірка на наявність SKU та кількості
        if (!productSku || typeof purchasedQuantity !== 'number' || purchasedQuantity <= 0) {
            console.error(`Помилка: Пропущено SKU або кількість для елемента замовлення в замовленні ${directusOrderId}.`);
            continue; 
        }

        let productId: string;
        let currentStock: number;

        try {
            // 2. Виконуємо GET-запит, щоб знайти товар за SKU та отримати його поточний сток
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

            // 3. Розрахунок нового стоку
            const newStock = currentStock - purchasedQuantity;
            
            if (newStock < 0) {
                console.warn(`Увага: Стік продукту ${productId} (SKU: ${productSku}) став від'ємним (${newStock}) після замовлення ${directusOrderId}.`);
            }

            // 4. Виконуємо PATCH-запит до колекції `products` для оновлення стоку
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
// ------------------------------------------------------------------


export async function POST(req: NextRequest) {
    // Деструктуризація для логування, щоб не втратити жодних даних вебхука
    const webhookData = await req.json();

    try {
        if (!webhookData.reference) {
            // Вебхук повинен повертати 400, якщо основні дані відсутні
            return NextResponse.json({ error: "Missing reference" }, { status: 400 });
        }
        console.log(webhookData);
        
        const directusOrderId = webhookData.reference; 
        const newStatus = webhookData.status === "success" ? "paid" : "failed";

        // *Обов'язково додайте параметр `fields` до цього запиту, 
        // щоб отримати деталі товарів (`products`) із поточним стоком, 
        // наприклад, `?fields=local_order_id,email,products.*,products.product_id.id,products.product_id.stock`
        // Це критично для коректної роботи логіки оновлення стоку, яка йде далі!
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
            // Повертаємо помилку для Monobank
            return NextResponse.json({ error: "Directus update failed" }, { status: updateRes.status });
        }
        
        const directusResponse = await updateRes.json();
        // В directusResponse.data тепер мають бути всі необхідні поля, включаючи продукти
        const { local_order_id: localOrderId, email: customerEmail, products } = directusResponse.data;


        if (newStatus === "paid") {
            
            await handleStockUpdate(products, DIRECTUS_URL, DIRECTUS_TOKEN, directusOrderId);

            // Крок 2. Відправка листа (існуюча логіка)
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
        }, { status: 200 }); // Важливо: повертаємо 200 OK

    } catch (err) {
        console.error("Webhook processing error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// ------------------------------------------------------------------
// Функція-шаблон для генерації простого HTML-листа з інлайн-стилями
// ------------------------------------------------------------------
interface EmailProps {
    localOrderId: string;
    amount: string;
    orderUrl: string;
}

function generateOrderConfirmationEmail({ localOrderId, amount, orderUrl }: EmailProps): string {
    return `
        <!DOCTYPE html>
        <html lang="uk">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Підтвердження оплати</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;">
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                
                                <tr>
                                    <td align="center" style="background-color: #171717; padding: 20px; border-radius: 8px 8px 0 0;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Замовлення успішно оплачено!</h1>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 30px;">
                                        <p style="margin-top: 0; font-size: 16px;">Шановний клієнте,</p>
                                        <p style="font-size: 16px;">Дякуємо, що обрали нас! Ваш платіж за замовлення **№${localOrderId}** успішно надійшов.</p>

                                        <table width="100%" border="0" cellspacing="0" cellpadding="10" style="margin: 20px 0; border: 1px solid #eeeeee; border-radius: 6px; background-color: #f9f9f9;">
                                            <tr>
                                                <td style="font-size: 16px;"><strong>Номер замовлення:</strong></td>
                                                <td style="font-size: 16px; text-align: right;">${localOrderId}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 16px;"><strong>Статус оплати:</strong></td>
                                                <td style="font-size: 16px; text-align: right; color: #171717;">Успішно оплачено</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 16px; border-top: 1px solid #eeeeee;"><strong>Загальна сума:</strong></td>
                                                <td style="font-size: 18px; font-weight: bold; text-align: right; border-top: 1px solid #eeeeee;">${amount}</td>
                                            </tr>
                                        </table>
                                        
                                        <p style="font-size: 16px;">Ви можете відслідковувати статус Вашого замовлення (обробка, відправка тощо) за цим посиланням:</p>

                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="${orderUrl}" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #171717; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                                        Переглянути замовлення
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding: 20px 30px; border-top: 1px solid #dddddd;">
                                        <p style="margin: 0; font-size: 12px; color: #777777;">
                                            Це автоматичне повідомлення. Будь ласка, не відповідайте на нього.<br>
                                            &copy; ${new Date().getFullYear()} Fpv Master.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}
import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "https://your-directus-instance.com";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;

// Формат номера замовлення: ORD-YYYY-NNNN
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  // Можна запитати останній order_number у Directus і інкрементувати
  // Для простоти: використовуємо timestamp
  const timestamp = Date.now() % 10000; // останні 4 цифри
  return `ORD-${year}-${timestamp.toString().padStart(4, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Перевіряємо статус оплати
    if (data.status !== "success") {
      return NextResponse.json({ message: "Payment not successful, ignored" }, { status: 200 });
    }

    const { reference, amount, customerInfo, items, invoiceId } = data;

    // Очікуємо customerInfo: { full_name, phone, email, comment }
    // items: [{ id, name, price, qty, sku, image }]
    if (!customerInfo || !items || !items.length) {
      return NextResponse.json({ error: "Missing customer or items info" }, { status: 400 });
    }

    // 1️⃣ Створюємо покупця
    const customerRes = await fetch(`${DIRECTUS_URL}/items/order_customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: customerInfo.full_name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        comment: customerInfo.comment || "",
      }),
    });

    const customerData = await customerRes.json();
    const customerId = customerData.data.id;

    // 2️⃣ Створюємо номер замовлення
    const orderNumber = await generateOrderNumber();

    // 3️⃣ Створюємо замовлення
    const orderRes = await fetch(`${DIRECTUS_URL}/items/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_number: orderNumber,
        mono_invoice_id: invoiceId,
        mono_reference: reference,
        total_amount: amount,
        currency: "UAH",
        customer: customerId,
        payment_status: "paid",
      }),
    });

    const orderData = await orderRes.json();
    const orderId = orderData.data.id;

    // 4️⃣ Додаємо товари в order_items
    for (const item of items) {
      await fetch(`${DIRECTUS_URL}/items/order_items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: orderId,
          product: item.id || null,
          name: item.name,
          price: item.price,
          qty: item.qty,
          sku: item.sku || null,
          image: item.image || null,
        }),
      });
    }

    return NextResponse.json({ message: "Order created successfully" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

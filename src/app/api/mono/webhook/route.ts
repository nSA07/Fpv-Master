import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL!;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const orderId = data.reference; 

    // Якщо оплата неуспішна — позначаємо як failed
    const newStatus = data.status === "success" ? "paid" : "failed";

    // Оновлюємо замовлення
    await fetch(`${DIRECTUS_URL}/items/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_status: newStatus,
      }),
    });

    return NextResponse.json({ message: "Order updated", orderId, newStatus });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

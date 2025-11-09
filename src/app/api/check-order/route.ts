import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const API_TOKEN = process.env.DIRECTUS_TOKEN;

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const res = await fetch(
      `${API_URL}/items/orders?filter[local_order_id][_eq]=${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ exists: false });
    }

    const order = data.data[0];

    return NextResponse.json({
      exists: true,
      orderIdDirectus: order.id,
      payment_status: order.payment_status,
      shipping_status: order.shipping_status,
      total: order.total,
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

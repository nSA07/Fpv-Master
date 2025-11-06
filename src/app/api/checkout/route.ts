import { NextResponse } from "next/server";
import { buildMonoPayload } from "@/lib/mono";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { products, cartItems }
    const payload = buildMonoPayload(body.products, body.cartItems);

    const res = await fetch("https://api.monobank.ua/api/merchant/invoice/create", {
      method: "POST",
      headers: {
        "X-Token": process.env.MONO_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Mono API error:", error);
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({ pageUrl: data.pageUrl });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

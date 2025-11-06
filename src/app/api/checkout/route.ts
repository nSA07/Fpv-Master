import { buildMonoPayload } from "@/lib/mono";

export async function POST(req: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Token",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    const body = await req.json();
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
      return new Response(JSON.stringify({ error }), { status: res.status, headers });
    }

    const data = await res.json();
    return new Response(JSON.stringify({ pageUrl: data.pageUrl }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers });
  }
}

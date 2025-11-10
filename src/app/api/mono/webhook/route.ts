import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL!; 
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.reference) {
            return NextResponse.json({ error: "Missing reference" }, { status: 400 });
        }
        console.log(data);
        
        const directusOrderId = data.reference; 
        const newStatus = data.status === "success" ? "paid" : "failed";
        const updateRes = await fetch(`${DIRECTUS_URL}/items/orders/${directusOrderId}`, {
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

        return NextResponse.json({ message: "Order updated", directusOrderId, newStatus });

    } catch (err) {
        console.error("Webhook error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
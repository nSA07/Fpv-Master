// app/api/search/route.ts
import { searchProducts } from "@/lib/directus";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) return NextResponse.json([]);

    const data = await searchProducts(q);
    const results = Array.isArray(data) ? data : (data as any)?.data || [];

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("SEARCH_ROUTE_ERROR:", error.message);
    return NextResponse.json([], { status: 200 });
  }
}
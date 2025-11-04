import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const API_TOKEN = process.env.DIRECTUS_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json(); // отримуємо масив ID від клієнта

    if (!ids || !ids.length) {
      return NextResponse.json([], { status: 200 });
    }

    const query = ids.join(",");

    const res = await fetch(
      `${API_URL}/items/products?filter[id][_in]=${query}&fields=id,name,description,price,sku,brand,stock,images.directus_files_id`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Помилка отримання товарів" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data.data);
  } catch (error) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

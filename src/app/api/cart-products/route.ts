import { fetchHProfitStock } from "@/lib/h-profit-stock";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const API_TOKEN = process.env.DIRECTUS_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!ids || !ids.length) {
      return NextResponse.json([], { status: 200 });
    }

    const query = ids.join(",");

    const [res, hProfitData] = await Promise.all([
      fetch(
        `${API_URL}/items/products?filter[id][_in]=${query}&fields=id,name,description,price,sku,brand,stock,images.directus_files_id`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
          cache: "no-store",
        }
      ),
      fetchHProfitStock()
    ]);

    if (!res.ok) {
      return NextResponse.json({ error: "Помилка отримання товарів з Directus" }, { status: 500 });
    }

    const directusData = await res.json();
    const products = directusData.data || [];

    const hpMap = new Map();
    hProfitData.forEach((item: any) => {
      hpMap.set(item.sku, item);
    });

    const mergedProducts = products.map((product: any) => {
      const hpItem = hpMap.get(product.sku);      
      return {
        ...product,
        stock: hpItem?.stock?.[0]?.quantity ?? product.stock,
        huge_profit_id: hpItem?.id || null
      };
    });

    return NextResponse.json(mergedProducts);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
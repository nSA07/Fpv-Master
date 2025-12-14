import { getProducts } from "@/lib/directus";
import { NextResponse } from "next/server";

/**
 * Захист від поламаного XML
 */
function escapeXml(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Мапінг внутрішніх категорій → Google Product Category
 * (можеш розширювати)
 */
function mapGoogleCategory(category?: string | null): string {
  if (!category) return "Hardware > Tools";

  const c = category.toLowerCase();

  if (c.includes("викрут")) return "Hardware > Tools > Screwdrivers";
  if (c.includes("дрил") || c.includes("шуруп")) {
    return "Hardware > Tools > Drills";
  }
  if (c.includes("акумул")) {
    return "Hardware > Tools > Power Tools";
  }

  return "Hardware > Tools";
}

export async function GET() {
  try {
    const products: Product[] = await getProducts();

    const items = products
      // ❗ Google не прийме товар без ціни або зображення
      .filter(
        (p) =>
          p.price &&
          p.images?.length &&
          p.slug &&
          p.subcategories?.category?.slug
      )
      .map((p) => {
        const price = Number(p.price).toFixed(2);
        const categoryName = p.subcategories?.category?.name ?? "Інше";

        return `
<item>
  <g:id>${p.id}</g:id>

  <g:title><![CDATA[${p.name}]]></g:title>

  <g:description><![CDATA[${
    p.description && p.description.length > 20
      ? p.description
      : p.name
  }]]></g:description>

  <g:link>
    https://www.fpvmaster.com.ua/${p.subcategories.category.slug}/${p.slug}
  </g:link>

  <g:image_link>
    https://www.fpvmaster.com.ua/api/assets/${p.images[0].directus_files_id.filename_disk}
  </g:image_link>

  <g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>

  <g:price>${price} UAH</g:price>

  <g:brand><![CDATA[${p.brand ?? "No brand"}]]></g:brand>

  <g:condition>new</g:condition>

  <g:google_product_category>
    ${mapGoogleCategory(categoryName)}
  </g:google_product_category>

  <g:product_type>
    ${escapeXml(categoryName)}
  </g:product_type>

  <g:mpn><![CDATA[${p.sku ?? p.id}]]></g:mpn>

  <g:identifier_exists>false</g:identifier_exists>

  <g:shipping>
    <g:country>UA</g:country>
    <g:service>Standard</g:service>
    <g:price>0 UAH</g:price>
  </g:shipping>
</item>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>Fpv Master</title>
  <link>https://www.fpvmaster.com.ua</link>
  <description>Google Merchant Center Product Feed</description>
  ${items}
</channel>
</rss>`;

    return new NextResponse(xml.trim(), {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Google Feed Error:", error);

    return new NextResponse("Google Feed Error", {
      status: 500,
    });
  }
}

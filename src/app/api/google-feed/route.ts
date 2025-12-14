// app/api/google-feed/route.ts
import { getProducts } from "@/lib/directus";
import { NextResponse } from "next/server";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const products: Product[] = await getProducts();

  const xmlItems = products
    .filter((p) => p.price && p.images?.length) // ❗ Google не любить пусті товари
    .map((p) => {
      const price = Number(p.price).toFixed(2);

      return `
      <item>
        <g:id>${p.id}</g:id>

        <g:title><![CDATA[${p.name}]]></g:title>

        <g:description><![CDATA[${
          p.description ?? p.name
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

        <!-- ✅ ТЕКСТОВА категорія -->
        <g:google_product_category>
          Hardware &gt; Tools &gt; Screwdrivers
        </g:google_product_category>

        <!-- ✅ ВНУТРІШНЯ категорія -->
        <g:product_type>
          ${escapeXml(p.subcategories.category.name)}
        </g:product_type>

        <g:mpn><![CDATA[${p.sku ?? p.id}]]></g:mpn>

        <!-- ✅ ЯВНО кажемо що GTIN нема -->
        <g:identifier_exists>false</g:identifier_exists>

        <!-- ✅ ОБОВʼЯЗКОВА доставка -->
        <g:shipping>
          <g:country>UA</g:country>
          <g:service>Standard</g:service>
          <g:price>0 UAH</g:price>
        </g:shipping>
      </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Fpv Master</title>
    <link>https://www.fpvmaster.com.ua</link>
    <description>Google Merchant XML Feed</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xml.trim(), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

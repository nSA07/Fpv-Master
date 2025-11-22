// app/api/google-feed/route.ts
import { getProducts } from "@/lib/directus";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await getProducts();

  const xmlItems = products
    .map((p) => `
      <item>
        <g:id>${p.id}</g:id>
        <g:title><![CDATA[${p.name}]]></g:title>
        <g:description><![CDATA[${p.description ?? ""}]]></g:description>
        <g:link>https://www.fpvmaster.com.ua/${p.subcategories.category.slug}/${p.slug}</g:link>
        <g:image_link>https://directus.fpvmaster.com.ua/assets/${p.images?.[0]?.directus_files_id}</g:image_link>
        <g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
        <g:price>${p.price} UAH</g:price>
        <g:brand><![CDATA[${p.brand ?? ""}]]></g:brand>
        <g:condition>new</g:condition>
        <g:google_product_category>282</g:google_product_category>
        <g:mpn><![CDATA[${p.sku ?? p.id}]]></g:mpn>
      </item>
    `)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
      <title>Fpv Master</title>
      <link>https://www.fpvmaster.com.ua</link>
      <description>XML Feed</description>
      ${xmlItems}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

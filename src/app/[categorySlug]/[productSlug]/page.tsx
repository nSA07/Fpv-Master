import type { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { RelatedProductsCarousel } from "@/components/product/related-products-carousel";
import { getOneProduct, getProductsByCategorySlug } from "@/lib/directus";

export async function generateMetadata({ params }: { params: { productSlug: string; categorySlug: string } }): Promise<Metadata> {
  const { productSlug } = await params;
  const { categorySlug } = await params;
  const product: Product = await getOneProduct(productSlug);

  if (!product) {
    return {
      title: "Товар не знайдено | FPVmaster",
      description: "На жаль, товар не знайдено або більше не доступний.",
    };
  }

  const baseUrl = "https://fpvmaster.com.ua";
  const productUrl = `${baseUrl}/${categorySlug}/${product.slug}`;

  // Title
  const hasDiscount = product.price_old && product.price < product.price_old;
  const title = hasDiscount
    ? `${product.name} — зі знижкою, купити за ${product.price} грн | FPVmaster`
    : `${product.name} — купити за ${product.price} грн | FPVmaster`;

  // Description (обрізаємо до 160 символів)
  const description = product.description
    ? product.description.replace(/\s+/g, " ").slice(0, 160) + "..."
    : `Купити ${product.name} у магазині FPVmaster. Доставка по Україні.`;

  // OG / Twitter image
  const image = product.images?.length
    ? `${process.env.NEXT_PUBLIC_ASSETS_URL || baseUrl}/assets/${product.images[0].directus_files_id}`
    : `${baseUrl}/og-default.jpg`;

  // Availability
  const inStock = product.stock && product.stock > 0;
  const availability = inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  // ✅ Product Schema (JSON-LD)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [image],
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    manufacturer: {
      "@type": "Organization",
      name: product.producer || "FPVmaster",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "UAH",
      price: product.price,
      availability,
    },
  };

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: "website",
      url: productUrl,
      title,
      description,
      images: [{ url: image }],
      siteName: "FPVmaster",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    other: {
      "script:ld+json": JSON.stringify(productSchema),
    },
  };
}

export default async function Page({ params }: { params: { categorySlug: string, productSlug: string } }) {
  const { productSlug } = await params;
  const product: Product = await getOneProduct(productSlug);
  const productBySlug = await getProductsByCategorySlug(product.subcategories.category.slug);
  const filteredProduct = productBySlug
    ? productBySlug.filter((p: { id: string; }) => p.id !== productSlug)
    : productBySlug;
  const isInactive =
    !product.active ||
    !product.subcategories?.active ||
    !product.subcategories?.category?.active;
  if (!product) {
    return (
      <div className="container-wrapper">
        <p>Товар не знайдено</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-9">
      <div className="grid grid-cols-12 gap-6 xl:gap-8 xl:mb-8 items-start">
        <div className={`
            col-span-12 
            md:col-span-8 md:col-start-3 
            lg:col-span-6 lg:col-start-auto 
            flex flex-col 
            mb-6 md:mb-8 lg:mb-0
            ${isInactive ? "opacity-50 grayscale pointer-events-none" : ""}
          `}
        >
          <ProductGallery
            images={product.images.map((img) => img.directus_files_id)}
            name={product.name}
          />
        </div>

        <div className="
          col-span-12 
          lg:col-span-6 
          flex flex-col 
          gap-4 
          bg-white/50 
          p-4 
          rounded-xl"
        >
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">{product.name}</h1>

          <p className="text-gray-500 text-sm sm:text-base">
            Бренд: {product.brand || "Без бренду"}
          </p>
          {product.producer && (
            <p className="text-gray-500 text-sm sm:text-base">Виробник: {product.producer}</p>
          )}

          <p
            className={`text-sm sm:text-base font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0 ? "Є в наявності" : "Немає в наявності"}
          </p>

          <QuantitySelector product={product} disabled={isInactive} />

          <div className="p-3 sm:p-4 rounded-lg bg-gray-50 text-sm flex flex-col gap-3 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">Оплата</h3>
              <p>
                Оплата під час отримання товару — готівкова, безготівкова або банківською карткою
                (VISA / Mastercard).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Гарантія</h3>
              <p>Обмін або повернення товару впродовж 14 днів.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-12 pb-8">
        <div className="col-span-12 space-y-6 mx-auto w-full">
          {product.description ? (
            <div className="bg-white rounded-lg p-6">
              <div className="grid gap-3 md:gap-6 grid-cols-12">
                <h2 className="text-xl font-semibold col-span-12 md:col-span-4">Опис</h2>
                <p className="text-gray-700 leading-relaxed col-span-12 md:col-span-8">
                  {product.description}
                </p>
              </div>
            </div>
          ) : null}

          {product.features && Array.isArray(product.features) && product.features.length > 0 ? (
            <div className="bg-white rounded-lg grid gap-3 md:gap-6 grid-cols-12 p-6">
              <h2 className="text-xl font-semibold mb-3 col-span-12 md:col-span-4">Особливості</h2>
              <ul className="divide-y divide-gray-200 col-span-12 md:col-span-8">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="py-2">
                    <span className="font-medium text-gray-800">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.product_attributes && Array.isArray(product.product_attributes) && product.product_attributes.length > 0 ? (
            <div className="bg-white rounded-lg grid gap-3 md:gap-6 grid-cols-12 p-6">
              <h2 className="text-xl font-semibold col-span-12 md:col-span-4 mb-4">Характеристики</h2>
              <ul className="divide-y divide-gray-200 col-span-12 md:col-span-8">
                {product.product_attributes.map((attr) => (
                  <li key={attr.id} className="py-2 grid grid-cols-12">
                    <span className="col-span-4 font-medium text-gray-800">{attr.name}</span>
                    <span className="col-span-8 pl-3 text-end  text-gray-600">{attr.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.equipment && Array.isArray(product.equipment) && product.equipment.length > 0 ? (
            <div className="bg-white rounded-lg grid gap-3 md:gap-6 grid-cols-12 p-6">
              <h2 className="text-xl font-semibold mb-3 col-span-12 md:col-span-4">Комплектація</h2>
              <ul className="divide-y divide-gray-200 col-span-12 md:col-span-8">
                {product.equipment.map((equip, idx) => (
                  <li key={idx} className="py-2">
                    <span className="font-medium text-gray-800">{equip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          
          <RelatedProductsCarousel products={filteredProduct}/>

          {!product.description &&
            (!product.features || product.features.length === 0) &&
            (!product.product_attributes || product.product_attributes.length === 0) &&
            (!product.equipment || product.equipment.length === 0) && (
              <div className="rounded-lg p-6 text-center text-gray-500 bg-white">
                Інформація про товар тимчасово відсутня
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "../ui/button";
import { PriceMiniDisplay } from "./price-display";


export const ProductCard = ({ product }: { product: Product }) => {
  
  return (
    <div className="flex h-full flex-col w-full mx-auto bg-white rounded-lg p-4">
      <div className="flex items-center justify-center mb-4 h-76 w-full rounded-lg overflow-hidden">
        {product.images?.length > 0 ? (
          <Link href={`/${product.subcategories.category.slug}/${product.slug}`} className="w-full h-full">
            <img
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${product.images[0].directus_files_id}`}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </Link>
        ) : (
          <span className="text-gray-400">Немає фото</span>
        )}
      </div>
      <div className="flex flex-col mb-3">
        <Tooltip>
          <TooltipTrigger className="hover:underline uppercase text-md font-semibold truncate text-start">
            <Link href={`/${product.subcategories.category.slug}/${product.slug}`}>
              {product.name}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">
            {product.name}
          </TooltipContent>
        </Tooltip>
        <span className="text-sm text-gray-500 truncate">{product.brand ? product.brand : "Без бренду"}</span>
      </div>
      <div className="flex justify-between items-center mt-auto">
        <Button asChild className="cursor-pointer w-fit">
          <Link href={`/${product.subcategories.category.slug}/${product.slug}`}>
            Придбати
          </Link>
        </Button>
        <PriceMiniDisplay price={product.price} price_old={product.price_old} />
      </div>
      {/* <QuantitySelector price={product.price} /> */}
    </div>
  );
};

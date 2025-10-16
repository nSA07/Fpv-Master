"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

type RelatedProductsCarouselProps = {
  products: Product[];
}

export const RelatedProductsCarousel = ({ products }: RelatedProductsCarouselProps) => {
  if (!products || products.length === 0) return null

  return (
    <div className="w-full mt-10">
      <h2 className="text-2xl font-semibold mb-6">Схожі товари</h2>

      {/* робимо контейнер відносним */}
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((p) => (
              <CarouselItem
                key={p.id}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Link
                  href={`/${p.subcategories?.category}/${p.id}`}
                  className="focus:outline-none h-full block"
                >
                  <div className="bg-white rounded-lg overflow-hidden transition p-3 h-full flex flex-col">
                    {/* Картинка */}
                    <div className="aspect-square flex items-center justify-center rounded-md mb-3">
                      {p.images ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${p.images[0]?.directus_files_id}`}
                          alt={p.name}
                          className="object-contain h-full w-full"
                        />
                      ) : (
                        <div className="text-gray-400">Без фото</div>
                      )}
                    </div>

                    {/* Назва з тултіпом */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2 cursor-help">
                            {p.name}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{p.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Ціна */}
                    <p className="mt-auto text-lg font-semibold text-gray-800">
                      {p.price} грн
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Стрілки всередині контейнера */}
          <CarouselPrevious className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto" />
          <CarouselNext className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto" />
        </Carousel>
      </div>
    </div>
  )
}
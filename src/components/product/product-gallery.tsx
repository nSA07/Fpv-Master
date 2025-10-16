"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [selected, setSelected] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // 🌀 Коли натискаємо превʼю — міняємо активний слайд
  useEffect(() => {
    if (api) {
      api.scrollTo(selected);
    }
  }, [selected, api]);

  // 🌀 Коли свайпаємо або клікаємо стрілки — міняється активне превʼю
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelected(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4">
      {/* 🔹 Превʼюшки зліва (desktop) */}
      <div className="hidden p-1 md:flex scrollb flex-col gap-3 overflow-y-auto max-h-full">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`rounded-md overflow-hidden cursor-pointer w-20 h-20 bg-white flex-shrink-0 border transition-all ${
              selected === idx ? "border-gray-500 scale-105" : "border-transparent"
            }`}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${img}`}
              alt={`${name}-thumb-${idx}`}
              className="object-contain w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* 🔸 Основне фото з каруселлю */}
      <div className="relative flex-1 bg-white rounded-lg overflow-hidden">
        <Carousel
          className="w-full h-[400px] md:h-[420px] lg:h-[470px]"
          opts={{ loop: true }}
          setApi={setApi} // <-- тут отримуємо api
        >
          <CarouselContent>
            {images.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="flex justify-center items-center w-full  h-[400px] md:h-[420px] lg:h-[470px]">
                  <img
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${img}`}
                    alt={`${name}-${idx}`}
                    className="object-contain w-full h-full transition-transform duration-300"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Стрілки тільки на desktop */}
          <div className="hidden lg:flex absolute inset-0 justify-between items-center px-2">
            <CarouselPrevious className="static bg-white/70 hover:bg-white rounded-full shadow-md" />
            <CarouselNext className="static bg-white/70 hover:bg-white rounded-full shadow-md" />
          </div>
        </Carousel>
      </div>

      {/* 📱 Превʼюшки знизу (mobile) */}
      <div className="flex md:hidden justify-center gap-2 mt-3 w-full p-1 overflow-x-auto">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`rounded-md overflow-hidden cursor-pointer w-16 h-16 border transition-all ${
              selected === idx ? "border-gray-500 scale-105" : "border-transparent"
            }`}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${img}`}
              alt={`${name}-mobile-thumb-${idx}`}
              className="object-contain w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
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
      <div className="hidden md:flex scrollbar-hide flex-col gap-3 overflow-y-auto h-[400px] md:h-[420px] lg:h-[470px]">
        <Carousel
          opts={{ loop: true }}
          orientation="vertical"
        >
          <CarouselContent>
            {images.map((img, idx) => (
              <CarouselItem key={idx}>
                <button
                  onClick={() => setSelected(idx)}
                  className={`rounded-md m-1 overflow-hidden cursor-pointer w-22 h-22 flex-shrink-0 border transition-all ${
                    selected === idx ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${img}`}
                    alt={`${name}-thumb-${idx}`}
                    className="object-contain w-full h-full"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* 🔸 Основне фото з каруселлю */}
      <div className="relative flex-1 rounded-lg overflow-hidden">
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
      <div className="md:hidden flex scrollbar-hide flex-col gap-3 overflow-y-auto ">
        <Carousel
          opts={{ loop: true, align: "start" }}
        >
          <CarouselContent>
            {images.map((img, idx) => (
              <CarouselItem key={idx} className="basis-auto w-auto">
                <button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  className={`rounded-md m-1 overflow-hidden cursor-pointer w-16 h-16 border transition-all ${
                    selected === idx ? "border-black scale-105" : "border-gray-500"
                  }`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${img}`}
                    alt={`${name}-mobile-thumb-${idx}`}
                    className="object-contain w-full h-full"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
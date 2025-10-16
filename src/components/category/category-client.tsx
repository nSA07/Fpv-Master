"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Filters, FiltersState } from "@/components/category/filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SlidersHorizontal } from "lucide-react";

interface CategoryClientProps {
  category: { id: string; name: string };
  products: Product[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  category,
  products,
}) => {
  const [filters, setFilters] = useState<FiltersState>({
    subcategories: [],
    brands: [],
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Фільтрація клієнтська
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        filters.subcategories.length > 0 &&
        !filters.subcategories.includes(p.subcategories.id)
      )
        return false;
      if (
        filters.brands.length > 0 &&
        (!p.brand || !filters.brands.includes(p.brand))
      )
        return false;
      if (filters.priceMin !== undefined && p.price < filters.priceMin)
        return false;
      if (filters.priceMax !== undefined && p.price > filters.priceMax)
        return false;
      if (filters.inStock && p.stock <= 0) return false;
      return true;
    });
  }, [products, filters]);

  return (
    <section className="mb-10">
      {/* Заголовок і кнопка фільтрів */}
      <div className="flex justify-between items-center py-4 sm:py-6 md:py-8 relative">
        <h2 className="text-xl/tight md:text-2xl/tight font-bold uppercase">
          {category.name}
        </h2>

        {/* Кнопка "Фільтри" тільки для мобільних */}
        <div className="block md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <SlidersHorizontal size={18} />
                Фільтри
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:w-[80%] md:w-[50%]"
            >
              <VisuallyHidden>
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                </SheetHeader>
              </VisuallyHidden>

              <div className="mt-4 px-2">
                <Filters
                  products={products}
                  onFilterChange={setFilters}
                  filters={filters}
                  onClose={() => setIsSheetOpen(false)} // 🔹 передаємо колбек
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Контент сторінки */}
      <div className="grid grid-cols-12 gap-6">
        {/* Фільтри для desktop */}
        <div className="md:col-span-4 lg:col-span-3 hidden md:block">
          <Filters filters={filters} products={products} onFilterChange={setFilters} />
        </div>

        {/* Товари */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="grid grid-cols-12 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <ProductCard product={p} />
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="col-span-12 text-center text-gray-500">
                Товари не знайдено
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
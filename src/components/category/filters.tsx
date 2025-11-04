"use client";

import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";

interface FiltersProps {
  products: Product[];
  filters: FiltersState;
  onFilterChange?: (filters: FiltersState) => void;
  onClose?: () => void;
}

export interface FiltersState {
  subcategories: string[];
  brands: string[];
  priceMin?: number;
  priceMax?: number;
  stock?: ("in" | "out")[]; // Наявність товарів
}

export const Filters: React.FC<FiltersProps> = ({
  products,
  filters,
  onFilterChange,
  onClose,
}) => {
  // Унікальні підкатегорії
  const subcategories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (p.subcategories) {
        map.set(p.subcategories.id, p.subcategories.name);
      }
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [products]);

  // Діапазон цін
  const priceRange = useMemo(() => {
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  // Унікальні бренди
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand ?? "No Brand"));
    return Array.from(set);
  }, [products]);

  const handleCheckboxChange = (
    type: "subcategory" | "brand" | "stock",
    value: string,
    checked: boolean
  ) => {
    if (!onFilterChange) return;
    const updated = { ...filters };

    if (type === "subcategory") {
      updated.subcategories = checked
        ? [...filters.subcategories, value]
        : filters.subcategories.filter((v) => v !== value);
    }

    if (type === "brand") {
      updated.brands = checked
        ? [...filters.brands, value]
        : filters.brands.filter((v) => v !== value);
    }

    if (type === "stock") {
      const current = filters.stock ?? [];
      updated.stock = checked
        ? [...current, value as "in" | "out"]
        : current.filter((v) => v !== value);
    }

    onFilterChange(updated);
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    if (!onFilterChange) return;
    onFilterChange({
      ...filters,
      priceMin: type === "min" ? value : filters.priceMin,
      priceMax: type === "max" ? value : filters.priceMax,
    });
  };

  const hasActiveFilters =
    filters.subcategories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    (filters.stock && filters.stock.length > 0);

  // Логіка для чекбоксів Наявність
  const stockIn = products.some((p) => p.stock > 0);
  const stockOut = products.some((p) => p.stock <= 0);

  return (
    <aside className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto p-2">
      <h3 className="text-xl font-bold mb-2">Фільтри</h3>
      <Accordion type="multiple" className="space-y-2">
        {/* Підкатегорії */}
        <AccordionItem value="subcategory">
          <AccordionTrigger className="cursor-pointer">Підкатегорія</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1">
              {subcategories.map((sub) => (
                <li key={sub.id}>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      value={sub.id}
                      checked={filters.subcategories.includes(sub.id)}
                      onChange={(e) =>
                        handleCheckboxChange("subcategory", sub.id, e.target.checked)
                      }
                    />
                    {sub.name}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Ціна */}
        <AccordionItem value="price">
          <AccordionTrigger className="cursor-pointer">Ціна</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-center gap-2 text-sm">
              <input
                type="number"
                placeholder={`${priceRange.min}`}
                value={filters.priceMin ?? ""}
                className="w-20 border rounded px-2 py-1 text-sm bg-white"
                onChange={(e) => handlePriceChange("min", Number(e.target.value))}
              />
              <span>–</span>
              <input
                type="number"
                placeholder={`${priceRange.max}`}
                value={filters.priceMax ?? ""}
                className="w-20 border rounded px-2 py-1 text-sm bg-white"
                onChange={(e) => handlePriceChange("max", Number(e.target.value))}
              />
              <span>грн</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Бренди */}
        <AccordionItem value="brand">
          <AccordionTrigger className="cursor-pointer">Бренд</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1">
              {brands.map((brand) => (
                <li key={brand}>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      value={brand}
                      checked={filters.brands.includes(brand)}
                      onChange={(e) =>
                        handleCheckboxChange("brand", brand, e.target.checked)
                      }
                    />
                    {brand === "No Brand" ? "Без бренду" : brand}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Наявність */}
        <AccordionItem value="stock">
          <AccordionTrigger className="cursor-pointer">Наявність</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 text-sm">
              {stockIn && (
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.stock?.includes("in") ?? false}
                      onChange={(e) =>
                        handleCheckboxChange("stock", "in", e.target.checked)
                      }
                    />
                    Є в наявності
                  </label>
                </li>
              )}
              {stockOut && (
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.stock?.includes("out") ?? false}
                      onChange={(e) =>
                        handleCheckboxChange("stock", "out", e.target.checked)
                      }
                    />
                    Немає в наявності
                  </label>
                </li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Кнопка для мобільних */}
      <div className="mt-4 md:hidden">
        <Button
          disabled={!hasActiveFilters}
          className={`w-full py-2 px-4 rounded-md font-semibold transition ${
            hasActiveFilters
              ? "bg-black text-white hover:bg-black/80"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => {
            onFilterChange?.(filters);
            onClose?.();
          }}
        >
          Показати товари
        </Button>
      </div>
    </aside>
  );
};

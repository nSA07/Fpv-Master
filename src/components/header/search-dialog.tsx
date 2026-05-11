"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Очищення та закриття при переході
  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 items-center cursor-pointer text-muted-foreground hover:text-foreground hover:bg-white border-gray-200 w-full sm:w-auto justify-start sm:justify-center"
        >
          <Search size={18} />
          <span className="hidden sm:inline">пошук...</span>
          <span className="sm:hidden text-xs text-gray-400 font-normal">Пошук товарів...</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0 flex flex-col h-full max-h-[85vh] sm:h-auto">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <DialogTitle className="sr-only">Пошук товарів</DialogTitle>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              className="pl-10 border-none focus-visible:ring-0 text-base py-6"
              placeholder="Шукати за назвою або артикулом..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {isLoading && (
              <Loader2
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
                size={18}
              />
            )}
          </div>
          <DialogDescription className="hidden">
            Введіть назву або артикул товару для швидкого пошуку
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-2 flex flex-col gap-1">
            {results.length > 0 ? (
              results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={handleClose}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100/80 transition-all group focus:bg-gray-100 focus:outline-none"
                >
                  {/* Контейнер для фото (якщо є в API) */}
                  <div className="w-12 h-12 bg-gray-50 rounded border flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                    {product.images?.[0]?.directus_files_id?.filename_disk ? (
                      <Image
                         src={`/api/assets/${product.images[0].directus_files_id.filename_disk}?width=48&height=48`}
                         alt={product.name}
                         fill
                         className="object-contain"
                      />
                    ) : (
                      <Search size={16} className="text-gray-300" />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {product.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      SKU: {product.sku}
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      {product.price} грн
                    </span>
                  </div>

                  <div className="text-sm font-bold text-gray-900 whitespace-nowrap bg-gray-50 px-2 py-1 rounded border border-gray-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                    {product.price} <span className="text-[10px] font-medium">грн</span>
                  </div>
                </Link>
              ))
            ) : query.length >= 2 && !isLoading ? (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground italic">
                  Нічого не знайдено за запитом <span className="font-bold">"{query}"</span>
                </p>
              </div>
            ) : (
              <div className="py-12 text-center flex flex-col items-center gap-2 text-muted-foreground opacity-60">
                <Search size={32} strokeWidth={1} />
                <p className="text-xs">Почніть вводити назву або артикул...</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Адаптивна плашка знизу */}
        <div className="p-3 border-t bg-gray-50/50 hidden sm:flex justify-end">
           <p className="text-[10px] text-gray-400">Натисніть Esc щоб закрити</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
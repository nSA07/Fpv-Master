"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SearchDialog = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const search = async () => {
        if (query.length < 2) {
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


    const handleSelect = (slug: string) => {
        setOpen(false);
        setQuery("");
        router.push(`/products/${slug}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="flex gap-2 items-center cursor-pointer text-muted-foreground hover:text-foreground hover:bg-white border-gray-200"
                >
                    <span>пошук...</span>
                    <Search size={18} />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden gap-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="sr-only">Пошук товарів</DialogTitle>
                    <DialogDescription className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            className="pl-10 border-none focus-visible:ring-0 text-base"
                            placeholder="Шукати за назвою або SKU..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                            {isLoading && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" size={18} />
                            )}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[400px]">
                    <div className="p-2">
                        {results.length > 0 ? (
                            results.map((product) => (
                                <Button
                                    variant="ghost"
                                    key={product.id}
                                    onClick={() => handleSelect(product.slug)}
                                    className="w-full flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors text-left"
                                >
                                
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <span className="font-medium text-sm truncate">{product.name}</span>
                                    <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                                </div>

                                <div className="text-sm font-bold whitespace-nowrap">
                                    {product.price} грн
                                </div>
                                </Button>
                            ))
                        ) : query.length >= 2 && !isLoading ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Нічого не знайдено за запитом "{query}"
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Введіть мінімум 2 символи для пошуку
                            </div>
                        )}
                    </div>
                </ScrollArea>
        </DialogContent>
        </Dialog>
    );
};
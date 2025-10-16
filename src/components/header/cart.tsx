'use client'
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export const CartIcon = () => {
    const items = useCartStore((state) => state.items);
    const total = items.reduce((sum, i) => sum + i.quantity, 0);
    
    return (
        <div className="relative">
            <Link href="/cart">
                <ShoppingBag size={30} strokeWidth={1.25} className="cursor-pointer" />
            </Link>
            {total > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {total}
                </span>
            )}
        </div>
    );
};
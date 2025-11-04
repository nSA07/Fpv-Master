import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export function useCartProducts() {
    const { items: cartItems } = useCartStore();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            const ids = cartItems.map(i => i.id);
            if (!ids.length) {
                setProducts([]);
                return;
            }

            const res = await fetch("/api/cart-products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            });

            const data = await res.json();
            setProducts(data);
        }

        fetchProducts();
    }, [cartItems]);

    return { products };
}

"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CartItem } from "@/components/cart/cart-item";
import { useCartProducts } from "../hooks/use-cart-products";
import { useEffect, useState } from "react";

export default function Page() {
  const { items: cartItems, clearCart } = useCartStore();
  const { products } = useCartProducts();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="p-6 text-center mt-20 text-gray-500">
        Завантаження кошика...
      </div>
    );
  }
  
  const totalPrice = products.reduce((sum, product) => {
    const cartItem = cartItems.find((i) => i.id === product.id);
    const quantity = cartItem?.quantity || 0;
    return sum + (product.price ?? 0) * quantity;
  }, 0);


  if (cartItems.length === 0) {
    return (
      <div className="p-6 mt-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Кошик порожній</h1>
        <Link href="/" className="text-blue-600 underline">
          Повернутись до каталогу
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto w-full px-2 pt-6 pb-32 min-h-[60vh]">
      <h2 className="text-xl font-bold mb-6">Кошик</h2>
      <ul className="divide-y divide-gray-200">
        {products?.map((item) => {
          const cartItem = cartItems.find((i) => i.id === item.id);
          return (
            <CartItem
              key={item.id}
              item={item}
              quantity={cartItem?.quantity || 0}
            />
          );
        })}
      </ul>

      <div className="mt-8 bg-gray-100 rounded-xl p-4 sticky bottom-0 z-20 flex flex-col gap-2 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Усього позицій:</span>
          <span className="font-semibold">{products.length}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-semibold mt-2">
          <span>До сплати:</span>
          <span>{totalPrice.toLocaleString("uk-UA")} ₴</span>
        </div>
        <div className="flex justify-end items-center gap-4 mt-4">
          <Button
            variant="outline"
            className="cursor-pointer hover:bg-red-500 hover:text-white transform transition-colors"
            onClick={clearCart}
          >
            Очистити кошик
          </Button>

          <Link href="/checkout">
            <Button className="cursor-pointer">
              Оформити замовлення
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

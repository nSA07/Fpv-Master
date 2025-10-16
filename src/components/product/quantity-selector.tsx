"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export const QuantitySelector = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(0);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(prev - 1, 0));

  const handleAddToCart = () => {
    if (quantity === 0) return;
    addItem({ product, quantity }); // 🔹 передаємо весь об’єкт
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(0);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-auto w-full">
      {/* Верхній блок: кількість + ціна */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition p-0 cursor-pointer"
            onClick={decrement}
          >
            <Minus size={18} />
          </Button>

          <span className="text-lg font-semibold w-6 text-center">
            {quantity}
          </span>

          <Button
            variant="ghost"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition p-0 cursor-pointer"
            onClick={increment}
          >
            <Plus size={18} />
          </Button>
        </div>

        <span className="text-xl font-bold">{product.price}₴</span>
      </div>

      {/* Кнопка додавання в кошик */}
      <Button
        onClick={handleAddToCart}
        disabled={quantity === 0}
        className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg py-2 transition disabled:opacity-50 cursor-pointer"
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Додано!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Додати в кошик
          </>
        )}
      </Button>
    </div>
  );
};
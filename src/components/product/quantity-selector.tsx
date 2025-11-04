"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { PriceMiniDisplay } from "./price-display";

export const QuantitySelector = ({
  product,
  disabled = false,
}: {
  product: Product;
  disabled: boolean;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
      setQuantity(1); // повернути назад на 1 після додавання
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-auto w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            disabled={disabled || product.stock <= 0 || quantity === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition p-0"
            onClick={decrement}
          >
            <Minus size={18} />
          </Button>

          <span className="text-lg font-semibold w-6 text-center">{quantity}</span>

          <Button
            variant="ghost"
            disabled={disabled || product.stock <= 0}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition p-0"
            onClick={increment}
          >
            <Plus size={18} />
          </Button>
        </div>

        <PriceMiniDisplay price={product.price} price_old={product.price_old} />
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={disabled || product.stock <= 0}
        className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg py-2 transition disabled:opacity-50"
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

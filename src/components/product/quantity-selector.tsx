"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { PriceMiniDisplay } from "./price-display";
import { Input } from "../ui/input";

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
  const cartItems = useCartStore((state) => state.items);

  const maxStock = product.stock || 0;
  const isOutOfStock = maxStock <= 0;

  const currentItemInCart = cartItems.find((i) => i.id === product.id);
  const currentQuantityInCart = currentItemInCart ? currentItemInCart.quantity : 0;
  const isMaxStockInCart = maxStock > 0 && currentQuantityInCart >= maxStock;

  const increment = () => {
    setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
  };

  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Обробник ручного введення
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Якщо рядок порожній, дозволяємо (щоб користувач міг стерти цифру)
    if (value === "") {
      setQuantity(0);
      return;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) return;

    // Обмежуємо число від 0 до залишку на складі
    if (num < 0) setQuantity(0);
    else if (num > maxStock) setQuantity(maxStock);
    else setQuantity(num);
  };

  const handleBlur = () => {
    // Якщо користувач залишив поле порожнім або з 0, повертаємо 1 при виході з фокусу
    if (quantity < 1 && maxStock > 0) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (isMaxStockInCart || quantity <= 0) return;

    let requestedNewTotal = currentQuantityInCart + quantity;
    let quantityToDispatch = quantity;

    if (requestedNewTotal > maxStock) {
      quantityToDispatch = maxStock - currentQuantityInCart;
      if (quantityToDispatch <= 0) {
        setAdded(false);
        return;
      }
    }

    addItem(product.id, quantityToDispatch);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
      setQuantity(maxStock >= 1 ? 1 : 0);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-auto w-full">
      {isOutOfStock && (
        <div className="text-red-600 font-semibold w-full text-center p-2 border border-red-300 bg-red-50 rounded-lg">
          Немає в наявності
        </div>
      )}
      {isMaxStockInCart && (
        <div className="text-green-600 font-semibold w-full text-center p-2 border border-green-300 bg-green-50 rounded-lg">
          🎉 Весь залишок ({maxStock} шт.) вже у вашому кошику!
        </div>
      )}

      {!(isOutOfStock || isMaxStockInCart) && (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              disabled={disabled || isOutOfStock || quantity <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition p-0"
              onClick={decrement}
            >
              <Minus size={18} />
            </Button>

            {/* ОСЬ ЦЕЙ ІНПУТ */}
            <Input
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantity === 0 ? "" : quantity}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-12 h-10 text-center text-lg font-semibold bg-transparent border-b-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
            />

            <Button
              variant="ghost"
              disabled={disabled || isOutOfStock || quantity >= maxStock}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition p-0"
              onClick={increment}
            >
              <Plus size={18} />
            </Button>
          </div>

          <PriceMiniDisplay price={product.price} price_old={product.price_old} />
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={disabled || isOutOfStock || isMaxStockInCart || quantity === 0}
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
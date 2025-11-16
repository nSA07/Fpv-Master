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
  
  const handleAddToCart = () => {
    
    if (isMaxStockInCart) {
      return; 
    }
    
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
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              disabled={disabled || isOutOfStock || quantity === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition p-0"
              onClick={decrement}
            >
              <Minus size={18} />
            </Button>

            <span className="text-lg font-semibold w-6 text-center">
              {quantity}
            </span>

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
        disabled={disabled || isOutOfStock || isMaxStockInCart} 
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
            {isMaxStockInCart ? 'Весь залишок у кошику' : 'Додати в кошик'}
          </>
        )}
      </Button>
    </div>
  );
};
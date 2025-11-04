"use client";

import { useCartStore } from "@/store/cartStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

export const CartItem = ({
  item,
  quantity,
}: {
  item: any;
  quantity: number;
}) => {
  const { removeItem, addItem } = useCartStore();
  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const handleDecrease = () => {
    if (quantity > 1) {
      addItem(item.id, -1);
    } else {
      removeItem(item.id);
    }
  };

  const handleIncrease = () => {
    addItem(item.id, 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setInputValue(val);

    if (val === "") return; // дозволяємо користувачу вводити

    const parsed = parseInt(val, 10);

    // якщо NaN — нічого не робимо
    if (isNaN(parsed)) return;

    // не дозволяємо негативні значення (але не міняємо поки не blur)
    if (parsed < 1) return;

    const diff = parsed - quantity;
    if (diff !== 0) addItem(item.id, diff);
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);

    // Не число або менше 1 → видалити товар
    if (isNaN(parsed) || parsed < 1) {
      removeItem(item.id);
      return;
    }

    // Якщо parsed === quantity — нічого не робимо
    if (parsed === quantity) return;

    // Якщо > 1 — просто сетимо правильне значення
    addItem(item.id, parsed - quantity);
  };

  return (
    <li className="flex items-center gap-3 sm:gap-6 py-4">
      {/* Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border bg-white">
        {item.images?.[0] && (
          <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.images[0].directus_files_id}`}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="font-medium text-gray-800 truncate max-w-[180px] sm:max-w-none">
          {item.name}
        </h2>

        <div className="text-gray-400 text-sm mt-1">
          {item.price?.toLocaleString("uk-UA")} ₴ за одиницю
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-3">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrease}>
            −
          </Button>

          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="no-arrows w-14 text-center bg-white h-8 text-sm"
          />

          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrease}>
            +
          </Button>
        </div>
      </div>

      {/* Price & Desktop delete */}
      <div className="flex flex-col items-center gap-2">
        <div className="font-semibold text-black">
          {(item.price * quantity).toLocaleString("uk-UA")} ₴
        </div>

        <button
          className="text-gray-400 hover:text-red-400 transition"
          onClick={() => removeItem(item.id)}
        >
          ✕
        </button>
      </div>
    </li>
  );
};

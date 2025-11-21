"use client";

import { useCartStore } from "@/store/cartStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

export const CartItem = ({
  item,
  quantity,
  maxStock,
}: {
  item: any;
  quantity: number;
  maxStock: number; // <--- ТИП
}) => {
  const { removeItem, addItem } = useCartStore();
  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    // Корегуємо inputValue, якщо кількість змінилася ззовні (наприклад, Page.js скоригував stock)
    setInputValue(String(quantity));
  }, [quantity]);

  // Чи досягнута максимальна кількість (наприклад, для disabled кнопки "+")
  const isMaxQuantity = quantity >= maxStock;

  const handleDecrease = () => {
    if (quantity > 1) {
      addItem(item.id, -1);
    }
  };

  const handleIncrease = () => {
    // Перевірка: не дозволяємо збільшувати, якщо досягнуто ліміту
    if (!isMaxQuantity) {
      addItem(item.id, 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setInputValue(val);

    // Логіка для негайного оновлення (залишаємо її як є, але на blur буде фінальна перевірка)
    if (val === "") return;

    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 1) return;

    // Фіксуємо тимчасове значення, але не перевищуємо stock
    const correctedValue = Math.min(parsed, maxStock);
    
    // Якщо користувач вводить число більше за stock, ми тимчасово оновлюємо стор
    // до значення stock, щоб не втрачати коректність, доки не спрацює blur.
    if (correctedValue !== quantity) {
        const diff = correctedValue - quantity;
        addItem(item.id, diff);
    }
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);
    
    // 1. Не число, менше 1, або сток 0 → видалити товар
    if (isNaN(parsed) || parsed < 1 || maxStock === 0) {
      removeItem(item.id);
      return;
    }

    // 2. Обмежуємо введене значення залишком на складі
    const finalQuantity = Math.min(parsed, maxStock);

    // Якщо значення не змінилося після коригування, виходимо
    if (finalQuantity === quantity) {
        // Оновлюємо inputValue, якщо користувач ввів забагато, але змін у сторі не було
        setInputValue(String(quantity)); 
        return;
    }

    // 3. Оновлюємо стор до фінальної кількості
    const diff = finalQuantity - quantity;
    if (diff !== 0) addItem(item.id, diff);
    
    // 4. Обов'язково встановлюємо скориговане значення в Input
    setInputValue(String(finalQuantity)); 
  };
  
  // Додаткова перевірка для відображення попередження
  const isCurrentlyMaxStock = quantity === maxStock && maxStock > 0;


  return (
    <li className="flex flex-col gap-2 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3 sm:gap-6">
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
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              −
            </Button>

            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              max={maxStock} 
              disabled={maxStock === 0}
              className="no-arrows w-14 text-center bg-white h-8 text-sm"
            />

            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleIncrease}
              // Кнопка плюс вимкнена, якщо досягнуто stock
              disabled={isMaxQuantity} 
            >
              +
            </Button>
          </div>
        </div>

        {/* Price & Delete */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-semibold text-black whitespace-nowrap">
            {(item.price * quantity).toLocaleString("uk-UA")} ₴
          </div>

          <button
            className="text-gray-400 hover:text-red-400 transition"
            onClick={() => removeItem(item.id)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ПОВІДОМЛЕННЯ ПРО ЗАЛИШОК НА СКЛАДІ */}
      {isCurrentlyMaxStock && (
        <div className="text-sm text-center font-medium text-green-600 bg-green-50 p-1.5 rounded-md mt-1 mx-auto w-full sm:w-1/2">
          Це весь залишок товару ({maxStock} шт.)
        </div>
      )}
    </li>
  );
};
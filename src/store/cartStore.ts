import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

type CartItem = {
  id: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  orderId: string;
  addItem: (id: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  resetCartState: () => void; // Нова назва: очищає кошик та генерує новий orderId
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      orderId: uuidv4(), // Генерується лише 1 раз при ініціалізації або при reset
      items: [],

      addItem: (id, quantity = 1) => {
        // ... (логіка addItem без змін)
        const existing = get().items.find((item) => item.id === id);
        if (existing) {
            set({
                items: get().items.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + quantity } : item
                ),
            });
        } else {
            set({ items: [...get().items, { id, quantity }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      clearCart: () => set({ items: [] }),

      resetCartState: () => {
        // Викликається після успішної оплати або скасування
        set({ items: [], orderId: uuidv4() }); // Скидаємо кошик і генеруємо НОВИЙ ID
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
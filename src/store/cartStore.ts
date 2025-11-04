import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (id: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (id, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.id === id);

        if (existing) {
          set({
            items: items.map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { id, quantity }] });
        }
      },

      removeItem: (id) =>
        set({
          items: get().items.filter((item) => item.id !== id),
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // ключ у localStorage
    }
  )
);

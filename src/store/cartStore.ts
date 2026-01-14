import { create } from "zustand";
import { persist } from "zustand/middleware";
import { customAlphabet } from "nanoid";

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
  resetCartState: () => void;
};

const generateOrderId = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 10);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      orderId: generateOrderId(),
      items: [],

      addItem: (id, quantity = 1) => {
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
        set({ items: [], orderId: generateOrderId() });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
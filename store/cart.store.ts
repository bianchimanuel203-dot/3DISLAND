import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopProduct } from "@/lib/shop/products";

export type CartLine = {
  product: ShopProduct;
  quantity: number;
};

type CartStore = {
  lines: CartLine[];
  addToCart: (product: ShopProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],
      addToCart: (product) => {
        set((state) => {
          const existing = state.lines.find((l) => l.product.id === product.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.product.id === product.id
                  ? { ...l, quantity: l.quantity + 1 }
                  : l
              ),
            };
          }
          return {
            lines: [...state.lines, { product, quantity: 1 }],
          };
        });
        // Abre el sidecart automáticamente
        import("@/store/sidecart.store").then(({ useSidecartStore }) => {
          useSidecartStore.getState().open();
        });
      },
      removeFromCart: (productId) => {
        set((state) => {
          const line = state.lines.find((l) => l.product.id === productId);
          if (!line) return state;
          if (line.quantity <= 1) {
            return { lines: state.lines.filter((l) => l.product.id !== productId) };
          }
          return {
            lines: state.lines.map((l) =>
              l.product.id === productId ? { ...l, quantity: l.quantity - 1 } : l
            ),
          };
        });
      },
      clearCart: () => set({ lines: [] }),
      cartCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      cartTotal: () => get().lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    }),
    { name: "3dra-island-cart" }
  )
);
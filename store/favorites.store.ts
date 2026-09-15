import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopProduct } from "@/lib/shop/products";

type FavoritesStore = {
  items: ShopProduct[];
  addFavorite: (product: ShopProduct) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: ShopProduct) => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (product) => {
        set((state) => ({
          items: state.items.find((i) => i.id === product.id)
            ? state.items
            : [...state.items, product],
        }));
      },
      removeFavorite: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },
      isFavorite: (productId) => {
        return get().items.some((i) => i.id === productId);
      },
      toggleFavorite: (product) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(product.id)) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
      },
    }),
    { name: "3dra-island-favorites" }
  )
);
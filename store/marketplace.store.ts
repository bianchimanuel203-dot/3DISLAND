import { create } from "zustand";
import { Product } from "./types/marketplace.types";

type MarketplaceState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
};

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  products: [],
  setProducts: (products) =>
    set(() => ({
      products,
    })),
}));
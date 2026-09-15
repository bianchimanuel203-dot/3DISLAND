export type Seller = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  country?: string;
  createdAt: Date;
  rating: number;
  totalSales: number;
  isVerified: boolean;
};

export type ProductCategory =
  | "3d-print-models"
  | "figurines"
  | "home-decor"
  | "tools"
  | "art"
  | "gaming"
  | "custom";

export type Product = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: "EUR" | "USD";
  images: string[];
  gltfModelUrl?: string;
  category: ProductCategory;
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  isFeatured: boolean;
};

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
};
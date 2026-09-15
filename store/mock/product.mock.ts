import { Product } from "../types/marketplace.types";

export const mockProducts: Product[] = [
  {
    id: "1",
    sellerId: "seller1",
    title: "Cyber Samurai Figurine",
    description: "3D printable cyberpunk samurai",
    price: 19.99,
    currency: "EUR",
    images: ["/img1.jpg"], // Luego cambiaremos esto por URLs reales
    category: "figurines",
    tags: ["cyberpunk", "samurai"],
    stock: 10,
    rating: 4.8,
    reviewCount: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    isFeatured: true,
  },
];
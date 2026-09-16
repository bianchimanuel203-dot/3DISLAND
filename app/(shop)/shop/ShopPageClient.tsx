"use client";
import { Suspense } from "react";
import ShopLayout from "@/components/shop/ShopLayout";
import ShopSkeleton from "@/components/shop/ShopSkeleton";

export default function ShopPageClient() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopLayout />
    </Suspense>
  );
}

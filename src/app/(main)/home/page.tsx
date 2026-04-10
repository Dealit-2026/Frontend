"use client";

import { useRouter } from "next/navigation";

import HomeScreen from "./index";

export default function HomePage() {
  const router = useRouter();

  return (
    <HomeScreen
      onProductClick={(id) => router.push(`/products/${id}`)}
      onProductListClick={() => router.push("/products")}
      onNotificationClick={() => router.push("/notifications")}
      onCategoryResetClick={() => {}}
      onSearchClick={() => router.push("/search")}
      onWishlistClick={() => router.push("/wishlist")}
      mode="regular"
      onModeChange={() => {}}
      onTabChange={() => {}}
    />
  );
}

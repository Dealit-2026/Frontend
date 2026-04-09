"use client";

import { useRouter } from "next/navigation";

import WishlistScreen from "./index";

export default function WishlistPage() {
  const router = useRouter();

  return (
    <WishlistScreen
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      themeColor="#98E446"
    />
  );
}

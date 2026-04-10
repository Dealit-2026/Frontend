"use client";

import { useRouter } from "next/navigation";

import ProductListScreen from "./index";

export default function ProductsPage() {
  const router = useRouter();

  return (
    <ProductListScreen
      listType="all"
      categoryName={null}
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      onSearchClick={() => router.push("/search")}
      themeColor="#98E446"
      mode="regular"
    />
  );
}

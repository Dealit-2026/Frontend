"use client";

import { useRouter } from "next/navigation";

import SearchScreen from "./index";

export default function SearchPage() {
  const router = useRouter();

  return (
    <SearchScreen
      onBack={() => router.back()}
      onCategorySelect={(category) =>
        router.push(
          `/products?categoryId=${category.id}&category=${encodeURIComponent(category.name)}`,
        )
      }
      onSearchDetailClick={() => router.push("/search/detail")}
      onRecentClick={() => router.push("/products")}
      themeColor="#98E446"
    />
  );
}

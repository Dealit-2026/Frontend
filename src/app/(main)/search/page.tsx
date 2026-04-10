"use client";

import { useRouter } from "next/navigation";

import SearchScreen from "./index";

export default function SearchPage() {
  const router = useRouter();

  return (
    <SearchScreen
      onBack={() => router.back()}
      onSearch={() => router.push("/products")}
      onSearchDetailClick={() => router.push("/search/detail")}
      onRecentClick={() => router.push("/products")}
      themeColor="#98E446"
    />
  );
}

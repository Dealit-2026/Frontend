"use client";

import { useRouter } from "next/navigation";

import SearchDetailScreen from "./index";

export default function SearchDetailPage() {
  const router = useRouter();

  return (
    <SearchDetailScreen
      onBack={() => router.back()}
      onSearch={(keyword) => {
        const params = new URLSearchParams({ keyword });
        router.push(`/products?${params.toString()}`);
      }}
      themeColor="#98E446"
      initialCategory={null}
    />
  );
}

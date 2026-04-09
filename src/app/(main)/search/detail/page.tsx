"use client";

import { useRouter } from "next/navigation";

import SearchDetailScreen from "./index";

export default function SearchDetailPage() {
  const router = useRouter();

  return (
    <SearchDetailScreen
      onBack={() => router.back()}
      onSearch={() => router.push("/products")}
      themeColor="#98E446"
      initialCategory={null}
    />
  );
}

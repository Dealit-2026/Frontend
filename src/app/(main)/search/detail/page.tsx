"use client";

import { useRouter } from "next/navigation";

import SearchDetailScreen from "./index";

export default function SearchDetailPage() {
  const router = useRouter();

  return (
    <div className="h-dvh max-h-dvh min-h-0 overflow-hidden bg-white">
      <SearchDetailScreen
        onBack={() => router.back()}
        onSearch={(keyword) => {
          const params = new URLSearchParams({ keyword });
          router.push(`/products?${params.toString()}`);
        }}
        themeColor="#98E446"
        initialCategory={null}
      />
    </div>
  );
}

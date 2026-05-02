"use client";

import { useRouter } from "next/navigation";

import AuctionListScreen from "./index";

export default function AuctionsPage() {
  const router = useRouter();

  return (
    <AuctionListScreen
      listType="all"
      categoryName={null}
      onBack={() => router.back()}
      onProductClick={(id: number) => router.push(`/products/${id}`)}
      onSearchClick={() => router.push("/search")}
      themeColor="#F64257"
    />
  );
}

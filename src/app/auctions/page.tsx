"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuctionListScreen from "./index";
import type { UnifiedSearchResultType } from "@/services/product/search/types";

function parseSearchResultType(value: string | null): UnifiedSearchResultType | null {
  return value === "REGULAR" || value === "AUCTION" ? value : null;
}

function AuctionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = Number(searchParams.get("categoryId"));
  const categoryId =
    Number.isFinite(categoryIdParam) && categoryIdParam > 0
      ? categoryIdParam
      : null;
  const categoryName = searchParams.get("category");
  const searchKeyword = searchParams.get("keyword");
  const searchResultType = parseSearchResultType(
    searchParams.get("searchType"),
  );

  return (
    <AuctionListScreen
      listType="all"
      categoryId={categoryId}
      categoryName={categoryName}
      searchKeyword={searchKeyword}
      searchResultType={searchResultType}
      onBack={() => router.back()}
      onProductClick={(id: number) => router.push(`/auctions/${id}`)}
      onAuctionClick={(id: number) => router.push(`/auctions/${id}`)}
      onSearchClick={() => router.push("/search")}
      themeColor="#F64257"
    />
  );
}

export default function AuctionsPage() {
  return (
    <Suspense fallback={null}>
      <AuctionsPageContent />
    </Suspense>
  );
}

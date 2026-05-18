"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductListScreen from "./index";
import type { UnifiedSearchResultType } from "@/services/product/search/types";

function parseSearchResultType(value: string | null): UnifiedSearchResultType | null {
  return value === "REGULAR" || value === "AUCTION" ? value : null;
}

function ProductsPageContent() {
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
    <ProductListScreen
      listType="all"
      categoryId={categoryId}
      categoryName={categoryName}
      searchKeyword={searchKeyword}
      searchResultType={searchResultType}
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      onAuctionClick={(id) => router.push(`/auctions/${id}`)}
      onSearchClick={() => router.push("/search")}
      themeColor="#98E446"
      mode="regular"
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductListScreen from "./index";
import type { UnifiedSearchResultType } from "@/services/product/search/types";
import type { ProductListType } from "./index";

function parseSearchResultType(value: string | null): UnifiedSearchResultType | null {
  return value === "REGULAR" || value === "AUCTION" ? value : null;
}

function parseListType(value: string | null): ProductListType {
  return value === "closing_soon" || value === "recent" ? value : "all";
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
  const listType = parseListType(searchParams.get("type"));

  return (
    <div className="h-dvh max-h-dvh min-h-0 overflow-hidden bg-white">
      <ProductListScreen
        listType={listType}
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
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}

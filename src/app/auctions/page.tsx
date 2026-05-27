"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuctionListScreen from "./index";
import type { UnifiedSearchResultType } from "@/services/product/search/types";
import type { ProductListType } from "../products";

function parseSearchResultType(value: string | null): UnifiedSearchResultType | null {
  return value === "REGULAR" || value === "AUCTION" ? value : null;
}

function parseListType(value: string | null): ProductListType {
  return value === "closing_soon" || value === "recent" ? value : "all";
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
  const listType = parseListType(searchParams.get("type"));

  return (
    <div className="h-dvh max-h-dvh min-h-0 overflow-hidden bg-white">
      <AuctionListScreen
        listType={listType}
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
    </div>
  );
}

export default function AuctionsPage() {
  return (
    <Suspense fallback={null}>
      <AuctionsPageContent />
    </Suspense>
  );
}

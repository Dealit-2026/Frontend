"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Search, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

import ProductListItem from "../../components/product/ProductListItem";
import {
  fetchClosingSoonAuctions,
  fetchPopularAuctions,
} from "@/services/auction/list/service";
import { getErrorMessage } from "@/services/apiError";
import { fetchHotRegularProducts } from "@/services/product/hotList/service";
import { fetchPopularRegularProducts } from "@/services/product/popular/service";
import { fetchIntegratedSearchResults } from "@/services/product/search/service";
import type { UnifiedSearchResultType } from "@/services/product/search/types";
import { fetchRecentProducts } from "@/services/recent-products/service";
import { fetchMyWishlist } from "@/services/wishlist/service";

type ProductListType = "all" | "closing_soon" | "recent";

export default function ProductListScreen({
  listType,
  categoryId,
  categoryName,
  searchKeyword,
  searchResultType,
  onBack,
  onProductClick,
  onAuctionClick,
  onSearchClick,
  themeColor,
  mode,
}: {
  listType: ProductListType;
  categoryId?: number | null;
  categoryName: string | null;
  searchKeyword?: string | null;
  searchResultType?: UnifiedSearchResultType | null;
  onBack: () => void;
  onProductClick: (id: number) => void;
  onAuctionClick?: (id: number) => void;
  onSearchClick: () => void;
  themeColor: string;
  mode: "regular" | "auction";
  key?: string | number;
}) {
  const title =
    searchKeyword
      ? `"${searchKeyword}" 검색 결과`
      : categoryName ||
        (listType === "recent"
          ? "최근 본 상품"
          : mode === "auction" && listType === "all"
            ? "실시간 인기 경매"
            : mode === "auction" && listType === "closing_soon"
              ? "마감 임박 경매"
              : mode === "regular" && listType === "all"
                ? "실시간 인기 상품"
                : mode === "regular" && listType === "closing_soon"
                  ? "핫한 상품"
                  : "상품 목록");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [wishlistErrorMessage, setWishlistErrorMessage] = useState("");
  const [likedProductIds, setLikedProductIds] = useState<Set<number>>(
    () => new Set(),
  );

  useEffect(() => {
    let ignore = false;
    const normalizedKeyword = searchKeyword?.trim();
    const shouldFetchKeywordList = Boolean(normalizedKeyword);
    const shouldFetchCategoryList =
      !shouldFetchKeywordList && typeof categoryId === "number" && categoryId > 0;
    const shouldFetchRecentList =
      !shouldFetchKeywordList &&
      !shouldFetchCategoryList &&
      !categoryName &&
      listType === "recent";
    const shouldFetchApiList =
      !shouldFetchKeywordList &&
      !shouldFetchCategoryList &&
      !shouldFetchRecentList &&
      !categoryName &&
      ((mode === "regular" &&
        (listType === "all" || listType === "closing_soon")) ||
        (mode === "auction" &&
          (listType === "all" || listType === "closing_soon")));

    if (
      !shouldFetchKeywordList &&
      !shouldFetchCategoryList &&
      !shouldFetchRecentList &&
      !shouldFetchApiList
    ) {
      setProducts([]);
      setErrorMessage("");
      return () => {
        ignore = true;
      };
    }

    setIsLoading(true);
    setErrorMessage("");
    setWishlistErrorMessage("");

    const request = shouldFetchKeywordList
      ? fetchIntegratedSearchResults({
          keyword: normalizedKeyword,
          type: searchResultType,
          categoryId,
          page: 0,
          size: 20,
        })
      : shouldFetchCategoryList
        ? fetchIntegratedSearchResults({
            categoryId,
            page: 0,
            size: 20,
          })
      : shouldFetchRecentList
        ? fetchRecentProducts(20)
      : mode === "regular" && listType === "all"
        ? fetchPopularRegularProducts(10)
        : mode === "regular"
          ? fetchHotRegularProducts(8)
          : listType === "all"
            ? fetchPopularAuctions(8)
            : fetchClosingSoonAuctions(8);

    request
      .then((nextProducts) => {
        if (!ignore) {
          setProducts(
            shouldFetchKeywordList || shouldFetchCategoryList || shouldFetchRecentList
              ? nextProducts
              : nextProducts.slice(
                  0,
                  mode === "regular" && listType === "all" ? 10 : 8,
                ),
          );
        }
      })
      .catch((error) => {
        if (!ignore) {
          setProducts([]);
          setErrorMessage(
            getErrorMessage(
              error,
              shouldFetchKeywordList
                ? "검색 결과를 불러오지 못했습니다."
                : shouldFetchCategoryList
                ? "카테고리 검색 결과를 불러오지 못했습니다."
                : shouldFetchRecentList
                  ? "최근 본 상품을 불러오지 못했습니다."
                : mode === "regular" && listType === "all"
                  ? "실시간 인기 상품을 불러오지 못했습니다."
                  : mode === "regular"
                    ? "핫한 상품을 불러오지 못했습니다."
                    : listType === "all"
                      ? "실시간 인기 경매를 불러오지 못했습니다."
                      : "마감 임박 경매를 불러오지 못했습니다.",
            ),
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [categoryId, categoryName, listType, mode, searchKeyword, searchResultType]);

  useEffect(() => {
    if (mode !== "regular" && !categoryId && !searchKeyword && listType !== "recent") {
      setLikedProductIds(new Set());
      return;
    }

    let ignore = false;

    fetchMyWishlist()
      .then((items) => {
        if (!ignore) {
          setLikedProductIds(new Set(items.map((item) => item.productId)));
        }
      })
      .catch(() => {
        if (!ignore) {
          setLikedProductIds(new Set());
        }
      });

    return () => {
      ignore = true;
    };
  }, [categoryId, listType, mode, searchKeyword]);

  const handleWishlistChange = (
    productId: number,
    liked: boolean,
    favoriteCount: number,
  ) => {
    setLikedProductIds((current) => {
      const next = new Set(current);

      if (liked) {
        next.add(productId);
      } else {
        next.delete(productId);
      }

      return next;
    });

    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.productId === productId ? { ...item, favoriteCount } : item,
      ),
    );
  };

  const showWishlistError = (message: string) => {
    setWishlistErrorMessage(message);
    window.setTimeout(() => {
      setWishlistErrorMessage("");
    }, 3000);
  };

  const handleProductClick = (product: any) => {
    const isAuctionProduct =
      product.saleType === "AUCTION" ||
      (!searchKeyword && mode === "auction" && product.auctionId != null);

    if (isAuctionProduct) {
      onAuctionClick?.(product.auctionId ?? product.productId);
      return;
    }

    onProductClick(product.productId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-14 flex items-center px-4 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-50 justify-between">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">{title}</h1>
        </div>
        <button
          type="button"
          onClick={onSearchClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="검색"
        >
          <Search size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {wishlistErrorMessage && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
            {wishlistErrorMessage}
          </div>
        )}
        {isLoading ? (
          <EmptyState message={`${title}을 불러오는 중입니다`} />
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500 space-y-2">
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductListItem
              key={`${product.saleType ?? mode}-${product.auctionId ?? product.productId}`}
              product={product}
              mode={
                product.saleType === "AUCTION" ||
                (!searchKeyword && mode === "auction" && product.auctionId != null)
                  ? "auction"
                  : "regular"
              }
              themeColor={themeColor}
              onProductClick={() => handleProductClick(product)}
              initialLiked={likedProductIds.has(product.productId)}
              onWishlistChange={handleWishlistChange}
              onWishlistError={showWishlistError}
              showWishlistButton={
                product.saleType === "AUCTION" ||
                (!searchKeyword && mode === "auction" && product.auctionId != null)
              }
            />
          ))
        ) : (
          <EmptyState
            message={
              categoryName
                ? "검색 결과가 없습니다"
                : listType === "recent"
                  ? "최근 본 상품이 없습니다"
                : mode === "regular"
                  ? "표시할 일반 상품이 없습니다"
                  : "등록된 경매 상품이 없습니다"
            }
          />
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
      <ShoppingBag size={48} className="opacity-20" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

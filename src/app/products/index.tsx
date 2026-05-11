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

type ProductListType = "all" | "closing_soon" | "recent";

export default function ProductListScreen({
  listType,
  categoryName,
  onBack,
  onProductClick,
  onSearchClick,
  themeColor,
  mode,
}: {
  listType: ProductListType;
  categoryName: string | null;
  onBack: () => void;
  onProductClick: (id: number) => void;
  onSearchClick: () => void;
  themeColor: string;
  mode: "regular" | "auction";
  key?: string | number;
}) {
  const title =
    categoryName ||
    (mode === "auction" && listType === "all"
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

  useEffect(() => {
    let ignore = false;
    const shouldFetchApiList =
      !categoryName &&
      ((mode === "regular" &&
        (listType === "all" || listType === "closing_soon")) ||
        (mode === "auction" &&
          (listType === "all" || listType === "closing_soon")));

    if (!shouldFetchApiList) {
      setProducts([]);
      setErrorMessage("");
      return () => {
        ignore = true;
      };
    }

    setIsLoading(true);
    setErrorMessage("");

    const request =
      mode === "regular" && listType === "all"
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
            nextProducts.slice(
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
              mode === "regular" && listType === "all"
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
  }, [categoryName, listType, mode]);

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
        {isLoading ? (
          <EmptyState message={`${title}을 불러오는 중입니다`} />
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500 space-y-2">
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductListItem
              key={`${mode}-${product.auctionId ?? product.productId}`}
              product={product}
              mode={mode}
              themeColor={themeColor}
              onProductClick={onProductClick}
            />
          ))
        ) : (
          <EmptyState
            message={
              categoryName
                ? "검색 결과가 없습니다"
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

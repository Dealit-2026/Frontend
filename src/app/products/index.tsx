"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Check,
  ChevronRight,
  User,
  Camera,
  Search,
  Home,
  PlusCircle,
  MessageCircle,
  Heart,
  Bell,
  Filter,
  Settings,
  MoreVertical,
  Send,
  Star,
  Clock,
  ArrowUpRight,
  X,
  Trash2,
  Eye,
  Image as ImageIcon,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  Menu,
  ShoppingBag,
  Store,
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Screen, Tab } from "../../types/index";
import { ExploreIcon } from "../../components/common/ExploreIcon";
import ProductListItem from "../../components/product/ProductListItem";
import {
  fetchClosingSoonAuctions,
  fetchPopularAuctions,
} from "@/services/auction/list/service";
import { fetchHotRegularProducts } from "@/services/product/hotList/service";
import { getErrorMessage } from "@/services/apiError";

export default function ProductListScreen({
  listType,
  categoryName,
  onBack,
  onProductClick,
  onSearchClick,
  themeColor,
  mode,
}: {
  listType: "all" | "closing_soon" | "recent";
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
        : listType === "all"
          ? "전체 목록"
          : listType === "recent"
            ? "최근 본 상품"
            : "핫한 상품");
  const [itemIds] = useState<number[]>(
    mode === "auction" ? [] : [1, 2, 3, 4, 5, 6, 7, 8],
  );
  const [hotProducts, setHotProducts] = useState<any[]>([]);
  const [isHotLoading, setIsHotLoading] = useState(false);
  const [hotError, setHotError] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    if (
      (listType === "closing_soon" && mode === "regular") ||
      (mode === "auction" && (listType === "all" || listType === "closing_soon"))
    ) {
      setIsHotLoading(true);
      setHotError("");

      const request =
        mode === "regular"
          ? fetchHotRegularProducts(8)
          : listType === "all"
            ? fetchPopularAuctions(8)
            : fetchClosingSoonAuctions(8);

      request
        .then((products) => {
          if (!ignore) setHotProducts(products.slice(0, 8));
        })
        .catch((err) => {
          if (!ignore)
            setHotError(
              getErrorMessage(
                err,
                mode === "regular"
                  ? "핫한 상품을 불러오지 못했습니다."
                  : listType === "all"
                    ? "실시간 인기 경매를 불러오지 못했습니다."
                    : "마감임박 경매를 불러오지 못했습니다.",
              ),
            );
        })
        .finally(() => {
          if (!ignore) setIsHotLoading(false);
        });
    } else {
      setHotProducts([]);
    }

    return () => {
      ignore = true;
    };
  }, [listType, mode]);

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
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">{title}</h1>
        </div>
        <button
          onClick={onSearchClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Search size={22} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {(listType === "closing_soon" && mode === "regular") ||
        (mode === "auction" && (listType === "all" || listType === "closing_soon")) ? (
          isHotLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
              <ShoppingBag size={48} className="opacity-20" />
              <p className="text-sm font-medium">
                {mode === "regular"
                  ? "핫한 상품을 불러오는 중입니다"
                  : listType === "all"
                    ? "실시간 인기 경매를 불러오는 중입니다"
                    : "마감임박 경매를 불러오는 중입니다"}
              </p>
            </div>
          ) : hotError ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500 space-y-2">
              <p className="text-sm font-medium">{hotError}</p>
            </div>
          ) : hotProducts.length > 0 ? (
            hotProducts.map((p) => (
              <ProductListItem
                key={p.productId}
                product={p}
                mode={mode}
                themeColor={themeColor}
                onProductClick={onProductClick}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
              <ShoppingBag size={48} className="opacity-20" />
              <p className="text-sm font-medium">
                {mode === "regular"
                  ? "핫한 상품이 없습니다"
                  : listType === "all"
                    ? "등록된 인기 경매가 없습니다"
                    : "마감임박 경매가 없습니다"}
              </p>
            </div>
          )
        ) : itemIds.length > 0 ? (
          itemIds.map((i) => (
            <ProductListItem
              key={i}
              i={i}
              mode={mode}
              themeColor={themeColor}
              onProductClick={onProductClick}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
            <ShoppingBag size={48} className="opacity-20" />
            <p className="text-sm font-medium">등록된 경매 상품이 없습니다</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

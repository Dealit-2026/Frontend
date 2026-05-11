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

import { Screen, Tab } from "../../../types/index";
import { ExploreIcon } from "../../../components/common/ExploreIcon";
import ProductListItem from "../../../components/product/ProductListItem";
import { getErrorMessage } from "@/services/apiError";
import {
  fetchClosingSoonAuctions,
  fetchPopularAuctions,
} from "@/services/auction/list/service";
import type { AuctionListItemViewModel } from "@/services/auction/list/types";
import { fetchPopularRegularProducts } from "@/services/product/popular/service";
import { fetchHotRegularProducts } from "@/services/product/hotList/service";
import type { PopularProductItemViewModel } from "@/services/product/popular/types";

type PopularHomeItem = PopularProductItemViewModel | AuctionListItemViewModel;

function isAuctionHomeItem(
  item: PopularHomeItem,
): item is AuctionListItemViewModel {
  return "auctionId" in item;
}

export default function HomeScreen({
  onProductClick,
  onProductListClick,
  onNotificationClick,
  onCategoryResetClick,
  onSearchClick,
  onWishlistClick,
  mode,
  onModeChange,
  onTabChange,
}: {
  onProductClick: (id: number) => void;
  onProductListClick: (
    type: "all" | "closing_soon" | "recent",
    category?: string,
  ) => void;
  onNotificationClick: () => void;
  onCategoryResetClick: () => void;
  onSearchClick: () => void;
  onWishlistClick: () => void;
  mode: "regular" | "auction";
  onModeChange: (mode: "regular" | "auction") => void;
  onTabChange: (tab: Tab) => void;
}) {
  const themeColor = mode === "regular" ? "#98E446" : "#F64257";
  const logoUrl =
    mode === "regular"
      ? "https://i.ibb.co/FLydFL1L/2026-03-22-201249.png"
      : "https://i.ibb.co/6RrSfG14/image.png";

  const [currentBanner, setCurrentBanner] = useState(0);
  const [popularProducts, setPopularProducts] = useState<PopularHomeItem[]>(
    [],
  );
  const [isPopularLoading, setIsPopularLoading] = useState(false);
  const [popularErrorMessage, setPopularErrorMessage] = useState("");
  const [hotProducts, setHotProducts] = useState<any[]>([]);
  const [isHotLoading, setIsHotLoading] = useState(false);
  const [hotErrorMessage, setHotErrorMessage] = useState("");
  const banners =
    mode === "regular"
      ? [
          {
            title: "즐거운 일반 거래",
            subtitle: "좋은 상품을 합리적인 가격에",
            image:
              "https://images.unsplash.com/photo-1500622944204-b135684e99fd?q=80&w=2061&auto=format&fit=crop",
          },
          {
            title: "새로운 상품 업데이트",
            subtitle: "매일 만나는 새로운 보물",
            image:
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
          },
          {
            title: "안전한 직거래",
            subtitle: "우리 동네에서 만나는 믿을 수 있는 거래",
            image:
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
          },
        ]
      : [
          {
            title: "프리미엄 경매",
            subtitle: "가치 있는 상품을 한눈에",
            image:
              "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop",
          },
          {
            title: "실시간 인기 경매",
            subtitle: "지금 주목받는 경매 상품",
            image:
              "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop",
          },
          {
            title: "마감 임박 경매",
            subtitle: "놓치면 아쉬운 마지막 기회",
            image:
              "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=2070&auto=format&fit=crop",
          },
        ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    let ignore = false;

    setIsPopularLoading(true);
    setPopularErrorMessage("");

    const request =
      mode === "regular"
        ? fetchPopularRegularProducts(4)
        : fetchPopularAuctions(4);

    request
      .then((products) => {
        if (!ignore) {
          setPopularProducts(products);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setPopularProducts([]);
          setPopularErrorMessage(
            error instanceof TypeError
              ? mode === "regular"
                ? "실시간 인기 상품을 불러오지 못했습니다."
                : "실시간 인기 경매를 불러오지 못했습니다."
              : getErrorMessage(
                  error,
                  mode === "regular"
                    ? "실시간 인기 상품을 불러오지 못했습니다."
                    : "실시간 인기 경매를 불러오지 못했습니다.",
                ),
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsPopularLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [mode]);

  useEffect(() => {
    let ignore = false;

    setIsHotLoading(true);
    setHotErrorMessage("");

    const request =
      mode === "regular"
        ? fetchHotRegularProducts(8)
        : fetchClosingSoonAuctions(3);

    request
      .then((products) => {
        if (!ignore) {
          setHotProducts(products.slice(0, 3));
        }
      })
      .catch((error) => {
        if (!ignore) {
          setHotProducts([]);
          setHotErrorMessage(
            getErrorMessage(
              error,
              mode === "regular"
                ? "핫한 상품을 불러오지 못했습니다."
                : "마감 임박 경매를 불러오지 못했습니다.",
            ),
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsHotLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [mode]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-16 flex items-center px-4 justify-between bg-white z-30 shrink-0 border-b border-gray-50">
        <div className="flex items-center space-x-2">
          <img
            src={logoUrl}
            alt="Deal it"
            className="h-6 object-contain"
            referrerPolicy="no-referrer"
          />

          {/* Toggle Switch */}
          <div
            onClick={() =>
              onModeChange(mode === "regular" ? "auction" : "regular")
            }
            className="h-7 bg-gray-100 rounded-full relative cursor-pointer p-1 transition-colors flex items-center"
            style={{ width: "110px" }}
          >
            <motion.div
              animate={{ x: mode === "regular" ? 0 : 48 }}
              className="h-5 rounded-full shadow-sm flex items-center justify-center px-2"
              style={{ backgroundColor: themeColor, width: "54px" }}
            >
              <span
                className="text-[9px] font-black whitespace-nowrap transition-colors duration-300"
                style={{ color: mode === "regular" ? "#000000" : "#FFFFFF" }}
              >
                {mode === "regular" ? "일반상품" : "Dealit"}
              </span>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSearchClick}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Search size={22} />
          </button>
          <button
            onClick={onNotificationClick}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors relative"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button
            onClick={onWishlistClick}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Heart size={22} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Banner Section */}
        <div className="relative h-48 overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${banners[currentBanner].image})`,
                }}
              >
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/20"></div>
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ backgroundColor: themeColor }}
                ></div>

                {/* Banner Text */}
                <div className="absolute inset-0 px-6 flex flex-col justify-center text-white z-10">
                  <motion.h2
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold leading-tight drop-shadow-md"
                  >
                    {banners[currentBanner].title}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-medium opacity-90 drop-shadow-sm"
                  >
                    {banners[currentBanner].subtitle}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Indicator */}
          <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold flex items-center space-x-1 z-20">
            <span>
              {currentBanner + 1} / {banners.length}
            </span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white p-6 space-y-10 relative z-20">
          {/* Section 1: Real-time Popular */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center space-x-1.5">
                <span className="text-xl">🔥</span>
                <span>
                  {mode === "regular" ? "실시간 인기" : "실시간 인기 경매"}
                </span>
              </h3>
              <button
                onClick={() => onProductListClick("all")}
                className="text-xs text-gray-400 flex items-center hover:text-gray-600 transition-colors"
              >
                전체목록보기 <ChevronRight size={14} />
              </button>
            </div>

            {isPopularLoading ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm font-medium text-gray-400">
                {mode === "regular"
                  ? "실시간 인기 상품을 불러오는 중입니다"
                  : "실시간 인기 경매를 불러오는 중입니다"}
              </div>
            ) : popularErrorMessage ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-red-100 bg-red-50 px-4 text-center text-sm font-medium text-red-500">
                {popularErrorMessage}
              </div>
            ) : popularProducts.length > 0 && mode === "regular" ? (
              <div className="flex space-x-4 pb-2">
                {popularProducts.slice(0, 4).map((product, index) => {
                  const regularProduct = product as PopularProductItemViewModel;
                  const rank = index + 1;

                  return (
                  <div
                    key={regularProduct.productId}
                    onClick={() => onProductClick(regularProduct.productId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onProductClick(regularProduct.productId);
                      }
                    }}
                    className="w-[140px] shrink-0 space-y-3 cursor-pointer group"
                  >
                    <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative">
                      {regularProduct.thumbnailUrl ? (
                        <img
                          src={regularProduct.thumbnailUrl}
                          alt={regularProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={28} />
                        </div>
                      )}
                      {rank <= 3 && (
                        <div
                          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            rank === 1
                              ? "bg-[#98E446] text-white"
                              : "bg-black/60 text-white"
                          }`}
                        >
                          {rank}등
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold truncate text-gray-800">
                        {regularProduct.name}
                      </h4>
                      <p className="font-bold text-base text-black">
                        {regularProduct.priceLabel}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium truncate">
                        {regularProduct.categoryName} · {regularProduct.location}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-400 font-medium">
                        <div className="flex items-center space-x-1 whitespace-nowrap">
                          <Eye size={10} />
                          <span>{regularProduct.viewCount}</span>
                        </div>
                        <div className="flex items-center space-x-1 whitespace-nowrap">
                          <TrendingUp size={10} />
                          <span>{regularProduct.popularScore.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : popularProducts.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                {popularProducts.map((product) => (
                  <div
                    key={product.productId}
                    onClick={() =>
                      onProductClick(
                        isAuctionHomeItem(product)
                          ? product.auctionId
                          : product.productId,
                      )
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onProductClick(
                          isAuctionHomeItem(product)
                            ? product.auctionId
                            : product.productId,
                        );
                      }
                    }}
                    className="w-[140px] shrink-0 space-y-3 cursor-pointer group"
                  >
                    <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative">
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={28} />
                        </div>
                      )}
                      {isAuctionHomeItem(product) && (
                        <div
                          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            product.rank === 1
                              ? "bg-red-500 text-white"
                              : "bg-black/60 text-white"
                          }`}
                        >
                          {product.rank}등
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold truncate text-gray-800">
                        {product.name}
                      </h4>
                      <p className="font-bold text-base text-black">
                        {isAuctionHomeItem(product)
                          ? product.currentPriceLabel
                          : product.priceLabel}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium truncate">
                        {product.categoryName} 쨌 {product.location}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-400 font-medium">
                        <div className="flex items-center space-x-1 whitespace-nowrap">
                          {isAuctionHomeItem(product) ? (
                            <>
                              <Clock size={10} />
                              <span>{product.endAtLabel}</span>
                            </>
                          ) : (
                            <>
                              <Eye size={10} />
                              <span>{product.viewCount}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 whitespace-nowrap">
                          <TrendingUp size={10} />
                          <span>{product.popularScore.toFixed(1)}</span>
                        </div>
                        {isAuctionHomeItem(product) && (
                          <div className="flex items-center space-x-1 whitespace-nowrap">
                            <span>입찰 {product.bidCount}회</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm font-medium text-gray-400">
                {mode === "regular"
                ? "등록된 일반 상품이 없습니다"
                  : "등록된 인기 경매가 없습니다"}
              </div>
            )}
          </div>

          {/* Section 2: Hot Items / Closing Soon */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center space-x-1.5">
                <span className="text-xl">
                  {mode === "regular" ? "🔥" : "⏰"}
                </span>
                <span>{mode === "regular" ? "핫한 상품" : "마감 임박"}</span>
              </h3>
              <button
                onClick={() => onProductListClick("closing_soon")}
                className="text-xs text-gray-400 flex items-center hover:text-gray-600 transition-colors"
              >
                더보기 <ChevronRight size={14} />
              </button>
            </div>

            {isHotLoading ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm font-medium text-gray-400">
                {mode === "regular"
                  ? "핫한 상품을 불러오는 중입니다"
                  : "마감 임박 경매를 불러오는 중입니다"}
              </div>
            ) : hotErrorMessage ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-red-100 bg-red-50 px-4 text-center text-sm font-medium text-red-500">
                {hotErrorMessage}
              </div>
            ) : hotProducts.length > 0 ? (
              <div className="space-y-4">
                {hotProducts.map((p) => (
                  <ProductListItem
                    key={p.productId}
                    product={p}
                    mode={mode}
                    themeColor={themeColor}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm font-medium text-gray-400">
                {mode === "regular"
                  ? "핫한 상품이 없습니다"
                  : "마감 임박 경매가 없습니다"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

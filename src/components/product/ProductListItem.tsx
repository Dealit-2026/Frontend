"use client";
import React, { useEffect, useState } from "react";
import {
  Clock,
  Gavel,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

import ConfirmModal from "../common/modal/ConfirmModal";
import {
  addRegularWishlist,
  removeRegularWishlist,
} from "@/services/wishlist/service";

export default function ProductListItem({
  i,
  product,
  mode,
  themeColor,
  onProductClick,
  initialLiked = false,
  onUnlike,
  onWishlistChange,
  onWishlistError,
  showWishlistButton = false,
}: {
  i?: number;
  product?: {
    productId: number;
    auctionId?: number;
    saleType?: "REGULAR" | "AUCTION";
    name?: string;
    thumbnailUrl?: string | null;
    priceLabel?: string;
    categoryName?: string;
    location?: string;
    viewCount?: number;
    favoriteCount?: number;
    chatCount?: number;
    hotScore?: number;
    bidCount?: number;
    currentPriceLabel?: string;
    startPriceLabel?: string;
    endAtLabel?: string;
    auctionStatusLabel?: string;
    popularScore?: number;
    rank?: number;
    createdAt?: string;
    recentViewedLabel?: string;
    canFavorite?: boolean;
  };
  mode: "regular" | "auction";
  themeColor: string;
  onProductClick: (id: number) => void;
  initialLiked?: boolean;
  onUnlike?: () => void;
  onWishlistChange?: (productId: number, liked: boolean, favoriteCount: number) => void;
  onWishlistError?: (message: string) => void;
  showWishlistButton?: boolean;
  key?: string | number;
}) {
  const useData = product !== undefined && product !== null;
  const productId = useData ? product!.productId : (i ?? 0) + 10;
  const clickTargetId =
    mode === "auction" && useData && product!.auctionId != null
      ? product!.auctionId
      : productId;
  const thumbnailUrl = useData
    ? product!.thumbnailUrl
    : `https://picsum.photos/seed/hot${i}${mode}/200/200`;
  const name = useData ? (product!.name ?? "상품") : "맥북 에어 M2";
  const priceLabel = useData
    ? (product!.priceLabel ?? "₩1,200,000")
    : "₩1,200,000";
  const chatCount = useData ? (product!.chatCount ?? 0) : 0;
  const bidCount = useData ? (product!.bidCount ?? 0) : 0;
  const rank = useData ? (product!.rank ?? null) : null;
  const recentViewedLabel = useData ? product!.recentViewedLabel : undefined;
  const isTopRank = rank === 1;
  const showRankLabel = rank != null && rank >= 1 && rank <= 3;

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isWishlistSubmitting, setIsWishlistSubmitting] = useState(false);
  const [displayFavoriteCount, setDisplayFavoriteCount] = useState(
    product?.favoriteCount ?? 132,
  );

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    if (useData) {
      setDisplayFavoriteCount(product!.favoriteCount ?? 0);
    } else {
      setDisplayFavoriteCount(132);
    }
  }, [useData, product?.favoriteCount]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isWishlistSubmitting) {
      return;
    }

    if (isLiked && onUnlike) {
      setShowConfirm(true);
      return;
    }

    if (!useData) {
      setIsLiked(!isLiked);
      setDisplayFavoriteCount((currentCount) =>
        isLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
      );
      return;
    }

    if (product?.canFavorite === false && !isLiked) {
      return;
    }

    setIsWishlistSubmitting(true);

    const previousLiked = isLiked;
    const previousFavoriteCount = displayFavoriteCount;
    const optimisticLiked = !isLiked;
    const optimisticFavoriteCount = optimisticLiked
      ? displayFavoriteCount + 1
      : Math.max(0, displayFavoriteCount - 1);

    setIsLiked(optimisticLiked);
    setDisplayFavoriteCount(optimisticFavoriteCount);
    onWishlistChange?.(productId, optimisticLiked, optimisticFavoriteCount);

    try {
      const result = isLiked
        ? await removeRegularWishlist(productId)
        : await addRegularWishlist(productId);

      setIsLiked(result.liked);
      setDisplayFavoriteCount(result.favoriteCount);
      onWishlistChange?.(productId, result.liked, result.favoriteCount);
    } catch (error) {
      setIsLiked(previousLiked);
      setDisplayFavoriteCount(previousFavoriteCount);
      onWishlistChange?.(productId, previousLiked, previousFavoriteCount);
      onWishlistError?.(
        error instanceof Error && error.message.trim()
          ? error.message
          : "찜 처리에 실패했습니다.",
      );
    } finally {
      setIsWishlistSubmitting(false);
    }
  };

  if (mode === "auction") {
    const currentPriceLabel = useData
      ? (product!.currentPriceLabel ?? priceLabel)
      : priceLabel;
    const endAtLabel = useData ? (product!.endAtLabel ?? "마감 시간 없음") : "마감 임박";
    const auctionStatusLabel = useData
      ? (product!.auctionStatusLabel ?? "진행중")
      : "진행중";

    return (
      <div
        onClick={() => onProductClick(clickTargetId)}
        className="flex items-center space-x-4 p-3 bg-white border border-gray-50 rounded-2xl hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageIcon size={28} />
            </div>
          )}
          <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
            {auctionStatusLabel}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-sm truncate text-gray-800">{name}</h4>
            <div className="flex shrink-0 items-center gap-1">
              {showRankLabel && (
                <div
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isTopRank
                      ? "bg-red-50 text-red-500"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {rank}위
                </div>
              )}
              {showWishlistButton && (
                <button
                  onClick={handleLikeClick}
                  disabled={isWishlistSubmitting}
                  className="p-1 disabled:opacity-50"
                  aria-label="찜하기"
                >
                  <Heart
                    size={16}
                    fill={isLiked ? "#FF3B30" : "none"}
                    color={isLiked ? "#FF3B30" : "#D1D5DB"}
                  />
                </button>
              )}
            </div>
          </div>

          {showWishlistButton && (
            <div className="flex items-center space-x-1 text-[10px] text-gray-400 font-medium">
              <Heart size={10} />
              <span>{displayFavoriteCount}</span>
            </div>
          )}

          <p className="text-xs text-gray-500 font-medium">
            현재 입찰가{" "}
            <span className="text-sm font-bold text-black ml-1">
              {currentPriceLabel}
            </span>
          </p>

          <p className="text-[10px] text-gray-400 font-medium truncate">
            {product?.categoryName ?? "카테고리 없음"} ·{" "}
            {product?.location ?? "지역 정보 없음"}
          </p>

          {recentViewedLabel && (
            <p className="text-[10px] font-medium text-gray-400">
              {recentViewedLabel}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-400 font-medium">
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <Gavel size={10} />
              <span>입찰 {bidCount}회</span>
            </div>
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <Clock size={10} />
              <span>{endAtLabel}</span>
            </div>
            {product?.popularScore != null && (
              <div className="flex items-center space-x-1 whitespace-nowrap">
                <TrendingUp size={10} />
                <span>{product.popularScore.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => onProductClick(productId)}
        className="flex items-center space-x-4 p-3 bg-white border border-gray-50 rounded-2xl hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageIcon size={28} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-sm truncate text-gray-800">{name}</h4>
            <button
              onClick={handleLikeClick}
              disabled={isWishlistSubmitting}
              className="p-1 disabled:opacity-50"
              aria-label="찜하기"
            >
              <Heart
                size={16}
                fill={isLiked ? "#FF3B30" : "none"}
                color={isLiked ? "#FF3B30" : "#D1D5DB"}
              />
            </button>
          </div>

          <p className="text-xs text-gray-500 font-medium">
            판매가{" "}
            <span className="text-sm font-bold text-black ml-1">
              {priceLabel}
            </span>
          </p>

          {recentViewedLabel && (
            <p className="text-[10px] font-medium text-gray-400">
              {recentViewedLabel}
            </p>
          )}

          <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-medium">
            <div className="flex items-center space-x-1">
              <Heart size={10} />
              <span>{displayFavoriteCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={10} />
              <span>{chatCount}</span>
            </div>
            {showRankLabel && (
              <div
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isTopRank
                    ? "bg-amber-50 text-amber-600"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                {rank}위
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          if (onUnlike) onUnlike();
          setIsLiked(false);
        }}
        message="해당 상품을 찜 목록에서 제외하시겠습니까?"
        themeColor={themeColor}
      />
    </>
  );
}

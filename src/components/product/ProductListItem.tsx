"use client";
import React, { useEffect, useState } from "react";
import { Heart, Image as ImageIcon, MessageCircle } from "lucide-react";

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
}: {
  i?: number;
  product?: {
    productId: number;
    name?: string;
    thumbnailUrl?: string | null;
    priceLabel?: string;
    categoryName?: string;
    location?: string;
    viewCount?: number;
    favoriteCount?: number;
    chatCount?: number;
    hotScore?: number;
    rank?: number;
    createdAt?: string;
    canFavorite?: boolean;
  };
  mode: "regular" | "auction";
  themeColor: string;
  onProductClick: (id: number) => void;
  initialLiked?: boolean;
  onUnlike?: () => void;
  key?: string | number;
}) {
  const useData = product !== undefined && product !== null;
  const productId = useData ? product!.productId : (i ?? 0) + 10;
  const thumbnailUrl = useData
    ? product!.thumbnailUrl
    : `https://picsum.photos/seed/hot${i}${mode}/200/200`;
  const name = useData ? (product!.name ?? "상품") : "맥북 에어 M2";
  const priceLabel = useData
    ? (product!.priceLabel ?? "₩1,200,000")
    : "₩1,200,000";
  const chatCount = useData ? (product!.chatCount ?? 0) : 0;
  const rank = useData ? (product!.rank ?? null) : null;
  const isTopRank = rank === 1;
  const showRankLabel = rank != null && rank >= 1 && rank <= 3;

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isWishlistSubmitting, setIsWishlistSubmitting] = useState(false);
  const [displayFavoriteCount, setDisplayFavoriteCount] = useState(
    product?.favoriteCount ?? 132,
  );

  if (mode === "auction") {
    return null;
  }

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

    try {
      const result = isLiked
        ? await removeRegularWishlist(productId)
        : await addRegularWishlist(productId);

      setIsLiked(result.liked);
      setDisplayFavoriteCount(result.favoriteCount);
    } finally {
      setIsWishlistSubmitting(false);
    }
  };

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
              className="p-1"
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

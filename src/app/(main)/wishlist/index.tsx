"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Heart,
  Image as ImageIcon,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import {
  fetchMyWishlist,
  removeWishlist,
} from "@/services/wishlist/service";
import type { WishlistItemViewModel } from "@/services/wishlist/types";

export default function WishlistScreen({
  onBack,
  onProductClick,
  onAuctionClick,
  themeColor,
}: {
  onBack: () => void;
  onProductClick: (id: number) => void;
  onAuctionClick?: (id: number) => void;
  themeColor: string;
  key?: string;
}) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItemViewModel[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [removingProductId, setRemovingProductId] = useState<number | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setErrorMessage("");

    fetchMyWishlist()
      .then((items) => {
        if (!ignore) {
          setWishlistItems(items);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setWishlistItems([]);
          setErrorMessage(
            getErrorMessage(error, "찜 목록을 불러오지 못했습니다."),
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
  }, []);

  const handleItemClick = (item: WishlistItemViewModel) => {
    if (item.itemType === "AUCTION" && item.auctionId != null) {
      onAuctionClick?.(item.auctionId);
      return;
    }

    onProductClick(item.productId);
  };

  const handleUnlike = async (productId: number) => {
    if (removingProductId !== null) {
      return;
    }

    setRemovingProductId(productId);
    setErrorMessage("");

    try {
      await removeWishlist(productId);
      setWishlistItems((currentItems) =>
        currentItems.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "찜 취소에 실패했습니다."));
    } finally {
      setRemovingProductId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full min-h-0 flex-1 flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-50 sticky top-0 bg-white z-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">찜목록</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {errorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-400 space-y-4 h-[400px]">
            <Heart size={48} className="opacity-20" />
            <p>찜한 상품을 불러오는 중입니다.</p>
          </div>
        ) : wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <div
              key={`${item.itemType}-${item.productId}`}
              onClick={() => handleItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleItemClick(item);
                }
              }}
              className="flex items-center space-x-4 p-3 bg-white border border-gray-50 rounded-2xl hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={28} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-sm truncate text-gray-800">
                    {item.name}
                  </h4>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void handleUnlike(item.productId);
                    }}
                    disabled={removingProductId === item.productId}
                    className="p-1 disabled:opacity-50"
                    aria-label="찜 취소"
                  >
                    <Heart size={16} fill="#FF3B30" color="#FF3B30" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {item.itemType === "AUCTION" ? "현재가" : "판매가"}{" "}
                  <span className="text-sm font-bold text-black ml-1">
                    {item.priceLabel}
                  </span>
                </p>
                <p className="text-[10px] text-gray-400 font-medium truncate">
                  {item.categoryName} · {item.location}
                </p>
                <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-medium">
                  <div className="flex items-center space-x-1">
                    <Heart size={10} />
                    <span>{item.favoriteCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={10} />
                    <span>{item.metaLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 space-y-4 h-[400px]">
            <Heart size={48} className="opacity-20" />
            <p>찜한 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

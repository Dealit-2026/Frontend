"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MoreVertical,
  ShoppingBag,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import {
  fetchAuctionDetail,
  getAuctionDisplayCurrentPrice,
  getAuctionMainImageUrl,
  getAuctionRemainingTimeLabel,
  placeAuctionBid,
} from "@/services/auction/detail/service";
import type { AuctionDetailResponse } from "@/services/auction/detail/types";
import * as productDetailService from "@/services/product/productDetail/service";
import type { ProductDetailResponse } from "@/services/product/productDetail/types";
import {
  addRegularWishlist,
  fetchRegularWishlist,
  removeRegularWishlist,
} from "@/services/wishlist/service";

type AuctionStatus =
  | "AUCTION_SCHEDULED"
  | "AUCTION_LIVE"
  | "AUCTION_ENDED"
  | "ENDED";

interface ProductDetailScreenProps {
  productId: number | null;
  productData?: ProductDetailResponse;
  onBack: () => void;
  onBidStatusClick?: () => void;
  onChatClick: () => void;
  onReportClick: () => void;
  onBidComplete?: (data: {
    productId: number;
    productName: string;
    sellerName: string;
    bidAmount: number;
    remainingTime: string;
    productImageUrl?: string | null;
  }) => void;
  onPurchaseClick?: () => void;
  themeColor: string;
  mode?: "regular" | "auction";
  auctionStatus?: AuctionStatus;
  auctionStartAt?: string;
  showToast: (msg: string) => void;
}

function formatRemainingTime(remainingMs: number) {
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) {
    return "경매 종료";
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남음`;
  }

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${seconds}초 남음`;
  }

  if (minutes > 0) {
    return `${minutes}분 ${seconds}초 남음`;
  }

  return `${seconds}초 남음`;
}

function formatScheduleLabel(value?: string) {
  if (!value) {
    return "시작 시간이 확정되면 안내될 예정이에요.";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export default function ProductDetailScreen({
  productId,
  productData,
  onBack,
  onBidStatusClick = () => {},
  onChatClick,
  onReportClick,
  onPurchaseClick,
  themeColor,
  mode = "regular",
  auctionStatus = "AUCTION_LIVE",
  auctionStartAt,
  showToast,
  onBidComplete = () => {},
}: ProductDetailScreenProps) {
  const [showBidSheet, setShowBidSheet] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState(false);
  const [isWishlistSubmitting, setIsWishlistSubmitting] = useState(false);
  const [auctionDetail, setAuctionDetail] =
    useState<AuctionDetailResponse | null>(null);
  const [isAuctionLoading, setIsAuctionLoading] = useState(false);
  const [isBidSubmitting, setIsBidSubmitting] = useState(false);
  const [auctionErrorMessage, setAuctionErrorMessage] = useState("");
  const [currentTimeMs, setCurrentTimeMs] = useState(() => Date.now());
  const [auctionClockOffsetMs, setAuctionClockOffsetMs] = useState(0);

  const resolvedMode =
    productData?.saleType === "AUCTION" ? "auction" : mode;
  const isRegular = resolvedMode === "regular";
  const regularPrice = productData
    ? productDetailService.getProductPrice(productData)
    : null;
  const [currentPrice, setCurrentPrice] = useState(regularPrice ?? 0);
  const [bidCount, setBidCount] = useState(productData?.auction?.bidCount ?? 0);
  const [inputBidAmount, setInputBidAmount] = useState(
    (regularPrice ?? 0) + 10000,
  );

  const effectiveAuctionStatus = auctionDetail?.status ?? auctionStatus;
  const isAuctionScheduled =
    !isRegular && effectiveAuctionStatus === "AUCTION_SCHEDULED";
  const auctionRemainingMs = auctionDetail
    ? new Date(auctionDetail.endsAt).getTime() -
      (currentTimeMs + auctionClockOffsetMs)
    : Number.POSITIVE_INFINITY;
  const hasAuctionTimeEnded = !isRegular && auctionRemainingMs <= 0;
  const isAuctionEnded =
    !isRegular &&
    (effectiveAuctionStatus === "AUCTION_ENDED" ||
      effectiveAuctionStatus === "ENDED" ||
      hasAuctionTimeEnded);
  const bidUnit = auctionDetail?.minimumBidAmount ?? 10000;
  const minBidAmount =
    auctionDetail?.minimumNextBidPrice ?? currentPrice + bidUnit;

  const displayName = auctionDetail?.name ?? productData?.name ?? "상품 정보 없음";
  const displayDescription =
    auctionDetail?.description ??
    productData?.description ??
    "상품 설명이 없습니다.";
  const displayImageUrl = !isRegular
    ? getAuctionMainImageUrl(auctionDetail)
    : productData?.imageUrls?.[0] ?? null;
  const displayCategoryName =
    auctionDetail?.categoryName ??
    productData?.category?.nameKo ??
    "카테고리 없음";
  const displaySellerName =
    auctionDetail?.seller.nickname ??
    productData?.seller?.nickname ??
    "판매자 정보 없음";
  const displaySellerImageUrl =
    auctionDetail?.seller.profileImageUrl ??
    "https://picsum.photos/seed/seller/100/100";
  const displayLocation =
    auctionDetail?.location ?? productData?.seller?.location ?? "지역 정보 없음";
  const displayStatus = productData?.status ?? "정보 없음";
  const resolvedViewCount = productData
    ? productDetailService.getViewCount(productData)
    : 0;
  const resolvedFavoriteCount = productData
    ? productDetailService.getFavoriteCount(productData)
    : 0;
  const [favoriteCount, setFavoriteCount] = useState(resolvedFavoriteCount);
  const resolvedChatCount = productData
    ? productDetailService.getChatCount(productData)
    : 0;
  const displayEndLabel = auctionDetail
    ? formatRemainingTime(auctionRemainingMs)
    : "정보 없음";
  const scheduledStartLabel = formatScheduleLabel(auctionStartAt);

  // 새롭게 추가된 판매자 프로필용 변수 (API 연동 전 임시 데이터)
  const displaySellerBio = "좋은 거래 부탁드려요.";
  const displaySellerRating = "4.8";
  const displaySellerWarning = "0회";
  const displaySellerAddress = displayLocation;
  const sellerRecentSales: Array<{ title: string; price: string; status: string }> = [
    // 필요 시 여기에 더미 데이터를 추가할 수 있습니다.
  ];

  useEffect(() => {
    if (regularPrice != null) {
      setCurrentPrice(regularPrice);
      setInputBidAmount(regularPrice + 10000);
    }
  }, [regularPrice]);

  useEffect(() => {
    setFavoriteCount(resolvedFavoriteCount);
  }, [resolvedFavoriteCount]);

  useEffect(() => {
    if (!isRegular || productId == null) {
      setIsLiked(false);
      return;
    }

    let ignore = false;

    fetchRegularWishlist()
      .then((items) => {
        if (!ignore) {
          setIsLiked(items.some((item) => item.productId === productId));
        }
      })
      .catch(() => {
        if (!ignore) {
          setIsLiked(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isRegular, productId]);

  useEffect(() => {
    if (showBidSheet) {
      setInputBidAmount(minBidAmount);
    }
  }, [showBidSheet, minBidAmount]);

  useEffect(() => {
    if (isRegular) {
      return;
    }

    const timerId = window.setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isRegular]);

  useEffect(() => {
    if (isRegular || productId == null) {
      return;
    }

    let ignore = false;
    setIsAuctionLoading(true);
    setAuctionErrorMessage("");

    fetchAuctionDetail(productId)
      .then((data) => {
        if (ignore) {
          return;
        }

        setAuctionDetail(data);
        setAuctionClockOffsetMs(
          new Date(data.serverTime).getTime() - Date.now(),
        );
        setCurrentPrice(getAuctionDisplayCurrentPrice(data));
        setBidCount(data.bidCount);
        setInputBidAmount(data.minimumNextBidPrice);
      })
      .catch((error) => {
        if (!ignore) {
          setAuctionErrorMessage(
            getErrorMessage(error, "경매 상품 정보를 불러오지 못했습니다."),
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsAuctionLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isRegular, productId]);

  const handleBidSubmit = async (bidPrice: number) => {
    if (isRegular || productId == null || isBidSubmitting) {
      return;
    }

    if (bidPrice < minBidAmount) {
      showToast(`최소 입찰가는 ${minBidAmount.toLocaleString()}원입니다.`);
      return;
    }

    try {
      setIsBidSubmitting(true);
      await placeAuctionBid(productId, bidPrice);
      const nextAuctionDetail = await fetchAuctionDetail(productId);

      setAuctionDetail(nextAuctionDetail);
      setAuctionClockOffsetMs(
        new Date(nextAuctionDetail.serverTime).getTime() - Date.now(),
      );
      setCurrentPrice(getAuctionDisplayCurrentPrice(nextAuctionDetail));
      setBidCount(nextAuctionDetail.bidCount);
      setInputBidAmount(nextAuctionDetail.minimumNextBidPrice);
      setShowBidSheet(false);
      onBidComplete({
        productId,
        productName: nextAuctionDetail.name,
        sellerName: nextAuctionDetail.seller.nickname,
        bidAmount: bidPrice,
        remainingTime: getAuctionRemainingTimeLabel(
          nextAuctionDetail.endsAt,
          nextAuctionDetail.serverTime,
        ),
        productImageUrl: getAuctionMainImageUrl(nextAuctionDetail),
      });
    } catch (error) {
      showToast(getErrorMessage(error, "입찰에 실패했습니다."));
    } finally {
      setIsBidSubmitting(false);
    }
  };

  const handleWishlistClick = async () => {
    if (!isRegular || productId == null || isWishlistSubmitting) {
      return;
    }

    if (!productData?.canFavorite && !isLiked) {
      showToast("찜할 수 없는 상품입니다.");
      return;
    }

    setIsWishlistSubmitting(true);

    try {
      const result = isLiked
        ? await removeRegularWishlist(productId)
        : await addRegularWishlist(productId);

      setIsLiked(result.liked);
      setFavoriteCount(result.favoriteCount);
      showToast(result.liked ? "찜 목록에 추가했습니다." : "찜을 취소했습니다.");
    } catch (error) {
      showToast(getErrorMessage(error, "찜 처리에 실패했습니다."));
    } finally {
      setIsWishlistSubmitting(false);
    }
  };

  if (!isRegular && (isAuctionLoading || auctionErrorMessage)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex-1 flex flex-col bg-white"
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center font-bold text-lg mr-10">
            경매 상품
          </h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400 space-y-3 text-center">
          <ShoppingBag size={56} className="opacity-20" />
          <p className="text-sm font-medium">
            {auctionErrorMessage || "경매 상품 정보를 불러오는 중입니다"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex-1 flex flex-col relative h-full overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center px-4 justify-between z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex space-x-2">
          {isRegular && (
            <button
              onClick={handleWishlistClick}
              disabled={isWishlistSubmitting}
              className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm disabled:opacity-60"
              aria-label={isLiked ? "찜 취소" : "찜 추가"}
            >
              <Heart
                size={20}
                fill={isLiked ? "#FF3B30" : "none"}
                color={isLiked ? "#FF3B30" : "currentColor"}
              />
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
            >
              <MoreVertical size={20} />
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-12 w-32 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    onReportClick();
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-gray-50"
                >
                  신고하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="aspect-square bg-gray-100">
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageIcon size={56} />
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span
                className="px-2 py-1 text-white text-[10px] font-bold rounded"
                style={{ backgroundColor: themeColor }}
              >
                {isRegular
                  ? "일반 판매"
                  : isAuctionEnded
                    ? "경매 종료"
                    : isAuctionScheduled
                      ? "경매 예정"
                      : "진행중"}
              </span>
              <span className="text-xs text-gray-400">
                {displayCategoryName}
              </span>
            </div>
            <h2 className="text-xl font-bold">{displayName}</h2>

            <div
              className={`rounded-2xl p-6 space-y-2 transition-transform active:scale-[0.98] ${
                !isRegular ? "cursor-pointer hover:brightness-95" : ""
              }`}
              style={{ backgroundColor: `${themeColor}10` }}
              onClick={() =>
                !isRegular &&
                !isAuctionScheduled &&
                !isAuctionEnded &&
                onBidStatusClick()
              }
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: themeColor }}
                >
                  {isRegular ? "판매가" : "현재가"}
                </span>
                <div className="flex items-center space-x-1">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: themeColor }}
                  >
                    ₩{currentPrice.toLocaleString()}
                  </span>
                  {!isRegular && !isAuctionScheduled && !isAuctionEnded && (
                    <ChevronRight size={20} style={{ color: themeColor }} />
                  )}
                </div>
              </div>

              {isRegular ? (
                <div className="flex items-center space-x-4 text-xs text-gray-400 pt-1">
                  <div className="flex items-center space-x-1">
                    <Eye size={12} />
                    <span>조회 {resolvedViewCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={12} />
                    <span>채팅 {resolvedChatCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart size={12} />
                    <span>찜 {favoriteCount}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      {isAuctionScheduled
                        ? "입찰은 시작 후 가능해요"
                        : `입찰 ${bidCount}회`}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>
                        {isAuctionScheduled
                          ? scheduledStartLabel
                          : displayEndLabel}
                      </span>
                    </div>
                  </div>
                  {(isAuctionScheduled || isAuctionEnded) && (
                    <p
                      className="text-xs font-medium pt-1"
                      style={{ color: themeColor }}
                    >
                      {isAuctionScheduled
                        ? "아직 시작 전인 경매입니다. 시작 시간 이후 참여할 수 있어요."
                        : "종료된 경매입니다."}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div
            className="flex items-center justify-between py-4 border-y border-gray-50 cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded-xl transition-colors"
            onClick={() => setShowSellerProfile(true)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                <img src={displaySellerImageUrl} alt="Seller" />
              </div>
              <div>
                <p className="font-bold text-sm">{displaySellerName}</p>
                <div className="flex items-center space-x-1 text-[10px] text-gray-400">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span>4.8 (거래 34회)</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium">
              프로필
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">상품 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">상태</span>
                <span>{displayStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">거래지역</span>
                <span>{displayLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">배송비</span>
                <span>정보 없음</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pt-2">
              {displayDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white border-t border-gray-100 flex items-center px-6 space-x-3">
        <button
          onClick={onChatClick}
          className="w-14 h-14 bg-gray-100 text-gray-900 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
        {isRegular ? (
          <button
            onClick={onPurchaseClick}
            className="flex-1 h-14 text-white font-bold rounded-xl transition-colors shadow-lg"
            style={{ backgroundColor: themeColor }}
          >
            구매하기
          </button>
        ) : (
          <button
            onClick={() =>
              !isAuctionScheduled && !isAuctionEnded && setShowBidSheet(true)
            }
            disabled={isAuctionScheduled || isAuctionEnded}
            className={`flex-1 h-14 font-bold rounded-xl transition-colors ${
              isAuctionScheduled || isAuctionEnded
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-white shadow-lg"
            }`}
            style={
              isAuctionScheduled || isAuctionEnded
                ? undefined
                : ({ backgroundColor: themeColor } as React.CSSProperties)
            }
          >
            {isAuctionEnded
              ? "경매 종료"
              : isAuctionScheduled
                ? "입찰은 시작 후 가능해요"
                : "입찰하기"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showBidSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBidSheet(false)}
              className="absolute inset-0 bg-black/50 z-20"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-30 p-8 space-y-8"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
              <div className="space-y-6">
                <h3 className="text-xl font-bold">입찰하기</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">현재가</span>
                    <span className="font-bold">
                      ₩{currentPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">입찰 단위</span>
                    <span className="font-bold">
                      ₩{bidUnit.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">입찰가 입력</label>
                    <input
                      type="number"
                      value={inputBidAmount}
                      onChange={(event) =>
                        setInputBidAmount(Number(event.target.value))
                      }
                      className="w-full h-14 bg-gray-100 rounded-xl px-5 font-bold outline-none"
                      placeholder="입찰가 입력"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">
                    최소 입찰가: ₩{minBidAmount.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBidSubmit(currentPrice + 30000)}
                    disabled={isBidSubmitting || currentPrice + 30000 < minBidAmount}
                    className="h-12 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    ₩{(currentPrice + 30000).toLocaleString()}
                  </button>
                  <button
                    onClick={() => handleBidSubmit(minBidAmount)}
                    disabled={isBidSubmitting}
                    className="h-12 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    ₩{minBidAmount.toLocaleString()}
                  </button>
                </div>

                <button
                  disabled={isBidSubmitting || inputBidAmount < minBidAmount}
                  onClick={() => handleBidSubmit(inputBidAmount)}
                  className="w-full h-14 text-white font-bold rounded-xl transition-all shadow-lg disabled:bg-gray-300 disabled:opacity-50"
                  style={{
                    backgroundColor:
                      inputBidAmount < minBidAmount ? undefined : themeColor,
                  }}
                >
                  {isBidSubmitting ? "입찰 중..." : "입찰하기"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Seller Profile Modal */}
      <AnimatePresence>
        {showSellerProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSellerProfile(false)}
              className="absolute inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-50 p-8 space-y-6"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2"></div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
                  <img
                    src={displaySellerImageUrl}
                    alt="Seller"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{displaySellerName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {displaySellerBio}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">거래 별점</span>
                  <div className="flex items-center space-x-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-bold">{displaySellerRating}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">경고 횟수</span>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-bold">{displaySellerWarning}</span>
                  </div>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-xs text-gray-400">주소지</span>
                  <p className="font-bold text-sm">{displaySellerAddress}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm">상대 판매내역 (최근 3건)</h4>
                <div className="space-y-2">
                  {sellerRecentSales.length === 0 ? (
                    <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-500">
                      정보없음
                    </div>
                  ) : (
                    sellerRecentSales.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <span className="text-sm font-medium text-gray-800">
                          {item.title}
                        </span>
                        <div className="text-right">
                          <p className="text-xs font-bold">{item.price}</p>
                          <p
                            className={`text-[10px] ${item.status === "판매완료" ? "text-gray-400" : "text-blue-500"}`}
                          >
                            {item.status}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowSellerProfile(false)}
                className="w-full h-14 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors mt-4"
              >
                닫기
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

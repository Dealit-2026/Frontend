"use client";

import { useEffect, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { ChevronLeft, Clock, EyeOff, Image as ImageIcon, RefreshCw, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import {
  fetchMyBuyingAuctions,
  hideMyBuyingAuction,
} from "@/services/buying-auction/service";
import type { BuyingAuctionViewModel } from "@/services/buying-auction/types";

export default function MyBidsScreen({
  onBack,
  onProductClick,
  themeColor,
  showToast,
}: {
  onBack: () => void;
  onProductClick: (id: number) => void;
  themeColor: string;
  showToast?: (message: string) => void;
  key?: string;
}) {
  const [bids, setBids] = useState<BuyingAuctionViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hidingAuctionId, setHidingAuctionId] = useState<number | null>(null);

  const loadBids = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage("");

    try {
      const result = await fetchMyBuyingAuctions();
      setBids(result.items);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "구매중 경매 목록을 불러오지 못했습니다."),
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadBids();
  }, []);

  const handleHideEndedAuction = async (
    event: MouseEvent<HTMLButtonElement>,
    auction: BuyingAuctionViewModel,
  ) => {
    event.stopPropagation();

    if (!auction.canHide || hidingAuctionId) {
      return;
    }

    setHidingAuctionId(auction.auctionId);

    try {
      await hideMyBuyingAuction(auction.auctionId);
      setBids((currentBids) =>
        currentBids.filter((bid) => bid.auctionId !== auction.auctionId),
      );
      showToast?.("종료된 경매를 구매중 목록에서 숨겼습니다.");
    } catch (error) {
      showToast?.(
        getErrorMessage(error, "종료된 경매 숨김 처리에 실패했습니다."),
      );
    } finally {
      setHidingAuctionId(null);
    }
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    auction: BuyingAuctionViewModel,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onProductClick(auction.auctionId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col relative bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">구매중 경매</h1>
        <button
          type="button"
          onClick={() => loadBids(true)}
          disabled={isRefreshing}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:cursor-wait"
          aria-label="새로고침"
        >
          <RefreshCw
            size={20}
            className={isRefreshing ? "animate-spin text-gray-400" : ""}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
        {errorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-3">
            <RefreshCw size={36} className="animate-spin opacity-40" />
            <p className="text-sm font-medium">구매중 경매를 불러오는 중입니다</p>
          </div>
        ) : bids.length > 0 ? (
          bids.map((bid) => (
            <div
              key={bid.auctionId}
              role="button"
              tabIndex={0}
              onClick={() => onProductClick(bid.auctionId)}
              onKeyDown={(event) => handleCardKeyDown(event, bid)}
              className="w-full p-4 bg-white border border-gray-100 rounded-2xl flex items-start space-x-4 hover:border-gray-200 transition-all text-left"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
                {bid.imageUrl ? (
                  <img
                    src={bid.imageUrl}
                    alt={bid.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={24} className="text-gray-300" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                        style={{ backgroundColor: "#F64257" }}
                      >
                        경매
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 truncate">
                        {bid.categoryName}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm truncate">{bid.name}</h4>
                  </div>

                  <div className="flex items-center space-x-1 text-[10px] font-bold shrink-0">
                    <Clock size={10} className="text-gray-400" />
                    <span
                      className={
                        bid.status === "ENDED" ? "text-gray-400" : "text-red-500"
                      }
                    >
                      {bid.timeLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400">현재 최고가</p>
                    <p className="font-black text-sm">{bid.currentPriceLabel}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-[10px] text-gray-400">내 입찰가</p>
                    <p
                      className={`font-black text-sm ${
                        bid.status === "LEADING"
                          ? "text-blue-600"
                          : bid.status === "OUTBID"
                            ? "text-red-500"
                            : "text-gray-500"
                      }`}
                    >
                      {bid.myBidPriceLabel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center ${bid.statusClassName}`}
                  >
                    {bid.statusLabel}
                  </div>
                  {bid.canHide && (
                    <button
                      type="button"
                      onClick={(event) => handleHideEndedAuction(event, bid)}
                      disabled={hidingAuctionId === bid.auctionId}
                      className="h-7 px-2 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-500 hover:bg-gray-200 disabled:cursor-wait flex items-center gap-1"
                    >
                      <EyeOff size={12} />
                      삭제
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-gray-400">
                  {bid.bidCountLabel} · {bid.location}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
            <TrendingUp size={48} className="opacity-20" />
            <p className="text-sm font-medium">구매중 경매가 없습니다</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronDown,
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
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Screen, Tab } from '../../../../types/index';
import { ExploreIcon } from '../../../../components/common/ExploreIcon';
import { getErrorMessage } from '@/services/apiError';
import {
  fetchAuctionBidHistory,
  fetchAuctionDetail,
  getAuctionDisplayCurrentPrice,
} from '@/services/auction/detail/service';
import type { AuctionBidHistoryItem, AuctionBidHistoryResponse, AuctionDetailResponse } from '@/services/auction/detail/types';
import { useEventStream } from '@/services/events/EventStreamProvider';
import { formatApiDate, getApiTime } from '@/services/dateTime';

type BidStatusTab = "history" | "ranking";

type BidRankingItem = {
  bidderId: number;
  bidderNickname: string;
  bidderProfileImageUrl: string | null;
  highestBid: AuctionBidHistoryItem;
  bids: AuctionBidHistoryItem[];
};

const EMPTY_BIDS: AuctionBidHistoryItem[] = [];

function formatBidTime(value: string) {
  return formatApiDate(value, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function BiddingStatusScreen({ auctionId, onBack, themeColor }: { auctionId: number | null; onBack: () => void; themeColor: string; key?: string }) {
  const [auctionDetail, setAuctionDetail] = useState<AuctionDetailResponse | null>(null);
  const [bidHistory, setBidHistory] = useState<AuctionBidHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<BidStatusTab>("history");
  const [expandedBidderIds, setExpandedBidderIds] = useState<Set<number>>(
    () => new Set(),
  );
  const { latestAuctionEvent } = useEventStream();
  const bids = bidHistory?.bids ?? EMPTY_BIDS;
  const bidRankings = React.useMemo(() => buildBidRankings(bids), [bids]);
  const currentDisplayPrice = bidHistory?.currentPrice ?? getAuctionDisplayCurrentPrice(auctionDetail);
  const bidCount = bidHistory?.bidCount ?? auctionDetail?.bidCount ?? 0;
  const priceHelperText = bidCount > 0 ? "현재 최고 입찰가" : "입찰 기록 없음";

  const toggleBidderExpanded = (bidderId: number) => {
    setExpandedBidderIds((previous) => {
      const next = new Set(previous);
      if (next.has(bidderId)) {
        next.delete(bidderId);
      } else {
        next.add(bidderId);
      }
      return next;
    });
  };

  useEffect(() => {
    if (auctionId == null) {
      return;
    }

    let ignore = false;

    setIsLoading(true);
    setErrorMessage("");

    Promise.all([
      fetchAuctionDetail(auctionId),
      fetchAuctionBidHistory(auctionId),
    ])
      .then(([detail, history]) => {
        if (!ignore) {
          setAuctionDetail(detail);
          setBidHistory(history);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(
            getErrorMessage(error, "입찰 현황을 불러오지 못했습니다."),
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
  }, [auctionId]);

  useEffect(() => {
    if (auctionId == null || latestAuctionEvent?.auctionId !== auctionId) {
      return;
    }

    if (
      latestAuctionEvent.type !== "AUCTION_BID_UPDATED" &&
      latestAuctionEvent.type !== "BID_UPDATED" &&
      latestAuctionEvent.type !== "BID_RECEIVED" &&
      latestAuctionEvent.type !== "OUTBID"
    ) {
      return;
    }

    let ignore = false;

    fetchAuctionBidHistory(auctionId)
      .then((history) => {
        if (!ignore) {
          setBidHistory(history);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(
            getErrorMessage(error, "입찰 현황을 갱신하지 못했습니다."),
          );
        }
      });

    return () => {
      ignore = true;
    };
  }, [auctionId, latestAuctionEvent]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative flex h-dvh min-h-0 flex-1 flex-col overflow-hidden bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-50">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">입찰 현황</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-28 no-scrollbar">
        {/* Summary Header */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 font-medium">현재 최고가</span>
            <span className="text-xs text-gray-400">총 {bidCount}회 입찰</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black" style={{ color: themeColor }}>
              {isLoading ? "불러오는 중" : `₩${currentDisplayPrice.toLocaleString()}`}
            </span>
            <span className="text-xs font-bold text-gray-400 flex items-center">
              {errorMessage || priceHelperText}
            </span>
          </div>
        </div>

        {/* Bidding List */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex rounded-xl bg-gray-100 p-1">
              <BidStatusTabButton
                active={activeTab === "history"}
                label="입찰 기록"
                onClick={() => setActiveTab("history")}
                activeColor={themeColor}
              />
              <BidStatusTabButton
                active={activeTab === "ranking"}
                label="입찰 순위"
                onClick={() => setActiveTab("ranking")}
                activeColor={themeColor}
              />
            </div>
            <span className="text-[10px] text-gray-400">
              {activeTab === "history" ? "최신순" : "최고가순"}
            </span>
          </div>

          {activeTab === "history" && bids.length > 0 ? (
            <div className="space-y-4">
              {bids.map((bid, idx) => (
                <div key={bid.bidId} className="relative">
                  {idx !== bids.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-16px] w-px bg-gray-100"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 bg-gray-100 flex items-center justify-center ${bid.highest ? 'ring-2 ring-offset-2' : 'border-gray-100'}`} style={{ '--tw-ring-color': bid.highest ? themeColor : 'transparent', borderColor: bid.highest ? themeColor : '#F3F4F6' } as React.CSSProperties}>
                      {bid.bidderProfileImageUrl ? (
                        <img
                          src={bid.bidderProfileImageUrl}
                          alt={bid.bidderNickname}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-bold ${bid.highest ? 'text-black' : 'text-gray-600'}`}>{bid.bidderNickname}</span>
                          {bid.highest && (
                            <span className="px-2 py-0.5 text-white text-[8px] font-black rounded-full uppercase tracking-wider" style={{ backgroundColor: themeColor }}>
                              Highest
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{formatBidTime(bid.bidAt)}</span>
                      </div>
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-lg font-black ${bid.highest ? '' : 'text-gray-400'}`} style={{ color: bid.highest ? themeColor : undefined }}>
                          ₩{bid.bidPrice.toLocaleString()}
                        </span>
                        {bid.highest && <span className="text-[10px] font-bold text-gray-400">입찰 중</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "ranking" && bidRankings.length > 0 ? (
            <motion.div layout className="space-y-3">
              <AnimatePresence initial={false} mode="popLayout">
                {bidRankings.map((ranking, index) => {
                const isExpanded = expandedBidderIds.has(ranking.bidderId);
                const hasMultipleBids = ranking.bids.length > 1;

                return (
                  <motion.div
                    key={ranking.bidderId}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{
                      layout: { type: "spring", stiffness: 430, damping: 34 },
                      opacity: { duration: 0.14 },
                      scale: { duration: 0.14 },
                    }}
                    className={`rounded-2xl border bg-white p-4 shadow-sm ${
                      index === 0 ? "border-gray-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)]" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 shrink-0">
                        <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                          {ranking.bidderProfileImageUrl ? (
                            <img
                              src={ranking.bidderProfileImageUrl}
                              alt={ranking.bidderNickname}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-gray-400" />
                          )}
                        </div>
                        <span
                          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[9px] font-black text-white"
                          style={{ backgroundColor: index === 0 ? themeColor : "#111827" }}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-black text-gray-950">
                            {ranking.bidderNickname}
                          </span>
                          {index === 0 && (
                            <span
                              className="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white"
                              style={{ backgroundColor: themeColor }}
                            >
                              Highest
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span
                            className="text-lg font-black"
                            style={{ color: index === 0 ? themeColor : "#111827" }}
                          >
                            ₩{ranking.highestBid.bidPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            최고 입찰가
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBidderExpanded(ranking.bidderId)}
                        disabled={!hasMultipleBids}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30"
                        aria-label={`${ranking.bidderNickname} 입찰 내역 ${isExpanded ? "접기" : "펼치기"}`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                            {ranking.bids.map((bid) => (
                              <div
                                key={bid.bidId}
                                className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                              >
                                <span className="text-xs font-bold text-gray-500">
                                  {formatBidTime(bid.bidAt)}
                                </span>
                                <span
                                  className="text-sm font-black"
                                  style={{ color: bid.bidId === ranking.highestBid.bidId ? themeColor : "#6B7280" }}
                                >
                                  ₩{bid.bidPrice.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm font-medium text-gray-400">
              {activeTab === "history" ? "입찰 기록이 없습니다" : "입찰 순위가 없습니다"}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 z-20 shrink-0 border-t border-gray-50 bg-white p-6">
        <button 
          onClick={onBack}
          className="w-full h-14 bg-gray-900 text-white font-bold rounded-2xl shadow-[0_8px_18px_rgba(15,23,42,0.18)] hover:bg-black transition-colors"
        >
          확인
        </button>
      </div>
    </motion.div>
  );
}

function BidStatusTabButton({
  active,
  label,
  onClick,
  activeColor,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  activeColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 rounded-lg px-4 text-sm font-black transition-colors"
      style={{
        backgroundColor: active ? "#FFFFFF" : "transparent",
        color: active ? activeColor : "#9CA3AF",
        boxShadow: active ? "0 1px 4px rgba(0, 0, 0, 0.06)" : "none",
      }}
    >
      {label}
    </button>
  );
}

function buildBidRankings(bids: AuctionBidHistoryItem[]): BidRankingItem[] {
  const groupedBids = new Map<number, AuctionBidHistoryItem[]>();

  bids.forEach((bid) => {
    const bidderBids = groupedBids.get(bid.bidderId) ?? [];
    bidderBids.push(bid);
    groupedBids.set(bid.bidderId, bidderBids);
  });

  return Array.from(groupedBids.entries())
    .map(([bidderId, bidderBids]) => {
      const sortedBids = [...bidderBids].sort((a, b) => {
        if (b.bidPrice !== a.bidPrice) {
          return b.bidPrice - a.bidPrice;
        }
        return getApiTime(b.bidAt) - getApiTime(a.bidAt);
      });

      return {
        bidderId,
        bidderNickname: sortedBids[0]?.bidderNickname ?? `입찰자 #${bidderId}`,
        bidderProfileImageUrl: sortedBids[0]?.bidderProfileImageUrl ?? null,
        highestBid: sortedBids[0],
        bids: sortedBids,
      };
    })
    .filter((ranking): ranking is BidRankingItem => ranking.highestBid != null)
    .sort((a, b) => {
      if (b.highestBid.bidPrice !== a.highestBid.bidPrice) {
        return b.highestBid.bidPrice - a.highestBid.bidPrice;
      }
      return getApiTime(b.highestBid.bidAt) - getApiTime(a.highestBid.bidAt);
    });
}

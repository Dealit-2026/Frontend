"use client";
import React, { useState, useEffect } from 'react';
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
import type { AuctionBidHistoryResponse, AuctionDetailResponse } from '@/services/auction/detail/types';
import { useEventStream } from '@/services/events/EventStreamProvider';

function formatBidTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function BiddingStatusScreen({ auctionId, onBack, themeColor }: { auctionId: number | null; onBack: () => void; themeColor: string; key?: string }) {
  const [auctionDetail, setAuctionDetail] = useState<AuctionDetailResponse | null>(null);
  const [bidHistory, setBidHistory] = useState<AuctionBidHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { latestAuctionEvent } = useEventStream();
  const bids = bidHistory?.bids ?? [];
  const currentDisplayPrice = bidHistory?.currentPrice ?? getAuctionDisplayCurrentPrice(auctionDetail);
  const bidCount = bidHistory?.bidCount ?? auctionDetail?.bidCount ?? 0;
  const priceHelperText = bidCount > 0 ? "현재 최고 입찰가" : "입찰 기록 없음";

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
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-50">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">입찰 현황</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
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
            <h3 className="font-bold text-gray-900">입찰 기록</h3>
            <span className="text-[10px] text-gray-400">최신순</span>
          </div>

          {bids.length > 0 ? (
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
                          alt={`${bid.bidderNickname} 프로필`}
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
          ) : (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm font-medium text-gray-400">
              입찰 기록이 없습니다
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 border-t border-gray-50">
        <button 
          onClick={onBack}
          className="w-full h-14 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-colors"
        >
          확인
        </button>
      </div>
    </motion.div>
  );
}

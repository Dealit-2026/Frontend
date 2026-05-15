"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, MessageCircle, Star } from "lucide-react";
import { motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import { fetchMyReviews } from "@/services/review/service";
import type {
  ReviewItemViewModel,
  ReviewListViewModel,
  ReviewMode,
} from "@/services/review/types";

function ReviewCard({ item }: { item: ReviewItemViewModel }) {
  return (
    <div className="p-5 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
            {item.productTypeLabel}
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-50 text-green-600 rounded">
            {item.statusLabel}
          </span>
        </div>
        <span className="text-[11px] text-gray-400">{item.dateLabel}</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-xl bg-gray-50 shrink-0 flex items-center justify-center">
          <MessageCircle size={24} className="text-gray-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm truncate mb-1">
            {item.productName}
          </h4>
          <p className="text-xs text-gray-400 mb-2">
            {item.partnerNickname}
          </p>
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={12}
                className={
                  index < item.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-200"
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-600 leading-relaxed">
          {item.content}
        </p>
      </div>
    </div>
  );
}

export default function ReviewScreen({
  onBack,
}: {
  onBack: () => void;
  themeColor: string;
  key?: string;
}) {
  const [mode, setMode] = useState<ReviewMode>("written");
  const [reviewList, setReviewList] = useState<ReviewListViewModel | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setErrorMessage("");

    fetchMyReviews(mode)
      .then((nextReviewList) => {
        if (!ignore) {
          setReviewList(nextReviewList);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setReviewList(null);
          setErrorMessage(
            getErrorMessage(error, "리뷰 목록을 불러오지 못했습니다."),
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
  }, [mode]);

  const reviews = reviewList?.reviews ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
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
        <h1 className="flex-1 text-center font-bold text-lg mr-10">
          리뷰 관리
        </h1>
      </div>

      <div className="flex p-4 space-x-2">
        <button
          type="button"
          onClick={() => setMode("written")}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            mode === "written"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          작성한 리뷰
        </button>
        <button
          type="button"
          onClick={() => setMode("received")}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            mode === "received"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          받은 리뷰
        </button>
      </div>

      {reviewList && (
        <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-400">
          <span>{reviewList.averageRatingLabel}</span>
          <span>리뷰 {reviewList.reviewCountLabel}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mx-4 mb-3 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
          {errorMessage}
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageCircle size={48} className="mb-4 opacity-20" />
            <p className="text-sm">리뷰를 불러오는 중입니다.</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((item) => <ReviewCard key={item.reviewId} item={item} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageCircle size={48} className="mb-4 opacity-20" />
            <p className="text-sm">
              {mode === "written"
                ? "작성한 리뷰가 없습니다."
                : "받은 리뷰가 없습니다."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

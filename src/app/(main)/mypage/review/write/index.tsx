"use client";

import { useState } from "react";
import { ChevronLeft, MessageCircle, Star } from "lucide-react";
import { motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import { createReview } from "@/services/review/service";

export default function WriteReviewScreen({
  onBack,
  onComplete,
  productId,
  auctionId = null,
  productName = "거래 상품",
}: {
  onBack: () => void;
  onComplete: () => void;
  themeColor: string;
  key?: string;
  productId?: number | null;
  auctionId?: number | null;
  productName?: string;
}) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit =
    !isSubmitting &&
    content.trim().length >= 10 &&
    (productId != null || auctionId != null);

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createReview({
        productId,
        auctionId,
        rating,
        content,
      });
      onComplete();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "리뷰 등록에 실패했습니다."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white h-full relative"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">
          리뷰 작성
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl">
          <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
            <MessageCircle size={24} className="text-gray-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-1">거래 완료 상품</p>
            <p className="font-bold truncate">{productName}</p>
          </div>
        </div>

        {productId == null && auctionId == null && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
            리뷰 대상 상품 정보가 없습니다.
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4 text-center">
          <h2 className="font-bold text-lg">거래는 어떠셨나요?</h2>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-2 transition-transform active:scale-90"
                aria-label={`${star}점`}
              >
                <Star
                  size={40}
                  className={
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold">상세한 후기를 남겨주세요</h2>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="상품 상태, 거래 매너 등 거래에 대한 솔직한 평가를 남겨주세요. (최소 10자)"
            className="w-full h-40 p-4 bg-gray-50 border border-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
            maxLength={1000}
          />
          <p className="text-right text-xs text-gray-400">
            {content.length}/1000
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full h-14 font-bold rounded-2xl transition-colors ${
            canSubmit ? "bg-black text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {isSubmitting ? "등록 중..." : "리뷰 등록하기"}
        </button>
      </div>
    </motion.div>
  );
}

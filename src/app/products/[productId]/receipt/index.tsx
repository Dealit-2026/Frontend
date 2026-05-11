"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createChatRoom } from "@/services/chats/service";
import { motion } from "motion/react";

import { fetchCurrentMember } from "@/services/auth/service";
import {
  fetchPurchaseReceipt,
  markPurchaseReceived,
  markPurchaseShipped,
} from "@/services/product/purchase/service";
import type { PurchaseReceiptResponse } from "@/services/product/purchase/types";
import { ApiRequestError } from "@/services/apiError";

function getStatusLabel(status: PurchaseReceiptResponse["status"]) {
  if (status === "PAID") return "결제 완료";
  if (status === "SHIPPED") return "배송 중";
  if (status === "COMPLETED") return "거래 완료";
  if (status === "CANCELED") return "거래 취소";
  return status;
}

function getStatusColor(status: PurchaseReceiptResponse["status"]) {
  if (status === "CANCELED") return "text-red-500";
  if (status === "COMPLETED") return "text-green-600";
  return "text-gray-700";
}

function getReceiptActionErrorMessage(code: string | null) {
  if (code === "PURCHASE_NOT_COMPLETABLE") {
    return "현재 상태에서 처리할 수 없습니다.";
  }
  if (code === "PURCHASE_FORBIDDEN") {
    return "구매자/판매자 본인만 처리할 수 있습니다.";
  }
  if (code === "PURCHASE_NOT_FOUND") {
    return "구매 내역이 존재하지 않습니다.";
  }
  if (code === "TOKEN_EXPIRED" || code === "INVALID_TOKEN") {
    return "로그인이 만료되었습니다. 다시 로그인해 주세요.";
  }
  if (code === "INVALID_REQUEST" || code === "VALIDATION_ERROR") {
    return "요청 값이 올바르지 않습니다.";
  }

  return null;
}

export default function ReceiptScreen({
  purchaseId,
  onBack,
  onWriteReview,
  themeColor,
}: {
  purchaseId: number | null;
  onBack: () => void;
  onWriteReview: () => void;
  themeColor: string;
  key?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<PurchaseReceiptResponse | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const router = useRouter();

  async function loadReceipt(targetPurchaseId: number) {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await fetchPurchaseReceipt(targetPurchaseId);
      setReceipt(data);
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "영수증 정보를 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!purchaseId || Number.isNaN(purchaseId)) {
      setReceipt(null);
      setErrorMessage("유효한 구매 정보가 없습니다.");
      return;
    }

    loadReceipt(purchaseId);
  }, [purchaseId]);

  useEffect(() => {
    async function loadMember() {
      try {
        const member = await fetchCurrentMember();
        setCurrentMemberId(member.memberId);
      } catch (error) {
        console.warn("현재 사용자 정보를 불러오지 못했습니다.", error);
        setCurrentMemberId(null);
      }
    }

    loadMember();
  }, []);

  const purchasedAtText = useMemo(() => {
    if (!receipt?.purchasedAt) return "-";
    const parsed = new Date(receipt.purchasedAt);
    if (Number.isNaN(parsed.getTime())) return "-";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  }, [receipt]);

  const productTitle = receipt?.productTitle ?? "상품 정보 없음";
  const productImage =
    receipt?.productImageUrl || "https://picsum.photos/seed/p1/200/200";
  const amountText = `₩${(receipt?.amount ?? 0).toLocaleString()}`;
  const statusText = receipt ? getStatusLabel(receipt.status) : "-";
  const statusColorClass = receipt
    ? getStatusColor(receipt.status)
    : "text-gray-500";
  const isSeller =
    receipt && currentMemberId ? receipt.sellerId === currentMemberId : false;
  const isBuyer =
    receipt && currentMemberId ? receipt.buyerId === currentMemberId : false;

  const actionGuideMessage = useMemo(() => {
    if (!receipt) return null;
    if (isBuyer && receipt.status === "PAID") {
      return "아직 판매자가 물건 발송 완료 전입니다.";
    }
    if (isSeller && receipt.status === "PAID") {
      return "발송 완료 후 판매자는 채팅방에서 '물건을 보냈어요' 버튼을 눌러 주세요.";
    }
    if (isSeller && receipt.status === "SHIPPED") {
      return "구매자 수령확정을 기다리는 상태입니다.";
    }
    if (receipt.status === "COMPLETED") {
      return "거래가 완료되어 정산이 끝났습니다.";
    }
    if (receipt.status === "CANCELED") {
      return "거래가 취소되어 환불 처리된 상태입니다.";
    }

    return null;
  }, [receipt, isBuyer, isSeller]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col bg-gray-50"
    >
      <div className="h-16 flex items-center px-4 justify-between">
        <button onClick={onBack} className="p-2">
          <X size={24} />
        </button>
        <h1 className="font-bold text-lg">결제 영수증</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="bg-white rounded-4xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-8 space-y-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Check size={32} />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold">결제 영수증</h2>
                <p className="text-sm text-gray-400">{purchasedAtText}</p>
              </div>
            </div>

            <div className="h-px bg-dashed bg-gray-100"></div>

            {loading && (
              <p className="text-sm text-gray-500 text-center">
                영수증 정보를 불러오는 중...
              </p>
            )}

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}

            {actionMessage && (
              <p className="text-sm text-gray-600 text-center">
                {actionMessage}
              </p>
            )}

            {actionGuideMessage && (
              <p className="text-sm text-gray-500 text-center">
                {actionGuideMessage}
              </p>
            )}

            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50">
                <img
                  src={productImage}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-gray-400">상품명</p>
                <p className="font-bold">{productTitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">결제 금액</span>
                <span className="font-black text-lg">{amountText}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">거래 상태</span>
                <span className={`font-bold ${statusColorClass}`}>
                  {statusText}
                </span>
              </div>
              {/* 구매 ID는 표시하지 않음 (요구사항) */}
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => router.replace("/")}
                className="w-full h-14 bg-black text-white font-bold rounded-2xl"
              >
                확인
              </button>
              <button
                onClick={async () => {
                  if (!receipt) return;
                  try {
                    setActionLoading(true);
                    setActionMessage(null);
                    const chat = await createChatRoom({
                      productId: receipt.productId,
                    });
                    router.push(
                      `/chats/${chat.roomId}?purchaseId=${receipt.purchaseId}`,
                    );
                  } catch (error: unknown) {
                    console.error(error);
                    setActionMessage(
                      error instanceof Error
                        ? error.message
                        : "채팅방 이동에 실패했습니다.",
                    );
                  } finally {
                    setActionLoading(false);
                  }
                }}
                disabled={actionLoading || loading}
                className="w-full h-14 bg-white border border-gray-200 text-black font-bold rounded-2xl"
              >
                채팅방 이동
              </button>
              <button
                onClick={onWriteReview}
                className="w-full h-14 bg-white border border-gray-200 text-black font-bold rounded-2xl"
              >
                리뷰 작성하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

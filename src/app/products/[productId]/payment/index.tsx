"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";

import { Screen, Tab } from "../../../../types/index";
import { ExploreIcon } from "../../../../components/common/ExploreIcon";
import { useRouter, useParams } from "next/navigation";

import * as purchaseService from "@/services/product/purchase/service";
import { createChatRoom } from "@/services/chats/service";
import { getWallet, chargeWallet } from "@/services/wallet/api";
import { ApiRequestError } from "@/services/apiError";

function getPaymentErrorMessageByCode(code: string | null) {
  if (code === "INSUFFICIENT_BALANCE") {
    return "딜릿머니 잔액이 부족해요. 충전 후 다시 시도해 주세요.";
  }
  if (code === "PRODUCT_NOT_PURCHASABLE") {
    return "현재 구매할 수 없는 상품이에요. 상품 상태를 새로고침해 주세요.";
  }
  if (code === "PURCHASE_NOT_COMPLETABLE") {
    return "현재 상태에서는 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (code === "PURCHASE_FORBIDDEN") {
    return "이 구매 건을 처리할 권한이 없습니다.";
  }
  if (code === "PURCHASE_NOT_FOUND") {
    return "구매 내역을 찾을 수 없습니다.";
  }
  if (code === "IDEMPOTENCY_CONFLICT") {
    return "중복 결제 요청이 감지되었습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (code === "INVALID_REQUEST" || code === "VALIDATION_ERROR") {
    return "요청 값이 올바르지 않습니다. 입력값을 확인해 주세요.";
  }
  if (code === "TOKEN_EXPIRED" || code === "INVALID_TOKEN") {
    return "로그인이 만료되었습니다. 다시 로그인해 주세요.";
  }

  return null;
}

export default function PaymentScreen({
  showToast,
  onBack,
  onComplete,
  themeColor,
}: {
  showToast: (msg: string) => void;
  onBack: () => void;
  onComplete: () => void;
  themeColor: string;
  key?: string;
}) {
  const router = useRouter();
  const params = useParams() as { productId?: string };
  const productId = params?.productId ? Number(params.productId) : null;

  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "direct">(
    "delivery",
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "bidpay" | "card" | "simple"
  >("bidpay");
  const [simplePaymentType, setSimplePaymentType] = useState<
    "kakao" | "naver" | "toss"
  >("kakao");

  const [product, setProduct] = useState<
    | import("@/services/product/purchase/types").ProductPurchaseAvailabilityResponse
    | null
  >(null);
  const [wallet, setWallet] = useState<
    import("@/services/wallet/types").WalletResponse | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const [showChargeModal, setShowChargeModal] = useState(false);
  const [chargeAmount, setChargeAmount] = useState(1000);
  const [charging, setCharging] = useState(false);

  const shippingFee = deliveryMethod === "delivery" ? 3000 : 0;
  const price = product?.generalSale?.price ?? 0;
  const totalPrice = price + shippingFee;
  const isPurchasable = Boolean(product?.canPurchase);
  const hasEnoughBalance = (wallet?.balance ?? 0) >= price;

  const blockedReasonMessage = purchaseService.getPurchaseBlockedReasonMessage(
    product?.purchaseBlockedReason ?? null,
  );

  const actionLabel = !isPurchasable
    ? (blockedReasonMessage ?? "현재 구매할 수 없는 상품")
    : !hasEnoughBalance
      ? "딜릿머니 충전하기"
      : "딜릿머니로 구매하기";

  useEffect(() => {
    async function load() {
      if (!productId) return;

      try {
        setLoading(true);
        const [prod, wal] = await Promise.all([
          purchaseService.fetchPurchaseProductDetail(productId),
          getWallet(),
        ]);

        setProduct(prod);
        setWallet(wal);
      } catch (err: unknown) {
        console.error(err);
        showToast("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [productId]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-gray-50 h-full relative"
    >
      <div className="h-16 flex items-center px-4 bg-white border-b border-gray-100 shrink-0">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">결제하기</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="bg-white p-6 mb-2">
          <h2 className="font-bold mb-4">주문 상품</h2>
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
              <img
                src={
                  product?.generalSale
                    ? `https://picsum.photos/seed/product/${product?.productId}/200/200`
                    : `https://picsum.photos/seed/product/200/200`
                }
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-medium text-sm mb-1 line-clamp-2">
                {product
                  ? (product.name ?? `상품 #${product.productId}`)
                  : "상품 정보를 불러오는 중..."}
              </p>
              <p className="font-bold text-lg">₩{price.toLocaleString()}</p>
            </div>
          </div>
          {!isPurchasable && blockedReasonMessage && (
            <p className="text-xs text-red-500 mt-3">{blockedReasonMessage}</p>
          )}
        </div>

        {/* Delivery & Payment blocks (kept simple) */}
        <div className="bg-white p-6 mb-2 space-y-4">
          <h2 className="font-bold">거래 방식</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setDeliveryMethod("delivery")}
              className={`flex-1 h-12 rounded-xl text-sm font-bold border transition-all ${deliveryMethod === "delivery" ? "border-black bg-black text-white" : "border-gray-200 text-gray-400"}`}
            >
              택배배송
            </button>
            <button
              onClick={() => setDeliveryMethod("direct")}
              className={`flex-1 h-12 rounded-xl text-sm font-bold border transition-all ${deliveryMethod === "direct" ? "border-black bg-black text-white" : "border-gray-200 text-gray-400"}`}
            >
              직거래
            </button>
          </div>
        </div>

        <div className="bg-white p-6 space-y-4">
          <h2 className="font-bold">결제 금액</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">낙찰 금액</span>
              <span>₩{price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">배송비</span>
              <span>
                {shippingFee === 0
                  ? "무료"
                  : `+₩${shippingFee.toLocaleString()}`}
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold">총 결제 금액</span>
            <span className="text-xl font-bold" style={{ color: themeColor }}>
              ₩{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10">
        <button
          onClick={async () => {
            if (!productId) {
              showToast("상품 정보를 찾을 수 없습니다.");
              return;
            }

            if (!product?.canPurchase) {
              const msg =
                blockedReasonMessage || "현재 구매할 수 없는 상품입니다.";
              showToast(msg);
              return;
            }

            if ((wallet?.balance ?? 0) < price) {
              setShowChargeModal(true);
              return;
            }

            try {
              setPurchasing(true);
              const res = await purchaseService.purchaseProduct(productId);
              showToast("결제가 완료되었습니다. 채팅방을 생성합니다...");

              try {
                const chat = await createChatRoom({ productId });
                router.push(`/chats/${chat.roomId}`);
              } catch (chatErr) {
                console.warn(
                  "채팅방 생성 실패, 영수증으로 이동합니다.",
                  chatErr,
                );
                router.push(
                  `/products/${productId}/receipt?purchaseId=${res.purchaseId}`,
                );
              }
            } catch (err: unknown) {
              console.error(err);
              let msg =
                err instanceof Error ? err.message : "결제에 실패했습니다.";

              if (err instanceof ApiRequestError) {
                const mapped = getPaymentErrorMessageByCode(err.code);
                if (mapped) {
                  msg = mapped;
                }

                if (err.code === "INSUFFICIENT_BALANCE") {
                  setShowChargeModal(true);
                }
              }

              showToast(msg);
            } finally {
              setPurchasing(false);
            }
          }}
          disabled={loading || purchasing || !isPurchasable}
          className="w-full h-14 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
          style={{ backgroundColor: themeColor }}
        >
          {loading
            ? "로딩 중..."
            : purchasing
              ? "결제 진행 중..."
              : !isPurchasable
                ? actionLabel
                : !hasEnoughBalance
                  ? "딜릿머니 충전하기"
                  : `${totalPrice.toLocaleString()}원 ${actionLabel}`}
        </button>
      </div>

      {showChargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowChargeModal(false)}
          />
          <div className="bg-white rounded-xl p-6 z-10 w-[90%] max-w-md">
            <h3 className="font-bold mb-2">딜릿머니 충전</h3>
            <p className="text-sm text-gray-600 mb-4">
              현재 잔액: ₩{(wallet?.balance ?? 0).toLocaleString()}
            </p>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="number"
                min={1000}
                step={1000}
                value={chargeAmount}
                onChange={(e) => setChargeAmount(Number(e.target.value))}
                className="flex-1 h-12 px-4 border rounded-lg"
              />
              <button
                onClick={() => setChargeAmount(1000)}
                className="px-3 h-12 rounded-lg border"
              >
                ₩1,000
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowChargeModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  if (chargeAmount <= 0) {
                    showToast("충전 금액을 확인해 주세요.");
                    return;
                  }
                  try {
                    setCharging(true);
                    const res = await chargeWallet({ amount: chargeAmount });
                    setWallet(res);
                    setShowChargeModal(false);
                    showToast("충전이 완료되었습니다.");
                  } catch (err: unknown) {
                    console.error(err);
                    let msg =
                      err instanceof Error
                        ? err.message
                        : "충전에 실패했습니다.";

                    if (err instanceof ApiRequestError) {
                      const mapped = getPaymentErrorMessageByCode(err.code);
                      if (mapped) {
                        msg = mapped;
                      }
                    }

                    showToast(msg);
                  } finally {
                    setCharging(false);
                  }
                }}
                disabled={charging}
                className="px-4 py-2 rounded-lg bg-green-500 text-white disabled:opacity-60"
              >
                {charging ? "충전 중..." : "충전하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

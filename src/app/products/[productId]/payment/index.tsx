"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Image as ImageIcon, Plus } from "lucide-react";
import { motion } from "motion/react";

import { Screen, Tab } from "../../../../types/index";
import { ExploreIcon } from "../../../../components/common/ExploreIcon";
import { useRouter, useParams } from "next/navigation";

import * as purchaseService from "@/services/product/purchase/service";
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
  onComplete?: (purchaseId?: number) => void;
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
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

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

  const notify = (message: string) => {
    setNoticeMessage(message);
    showToast(message);
  };

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
        notify("데이터를 불러오는 중 오류가 발생했습니다.");
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

      {noticeMessage && (
        <div className="mx-4 mt-3 rounded-lg bg-red-50 px-4 py-3 text-xs font-medium text-red-500">
          {noticeMessage}
        </div>
      )}

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

        {/* Dealit Money Panel */}
        <div className="bg-black text-white p-6 mb-2 rounded-2xl mx-2 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold">💳 딜릿머니</div>
            </div>
            <div className="text-sm text-gray-300">DEALIT</div>
          </div>
          <div className="mb-6">
            <div className="text-3xl font-bold">
              ₩{(wallet?.balance ?? 0).toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setShowChargeModal(true)}
            className="w-full h-12 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>충전</span>
          </button>
        </div>

        <div className="bg-white p-6 space-y-4">
          <h2 className="font-bold">결제 금액</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">상품 금액</span>
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
              notify("상품 정보를 찾을 수 없습니다.");
              return;
            }

            if (!product?.canPurchase) {
              const msg =
                blockedReasonMessage || "현재 구매할 수 없는 상품입니다.";
              notify(msg);
              return;
            }

            if (!hasEnoughBalance) {
              notify("딜릿머니 잔액이 부족해요. 충전 후 다시 시도해 주세요.");
              setShowChargeModal(true);
              return;
            }

            try {
              setPurchasing(true);
              const res = await purchaseService.purchaseProduct(productId);
              notify("결제가 완료되었습니다.");

              // 콜백이 제공되면 부모가 처리할 수 있도록 purchaseId를 전달합니다.
              if (onComplete) {
                onComplete(res.purchaseId);
              } else {
                // 기본 동작: 상품 페이지의 영수증 경로로 이동
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

              notify(msg);
            } finally {
              setPurchasing(false);
            }
          }}
          disabled={loading || purchasing || !isPurchasable}
          className={`w-full h-14 font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-100 disabled:shadow-none ${
            loading || purchasing || !isPurchasable
              ? "bg-gray-200 text-gray-500"
              : "text-white"
          }`}
          style={
            loading || purchasing || !isPurchasable
              ? undefined
              : { backgroundColor: themeColor }
          }
        >
          {loading ? "로딩 중..." : purchasing ? "결제 진행 중..." : "결제하기"}
        </button>
      </div>

      {showChargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowChargeModal(false)}
          />
          <div className="bg-white rounded-xl p-6 z-10 w-[90%] max-w-md sm:max-w-lg lg:max-w-xl">
            <h3 className="font-bold text-lg mb-2">딜릿머니 충전</h3>
            <p className="text-sm text-gray-600 mb-4">
              현재 잔액: {(wallet?.balance ?? 0).toLocaleString()}원
            </p>

            {/* 직접 입력 */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-2 block">
                충전 금액 직접 입력
              </label>
              <input
                type="number"
                min={1000}
                step={1000}
                value={chargeAmount}
                onChange={(e) => setChargeAmount(Number(e.target.value))}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="충전할 금액을 입력하세요"
              />
            </div>

            {/* 빠른 충전 버튼 */}
            <div className="mb-6">
              <label className="text-sm text-gray-600 mb-2 block">
                빠른 충전
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[1000, 5000, 10000, 50000, 100000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setChargeAmount((prev) => prev + amount)}
                    className="h-10 rounded-md border border-gray-300 hover:bg-green-50 hover:border-green-500 transition-colors text-sm font-medium"
                  >
                    +{amount.toLocaleString()}원
                  </button>
                ))}
              </div>
            </div>

            {/* 충전 예정액 표시 */}
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">충전 예정액</span>
                <span className="text-lg font-bold text-green-500">
                  {chargeAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowChargeModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={async () => {
	                  if (chargeAmount <= 0) {
	                    notify("충전 금액을 확인해 주세요.");
	                    return;
	                  }
                  try {
                    setCharging(true);
                    const res = await chargeWallet({ amount: chargeAmount });
	                    setWallet(res);
	                    setShowChargeModal(false);
	                    notify("충전이 완료되었습니다.");
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

	                    notify(msg);
	                  } finally {
                    setCharging(false);
                  }
                }}
                disabled={charging || chargeAmount <= 0}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 disabled:opacity-60 transition-colors"
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

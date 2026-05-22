"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  getPurchaseReceipt,
  getSalesReceipt,
} from "../../services/mypage/transaction-receipt";
import type { TransactionReceiptResponse } from "../../services/mypage/transaction-receipt";
import {
  getMyReceivedReviews,
  getMyWrittenReviews,
} from "@/services/review/api";

interface Props {
  mode: "purchase" | "sale";
  id: number;
  onBack?: () => void;
  themeColor?: string;
}

export default function TransactionReceipt({
  mode,
  id,
  onBack,
  themeColor,
}: Props) {
  const router = useRouter();
  const [data, setData] = useState<TransactionReceiptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [writtenReviewExists, setWrittenReviewExists] = useState(false);
  const [receivedReviewExists, setReceivedReviewExists] = useState(false);

  useEffect(() => {
    let aborted = false;
    setLoading(true);
    setError(null);

    const loader = async () => {
      try {
        const res =
          mode === "purchase"
            ? await getPurchaseReceipt(id)
            : await getSalesReceipt(id);

        if (!aborted) {
          setData(res);
          setWrittenReviewExists(false);
          setReceivedReviewExists(false);

          if (mode === "purchase") {
            try {
              const writtenReviews = await getMyWrittenReviews(0, 200);
              const hasMatchingReview = writtenReviews.content.some(
                (review) => {
                  if (res.productType === "AUCTION") {
                    return (
                      review.auctionId != null &&
                      res.auctionId != null &&
                      review.auctionId === res.auctionId
                    );
                  }

                  return review.productId === res.productId;
                },
              );

              if (!aborted) {
                setWrittenReviewExists(hasMatchingReview);
              }
            } catch {
              if (!aborted) {
                setWrittenReviewExists(false);
              }
            }
          } else {
            try {
              const receivedReviews = await getMyReceivedReviews(0, 200);
              const hasMatchingReview = receivedReviews.content.some(
                (review) => {
                  if (res.productType === "AUCTION") {
                    return (
                      review.auctionId != null &&
                      res.auctionId != null &&
                      review.auctionId === res.auctionId
                    );
                  }

                  return review.productId === res.productId;
                },
              );

              if (!aborted) {
                setReceivedReviewExists(hasMatchingReview);
              }
            } catch {
              if (!aborted) {
                setReceivedReviewExists(false);
              }
            }
          }
        }
      } catch (e: any) {
        if (!aborted) setError(e);
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    loader();
    return () => {
      aborted = true;
    };
  }, [mode, id]);

  const handleBack = () => {
    if (onBack) return onBack();
    router.back();
  };

  if (loading) return <div>로딩 중...</div>;
  if (error)
    return (
      <div>
        <div>오류가 발생했습니다.</div>
        <div>{error?.message || "네트워크 오류"}</div>
        <button onClick={handleBack}>뒤로가기</button>
      </div>
    );

  if (!data) return <div>데이터가 없습니다.</div>;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PAID":
        return "결제 완료";
      case "SHIPPED":
        return "배송 중";
      case "COMPLETED":
        return "거래 완료";
      case "CANCELED":
        return "취소";
      case "PENDING":
        return "대기 중";
      default:
        return status;
    }
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case "REGULAR":
        return "일반 판매";
      case "AUCTION":
        return "경매";
      default:
        return type;
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price == null) return "-";
    try {
      return new Intl.NumberFormat("ko-KR").format(price) + "원";
    } catch {
      return String(price) + "원";
    }
  };

  const getProductName = (d: any) => {
    // common top-level fields
    const topKeys = [
      "productName",
      "product_name",
      "title",
      "name",
      "itemName",
      "productTitle",
      "label",
    ];
    for (const k of topKeys) {
      if (
        d &&
        d[k] !== undefined &&
        d[k] !== null &&
        String(d[k]).trim() !== ""
      )
        return d[k];
    }

    // common nested containers
    const nests = [
      "product",
      "item",
      "productInfo",
      "productDto",
      "payload",
      "data",
    ];
    for (const n of nests) {
      const obj = d?.[n];
      if (!obj) continue;
      for (const k of topKeys) {
        if (
          obj &&
          obj[k] !== undefined &&
          obj[k] !== null &&
          String(obj[k]).trim() !== ""
        )
          return obj[k];
      }
      // common fields
      if (typeof obj === "string" && obj.trim() !== "") return obj;
      if (obj?.title) return obj.title;
      if (obj?.name) return obj.name;
    }

    // fallback: any string field that mentions product
    for (const key of Object.keys(d || {})) {
      if (
        typeof d[key] === "string" &&
        key.toLowerCase().includes("product") &&
        d[key].trim() !== ""
      )
        return d[key];
    }

    return "-";
  };

  const getPriceDisplay = (d: any) => {
    // check numeric fields first
    if (typeof d.price === "number") return formatPrice(d.price);
    if (typeof d.amount === "number") return formatPrice(d.amount);
    // formatted string fields
    if (typeof d.amountFormatted === "string" && d.amountFormatted.trim())
      return d.amountFormatted;
    if (typeof d.price === "string" && d.price.trim()) return d.price + "원";
    // fallback
    return "-";
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return "-";
    try {
      const dt = new Date(iso);
      return dt.toLocaleString("ko-KR");
    } catch {
      return iso;
    }
  };

  const isSellerShipped =
    data.sellerShipped === true ||
    data.status === "SHIPPED" ||
    data.status === "COMPLETED";

  const isBuyerConfirmed =
    data.buyerConfirmed === true || data.status === "COMPLETED";

  const isCompleted =
    data.completed === true ||
    data.status === "COMPLETED" ||
    Boolean(data.completedAt);

  const isReviewAvailable =
    data.reviewAvailable === true ||
    (data.reviewAvailable === undefined && isCompleted && !data.reviewWritten);

  const hasWrittenReview =
    data.reviewWritten === true || (mode === "purchase" && writtenReviewExists);
  const canWriteReview =
    mode === "purchase" && isReviewAvailable && !hasWrittenReview;
  const hasReceivedReview =
    data.reviewReceived === true || (mode === "sale" && receivedReviewExists);

  return (
    <div
      style={{
        background: "#f3f4f6",
        padding: 20,
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        <header
          style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
        >
          <button
            onClick={handleBack}
            aria-label="뒤로가기"
            style={{
              padding: 8,
              marginLeft: -8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 style={{ marginLeft: 12, fontSize: 20 }}>
            {mode === "purchase" ? "구매 영수증" : "판매 영수증"}
          </h2>
        </header>

        <section
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 8,
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <img
              src={data.productImageUrl ?? "/placeholder.png"}
              alt={getProductName(data)}
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>
                    {getProductName(data)}
                  </div>
                  <div style={{ color: "#6b7280", marginTop: 8, fontSize: 14 }}>
                    {getProductTypeLabel(data.productType)}
                    {data.productType === "AUCTION" && data.auctionId ? (
                      <button
                        onClick={() =>
                          router.push(`/auctions/${data.auctionId}`)
                        }
                        style={{
                          marginLeft: 8,
                          padding: "2px 6px",
                          fontSize: 12,
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        경매 상세
                      </button>
                    ) : null}
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: 20 }}>
                  {getPriceDisplay(data)}
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 15 }}>
                판매자: {data.counterpartNickname ?? "-"}
              </div>
            </div>
          </div>
        </section>

        {/* 거래 정보 카드는 요청에 따라 제거됨; 필요 시 추후 복원 가능 */}

        <section style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>진행 상태</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 16,
            }}
          >
            <div
              style={{
                display: "block",
                width: "100%",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  display: "inline-block",
                  minWidth: 140,
                  marginRight: 12,
                  fontSize: 15,
                }}
              >
                거래일자:
              </span>
              <span style={{ fontSize: 15, color: "#111", lineHeight: 1.6 }}>
                {formatDate(data.purchasedAt ?? data.paidAt)}
              </span>
            </div>
            <div
              style={{
                display: "block",
                width: "100%",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  display: "inline-block",
                  minWidth: 140,
                  marginRight: 12,
                  fontSize: 15,
                }}
              >
                결제일:
              </span>
              <span style={{ fontSize: 15, color: "#111", lineHeight: 1.6 }}>
                {formatDate(data.paidAt)}
              </span>
            </div>
            <div
              style={{
                display: "block",
                width: "100%",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  display: "inline-block",
                  minWidth: 140,
                  marginRight: 12,
                  fontSize: 15,
                }}
              >
                결제 완료:
              </span>
              <span style={{ fontSize: 15, color: "#111", lineHeight: 1.6 }}>
                {data.paidAt ? "완료" : "미완료"}
              </span>
            </div>
            <div
              style={{
                display: "block",
                width: "100%",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  display: "inline-block",
                  minWidth: 140,
                  marginRight: 12,
                  fontSize: 15,
                }}
              >
                판매자 발송:
              </span>
              <span style={{ fontSize: 15, color: "#111", lineHeight: 1.6 }}>
                {data.sellerShipped ? "발송" : "미발송"}
              </span>
            </div>
            <div
              style={{
                display: "block",
                width: "100%",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  display: "inline-block",
                  minWidth: 140,
                  marginRight: 12,
                  fontSize: 15,
                }}
              >
                구매자 수령확인:
              </span>
              <span style={{ fontSize: 15, color: "#111", lineHeight: 1.6 }}>
                {data.buyerConfirmed ? "확인" : "미확인"}
              </span>
            </div>
            <div style={{ display: "block", width: "100%", padding: "12px 0" }}>
              <span
                style={{
                  fontWeight: 600,
                  display: "inline-block",
                  minWidth: 140,
                  marginRight: 12,
                  fontSize: 15,
                }}
              >
                거래 완료:
              </span>
              <span style={{ fontSize: 15, color: "#111", lineHeight: 1.6 }}>
                {isCompleted ? "완료" : "진행 중"}
              </span>
            </div>
            <div style={{ display: "block", width: "100%", padding: "12px 0" }}>
              <span
                style={{
                  fontWeight: 600,
                  display: "inline-block",
                  minWidth: 140,
                  marginRight: 12,
                  fontSize: 15,
                }}
              >
                리뷰:
              </span>
              <span style={{ fontSize: 15, color: "#111", lineHeight: 1.6 }}>
                {mode === "purchase" ? (
                  hasWrittenReview ? (
                    <button
                      type="button"
                      disabled
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        color: "#9ca3af",
                        cursor: "not-allowed",
                        fontSize: 14,
                      }}
                    >
                      리뷰를 작성했습니다
                    </button>
                  ) : canWriteReview ? (
                    <button
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set("productId", String(data.productId));
                        if (data.productType === "AUCTION" && data.auctionId) {
                          params.set("auctionId", String(data.auctionId));
                        }
                        router.push(
                          `/mypage/review/write?${params.toString()}`,
                        );
                      }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      리뷰 작성
                    </button>
                  ) : (
                    "리뷰 작성 불가"
                  )
                ) : (
                  <span>
                    {hasReceivedReview
                      ? "리뷰가 작성되었습니다"
                      : "리뷰가 아직 달리지 않았습니다"}
                  </span>
                )}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

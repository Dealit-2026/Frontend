"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import ReceiptScreen from "./index";

export default function ReceiptPage() {
  const router = useRouter();
  const params = useParams<{ productId: string }>();
  const searchParams = useSearchParams();
  const productId = Number(params.productId);
  const purchaseIdParam = searchParams.get("purchaseId");
  const purchaseId = purchaseIdParam ? Number(purchaseIdParam) : null;

  return (
    <ReceiptScreen
      key={`receipt-${purchaseId ?? "none"}`}
      purchaseId={purchaseId}
      onBack={() => router.back()}
      onWriteReview={() => {
        const reviewUrl =
          Number.isFinite(productId) && productId > 0
            ? `/mypage/review/write?productId=${productId}`
            : "/mypage/review/write";

        router.push(reviewUrl);
      }}
      themeColor="#98E446"
    />
  );
}

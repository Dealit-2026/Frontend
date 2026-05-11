"use client";

import { useRouter, useSearchParams } from "next/navigation";

import ReceiptScreen from "./index";

export default function ReceiptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseIdParam = searchParams.get("purchaseId");
  const purchaseId = purchaseIdParam ? Number(purchaseIdParam) : null;

  return (
    <ReceiptScreen
      key={`receipt-${purchaseId ?? "none"}`}
      purchaseId={purchaseId}
      onBack={() => router.back()}
      onWriteReview={() => router.push("/mypage/review/write")}
      themeColor="#98E446"
    />
  );
}

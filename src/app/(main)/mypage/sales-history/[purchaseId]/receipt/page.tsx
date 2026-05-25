"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TransactionReceipt from "../../../../../../components/transaction-receipt/TransactionReceipt";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function SalesReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const saleId = Number(params?.purchaseId ?? NaN);
  const returnUrl = searchParams.get("returnUrl") ?? "/mypage/sales-history";
  if (Number.isNaN(saleId)) return <div>유효하지 않은 ID</div>;
  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <TransactionReceipt
        mode="sale"
        id={saleId}
        themeColor="#f97316"
        onBack={() => router.push(returnUrl)}
      />
    </RouteTabShell>
  );
}

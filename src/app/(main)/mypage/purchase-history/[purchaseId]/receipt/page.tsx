"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TransactionReceipt from "../../../../../../components/transaction-receipt/TransactionReceipt";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function PurchaseReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseId = Number(params?.purchaseId ?? NaN);
  const returnUrl = searchParams.get("returnUrl") ?? "/mypage/purchase-history";
  if (Number.isNaN(purchaseId)) return <div>유효하지 않은 ID</div>;
  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <TransactionReceipt
        mode="purchase"
        id={purchaseId}
        themeColor="#98E446"
        onBack={() => router.push(returnUrl)}
      />
    </RouteTabShell>
  );
}

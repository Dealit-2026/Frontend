"use client";

import React from "react";
import { useParams } from "next/navigation";
import TransactionReceipt from "../../../../../../components/transaction-receipt/TransactionReceipt";

export default function PurchaseReceiptPage() {
  const params = useParams();
  const purchaseId = Number(params?.purchaseId ?? NaN);
  if (Number.isNaN(purchaseId)) return <div>유효하지 않은 ID</div>;
  return (
    <TransactionReceipt mode="purchase" id={purchaseId} themeColor="#98E446" />
  );
}

"use client";

import React from "react";
import { useParams } from "next/navigation";
import TransactionReceipt from "../../../../../../components/transaction-receipt/TransactionReceipt";

export default function SalesReceiptPage() {
  const params = useParams();
  const saleId = Number(params?.purchaseId ?? NaN);
  if (Number.isNaN(saleId)) return <div>유효하지 않은 ID</div>;
  return <TransactionReceipt mode="sale" id={saleId} themeColor="#f97316" />;
}

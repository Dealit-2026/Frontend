"use client";

import { useRouter } from "next/navigation";

import PurchaseHistoryScreen from "./index";

export default function PurchaseHistoryPage() {
  const router = useRouter();

  return (
    <PurchaseHistoryScreen onBack={() => router.back()} themeColor="#98E446" />
  );
}

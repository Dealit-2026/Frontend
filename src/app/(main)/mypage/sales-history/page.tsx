"use client";

import { useRouter } from "next/navigation";

import SalesHistoryScreen from "./index";

export default function SalesHistoryPage() {
  const router = useRouter();

  return (
    <SalesHistoryScreen onBack={() => router.back()} themeColor="#98E446" />
  );
}

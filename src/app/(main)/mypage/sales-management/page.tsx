"use client";

import { useRouter } from "next/navigation";

import SalesManagementScreen from "./index";

export default function SalesManagementPage() {
  const router = useRouter();

  return <SalesManagementScreen onBack={() => router.back()} themeColor="#98E446" />;
}

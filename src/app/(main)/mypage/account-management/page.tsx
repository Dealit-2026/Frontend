"use client";

import { useRouter } from "next/navigation";

import AccountManagementScreen from "./index";

export default function AccountManagementPage() {
  const router = useRouter();

  return <AccountManagementScreen onBack={() => router.back()} themeColor="#98E446" />;
}

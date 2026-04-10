"use client";

import { useRouter } from "next/navigation";

import NotificationSettingsScreen from "./index";

export default function NotificationSettingsPage() {
  const router = useRouter();

  return <NotificationSettingsScreen onBack={() => router.back()} themeColor="#98E446" />;
}

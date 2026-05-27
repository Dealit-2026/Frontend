"use client";

import { useRouter } from "next/navigation";

import NotificationSettingsScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function NotificationSettingsPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <NotificationSettingsScreen
        onBack={() => router.push("/mypage")}
        themeColor="#98E446"
      />
    </RouteTabShell>
  );
}

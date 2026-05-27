"use client";

import { useRouter } from "next/navigation";

import AccountManagementScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function AccountManagementPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <AccountManagementScreen
        onBack={() => router.push("/mypage")}
        themeColor="#98E446"
      />
    </RouteTabShell>
  );
}

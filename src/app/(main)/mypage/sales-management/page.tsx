"use client";

import { useRouter } from "next/navigation";

import SalesManagementScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function SalesManagementPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <SalesManagementScreen
        onBack={() => router.push("/mypage")}
        themeColor="#98E446"
      />
    </RouteTabShell>
  );
}

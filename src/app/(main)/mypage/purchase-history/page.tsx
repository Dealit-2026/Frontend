"use client";

import { useRouter } from "next/navigation";

import PurchaseHistoryScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function PurchaseHistoryPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <PurchaseHistoryScreen
        onBack={() => router.push("/mypage")}
        themeColor="#98E446"
      />
    </RouteTabShell>
  );
}

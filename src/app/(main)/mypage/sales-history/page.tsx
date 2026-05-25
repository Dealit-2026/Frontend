"use client";

import { useRouter } from "next/navigation";

import SalesHistoryScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function SalesHistoryPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <SalesHistoryScreen
        onBack={() => router.push("/mypage")}
        themeColor="#98E446"
      />
    </RouteTabShell>
  );
}

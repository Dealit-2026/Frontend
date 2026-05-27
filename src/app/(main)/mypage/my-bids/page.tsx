"use client";

import { useRouter } from "next/navigation";

import MyBidsScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function MyBidsPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#F64257">
      <MyBidsScreen
        onBack={() => router.push("/mypage")}
        onProductClick={(auctionId) => router.push(`/auctions/${auctionId}`)}
        themeColor="#F64257"
      />
    </RouteTabShell>
  );
}

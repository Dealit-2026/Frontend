"use client";

import { useRouter } from "next/navigation";

import WishlistScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function WishlistPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <WishlistScreen
        onBack={() => router.push("/mypage")}
        onProductClick={(id) => router.push(`/products/${id}`)}
        onAuctionClick={(id) => router.push(`/auctions/${id}`)}
        themeColor="#98E446"
      />
    </RouteTabShell>
  );
}

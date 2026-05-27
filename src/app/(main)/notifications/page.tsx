"use client";

import { useRouter } from "next/navigation";

import NotificationScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <NotificationScreen
        onBack={() => router.push("/home")}
        onChatClick={(id) => router.push(`/chats/${id}`)}
        onReviewClick={() => router.push("/mypage/review")}
        onReceiptClick={() => router.push("/products/1/receipt")}
        onProductClick={(id) => router.push(`/products/${id}`)}
        onAuctionClick={(id) => router.push(`/auctions/${id}`)}
        onWinningBidClick={() => router.push("/notifications")}
        onOutbidClick={() => router.push("/notifications")}
        onTargetUrl={(url) => router.push(url)}
        themeColor="#98E446"
      />
    </RouteTabShell>
  );
}

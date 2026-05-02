"use client";

import { useRouter } from "next/navigation";

import NotificationScreen from "./index";

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <NotificationScreen
      onBack={() => router.back()}
      onChatClick={(id) => router.push(`/chats/${id}`)}
      onReviewClick={() => router.push("/mypage/review")}
      onReceiptClick={() => router.push("/products/1/receipt")}
      onProductClick={(id) => router.push(`/products/${id}`)}
      onWinningBidClick={() => router.push("/notifications")}
      onOutbidClick={() => router.push("/notifications")}
      themeColor="#98E446"
    />
  );
}

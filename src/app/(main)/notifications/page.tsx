"use client";

import { useRouter } from "next/navigation";

import NotificationScreen from "./index";

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <NotificationScreen
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      onAuctionClick={(id) => router.push(`/auctions/${id}`)}
      onTargetUrl={(url) => router.push(url)}
      themeColor="#98E446"
    />
  );
}

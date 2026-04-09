"use client";

import { useRouter } from "next/navigation";

import OutbidNotificationScreen from "./index";

export default function OutbidPage() {
  const router = useRouter();

  return (
    <OutbidNotificationScreen
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/auctions/${id}`)}
      themeColor="#F64257"
    />
  );
}

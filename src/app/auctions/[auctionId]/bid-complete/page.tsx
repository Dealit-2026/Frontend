"use client";

import { useRouter } from "next/navigation";

import BidPlacementCompleteScreen from "./index";

export default function BidCompletePage() {
  const router = useRouter();

  return (
    <BidPlacementCompleteScreen
      productName="아이폰 14 Pro 256GB 딥퍼플"
      sellerName="비드마스터"
      bidAmount={850000}
      remainingTime="12시간 30분"
      productId={1}
      onBrowseOther={() => router.push("/auctions")}
      onProductDetail={() => router.push("/auctions/1")}
      themeColor="#F64257"
    />
  );
}

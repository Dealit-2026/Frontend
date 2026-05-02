"use client";

import { useRouter } from "next/navigation";

import BidPlacementCompleteScreen from "./index";

export default function BidCompletePage() {
  const router = useRouter();

  return (
    <BidPlacementCompleteScreen
      productName=""
      sellerName=""
      bidAmount={0}
      remainingTime=""
      productId={0}
      onBrowseOther={() => router.push("/auctions")}
      onProductDetail={() => router.push("/auctions")}
      themeColor="#F64257"
    />
  );
}

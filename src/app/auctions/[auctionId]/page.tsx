"use client";

import { useParams, useRouter } from "next/navigation";

import AuctionDetailScreen from "./index";

export default function AuctionDetailPage() {
  const params = useParams<{ auctionId: string }>();
  const router = useRouter();
  const auctionId = Number(params.auctionId) || 1;

  return (
    <AuctionDetailScreen
      productId={auctionId}
      onBack={() => router.back()}
      onBidStatusClick={() => router.push(`/auctions/${auctionId}/bidding-status`)}
      onChatClick={() => router.push("/chats/1")}
      onReportClick={() => router.push(`/products/${auctionId}/report`)}
      onPurchaseClick={() => router.push(`/products/${auctionId}/payment`)}
      onBidComplete={() => router.push(`/auctions/${auctionId}/bid-complete`)}
      themeColor="#F64257"
      mode="auction"
      showToast={() => {}}
    />
  );
}

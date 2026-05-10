"use client";

import { useParams, useRouter } from "next/navigation";

import AuctionDetailScreen from "./index";
import { findExistingChatRoomByProductId } from "@/services/chats/service";
import { fetchAuctionDetail } from "@/services/auction/detail/service";
import { EventStreamProvider } from "@/services/events/EventStreamProvider";

type BidCompleteData = {
  bidAmount: number;
};

export default function AuctionDetailPage() {
  const params = useParams<{ auctionId: string }>();
  const router = useRouter();
  const auctionId = Number(params.auctionId) || 1;

  const handleChatClick = async () => {
    try {
      const auctionDetail = await fetchAuctionDetail(auctionId);
      const productId = auctionDetail.productId;
      const existingRoom = await findExistingChatRoomByProductId(productId);

      if (existingRoom) {
        router.push(`/chats/${existingRoom.roomId}`);
        return;
      }

      router.push(`/chats/new?productId=${productId}`);
    } catch (error) {
      console.error("Failed to open auction chat:", error);
      router.push(`/chats/new?productId=${auctionId}`);
    }
  };

  return (
    <EventStreamProvider enabled>
      <AuctionDetailScreen
        productId={auctionId}
        onBack={() => router.back()}
        onBidStatusClick={() => router.push(`/auctions/${auctionId}/bidding-status`)}
        onChatClick={handleChatClick}
        onReportClick={() => router.push(`/products/${auctionId}/report`)}
        onPurchaseClick={() => router.push(`/products/${auctionId}/payment`)}
        onBidComplete={(data: BidCompleteData) => {
          router.replace(
            `/auctions/${auctionId}/bid-complete?bidPrice=${data.bidAmount}`,
          );
        }}
        themeColor="#F64257"
        mode="auction"
        showToast={() => {}}
      />
    </EventStreamProvider>
  );
}

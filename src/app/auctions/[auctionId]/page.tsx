"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Toast from "@/components/common/Toast";
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
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const handleChatClick = async () => {
    if (isOpeningChat) {
      return;
    }

    try {
      setIsOpeningChat(true);
      const auction = await fetchAuctionDetail(auctionId);
      const productId = auction.productId;
      const existingRoom = await findExistingChatRoomByProductId(productId);

      if (existingRoom) {
        router.push(`/chats/${existingRoom.roomId}`);
        return;
      }

      router.push(`/chats/new?productId=${productId}`);
    } catch (err) {
      console.error("Failed to open auction chat:", err);
    } finally {
      setIsOpeningChat(false);
    }
  };

  return (
    <>
      <EventStreamProvider enabled>
        <AuctionDetailScreen
          productId={auctionId}
          onBack={() => router.back()}
          onBidStatusClick={() =>
            router.push(`/auctions/${auctionId}/bidding-status`)
          }
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
          showToast={showToast}
        />
      </EventStreamProvider>
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}

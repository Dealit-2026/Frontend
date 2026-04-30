"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductDetailScreen from "./index";
import { findExistingChatRoomByProductId } from "@/services/chats/service";

export default function ProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const productId = Number(params.productId) || 1;
  const [isOpeningChat, setIsOpeningChat] = useState(false);

  const handleChatClick = async () => {
    if (isOpeningChat) return;

    try {
      setIsOpeningChat(true);
      const existingRoom = await findExistingChatRoomByProductId(productId);

      if (existingRoom) {
        router.push(`/chats/${existingRoom.roomId}`);
        return;
      }

      router.push(`/chats/new?productId=${productId}`);
    } catch (error) {
      console.error("Failed to open chat:", error);
      router.push(`/chats/new?productId=${productId}`);
    } finally {
      setIsOpeningChat(false);
    }
  };

  return (
    <ProductDetailScreen
      productId={productId}
      onBack={() => router.back()}
      onBidStatusClick={() => router.push(`/auctions/${productId}/bidding-status`)}
      onChatClick={handleChatClick}
      onReportClick={() => router.push(`/products/${productId}/report`)}
      onPurchaseClick={() => router.push(`/products/${productId}/regular-purchase`)}
      onBidComplete={() => router.push(`/auctions/${productId}/bid-complete`)}
      themeColor="#98E446"
      mode="regular"
      showToast={() => {}}
    />
  );
}

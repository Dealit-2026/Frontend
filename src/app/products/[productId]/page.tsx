"use client";

import { useParams, useRouter } from "next/navigation";

import ProductDetailScreen from "./index";

export default function ProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const productId = Number(params.productId) || 1;

  return (
    <ProductDetailScreen
      productId={productId}
      onBack={() => router.back()}
      onBidStatusClick={() => router.push(`/auctions/${productId}/bidding-status`)}
      onChatClick={() => router.push("/chats/1")}
      onReportClick={() => router.push(`/products/${productId}/report`)}
      onPurchaseClick={() => router.push(`/products/${productId}/regular-purchase`)}
      onBidComplete={() => router.push(`/auctions/${productId}/bid-complete`)}
      themeColor="#98E446"
      mode="regular"
      showToast={() => {}}
    />
  );
}

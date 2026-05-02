"use client";

import ProductDetailScreen from "../../products/[productId]";

export default function AuctionDetailScreen(props: any) {
  return (
    <ProductDetailScreen
      {...props}
      mode="auction"
      auctionStatus="AUCTION_SCHEDULED"
    />
  );
}

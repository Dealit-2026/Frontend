"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import BidPlacementCompleteScreen from "./index";
import {
  fetchAuctionDetail,
  getAuctionMainImageUrl,
  getAuctionRemainingTimeLabel,
} from "@/services/auction/detail/service";
import type { AuctionDetailResponse } from "@/services/auction/detail/types";

export default function BidCompletePage() {
  const router = useRouter();
  const params = useParams<{ auctionId: string }>();
  const searchParams = useSearchParams();
  const auctionId = Number(params.auctionId);
  const safeAuctionId = Number.isFinite(auctionId) ? auctionId : 0;
  const bidPrice = Number(searchParams.get("bidPrice"));
  const safeBidPrice = Number.isFinite(bidPrice) ? bidPrice : 0;
  const [auctionDetail, setAuctionDetail] =
    useState<AuctionDetailResponse | null>(null);

  useEffect(() => {
    if (safeAuctionId > 0) {
      fetchAuctionDetail(safeAuctionId)
        .then(setAuctionDetail)
        .catch(() => setAuctionDetail(null));
    }
  }, [safeAuctionId]);

  return (
    <BidPlacementCompleteScreen
      productName={auctionDetail?.name ?? ""}
      sellerName={auctionDetail?.seller.nickname ?? ""}
      bidAmount={safeBidPrice}
      remainingTime={
        auctionDetail
          ? getAuctionRemainingTimeLabel(
              auctionDetail.endsAt,
              auctionDetail.serverTime,
            )
          : ""
      }
      productId={auctionDetail?.productId ?? safeAuctionId}
      productImageUrl={getAuctionMainImageUrl(auctionDetail)}
      onBack={() => router.replace(`/auctions/${safeAuctionId}`)}
      onBrowseOther={() => router.push("/auctions")}
      onProductDetail={() => router.replace(`/auctions/${safeAuctionId}`)}
      themeColor="#F64257"
    />
  );
}

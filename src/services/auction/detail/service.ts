import * as auctionDetailApi from "@/services/auction/detail/api";
import type { AuctionDetailResponse } from "@/services/auction/detail/types";

export async function fetchAuctionDetail(auctionId: number) {
  return auctionDetailApi.getAuctionDetail(auctionId);
}

export async function placeAuctionBid(auctionId: number, bidPrice: number) {
  return auctionDetailApi.postAuctionBid(auctionId, { bidPrice });
}

export function getAuctionMainImageUrl(data: AuctionDetailResponse | null) {
  return data?.images?.[0]?.imageUrl ?? "";
}

export function getAuctionDisplayCurrentPrice(
  data: AuctionDetailResponse | null,
) {
  return data?.currentPrice ?? 0;
}

export function getAuctionRemainingTimeLabel(
  endsAt: string | undefined,
  serverTime: string | undefined,
) {
  if (!endsAt || !serverTime) {
    return "남은 시간 확인 중";
  }

  const remainingMs =
    new Date(endsAt).getTime() - new Date(serverTime).getTime();

  if (!Number.isFinite(remainingMs) || remainingMs <= 0) {
    return "경매 종료";
  }

  const totalMinutes = Math.floor(remainingMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }

  return `${minutes}분 남음`;
}

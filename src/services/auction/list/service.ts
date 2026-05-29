import * as auctionListApi from "@/services/auction/list/api";
import { getApiTime } from "@/services/dateTime";
import type {
  AuctionListItemResponse,
  AuctionListItemViewModel,
  AuctionStatus,
} from "@/services/auction/list/types";

const DEFAULT_CATEGORY_LABEL = "카테고리 없음";
const DEFAULT_LOCATION_LABEL = "지역 정보 없음";

function formatPrice(price: number) {
  return `${Number(price || 0).toLocaleString()}원`;
}

function formatAuctionStatus(status: AuctionStatus) {
  switch (status) {
    case "ONGOING":
      return "진행중";
    case "ENDED":
      return "종료";
    case "NO_BID":
      return "유찰";
    case "SUCCESSFUL_BID":
      return "낙찰";
    case "DRAFT":
    default:
      return "준비중";
  }
}

function formatEndAt(endAt: string) {
  const endTime = getApiTime(endAt);
  if (!Number.isFinite(endTime)) {
    return "마감 시간 없음";
  }

  const diffMs = endTime - Date.now();
  if (diffMs <= 0) {
    return "마감";
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }
  return `${Math.max(1, minutes)}분 남음`;
}

function toAuctionListItemViewModel(
  item: AuctionListItemResponse,
): AuctionListItemViewModel {
  const currentPriceLabel = formatPrice(item.currentPrice);
  return {
    productId: item.productId,
    auctionId: item.auctionId,
    name: item.title,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel: currentPriceLabel,
    startPriceLabel: formatPrice(item.startPrice),
    currentPriceLabel,
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    bidCount: item.bidCount,
    endAt: item.endAt,
    endAtLabel: formatEndAt(item.endAt),
    auctionStatus: item.auctionStatus,
    auctionStatusLabel: formatAuctionStatus(item.auctionStatus),
    popularScore: item.popularScore,
    rank: item.rank,
    createdAt: item.createdAt,
  };
}

export async function fetchPopularAuctions(
  limit = 4,
): Promise<AuctionListItemViewModel[]> {
  const response = await auctionListApi.getPopularAuctions(limit);
  return response.content.map(toAuctionListItemViewModel);
}

export async function fetchClosingSoonAuctions(
  limit = 3,
): Promise<AuctionListItemViewModel[]> {
  const response = await auctionListApi.getClosingSoonAuctions(limit);
  return response.content.map(toAuctionListItemViewModel);
}

import * as buyingAuctionApi from "@/services/buying-auction/api";
import type {
  BuyingAuctionListViewModel,
  BuyingAuctionStatus,
  BuyingAuctionViewModel,
  MyBuyingAuctionItemResponse,
} from "@/services/buying-auction/types";

function formatWon(value: number) {
  return `${Number(value || 0).toLocaleString()}원`;
}

function formatTimeLabel(endsAt: string, status: BuyingAuctionStatus) {
  if (status === "ENDED") {
    return "종료";
  }

  const endTime = new Date(endsAt).getTime();
  const diff = endTime - Date.now();

  if (!Number.isFinite(endTime) || diff <= 0) {
    return "종료 임박";
  }

  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const remainMinutes = minutes % 60;

  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }

  if (hours > 0) {
    return `${hours}시간 ${remainMinutes}분 남음`;
  }

  return `${Math.max(remainMinutes, 1)}분 남음`;
}

function getStatusMeta(status: BuyingAuctionStatus) {
  switch (status) {
    case "LEADING":
      return {
        label: "최고 입찰자입니다",
        className: "bg-blue-50 text-blue-600",
      };
    case "OUTBID":
      return {
        label: "상위 입찰자가 있습니다",
        className: "bg-red-50 text-red-500",
      };
    case "ENDED":
    default:
      return {
        label: "종료된 경매입니다",
        className: "bg-gray-100 text-gray-500",
      };
  }
}

export function toBuyingAuctionViewModel(
  auction: MyBuyingAuctionItemResponse,
): BuyingAuctionViewModel {
  const statusMeta = getStatusMeta(auction.buyingStatus);

  return {
    productId: auction.productId,
    auctionId: auction.auctionId,
    name: auction.name,
    imageUrl: auction.thumbnailUrl,
    categoryName: auction.categoryName || "경매",
    location: auction.location || "지역 미설정",
    myBidPriceLabel: formatWon(auction.myBidAmount),
    currentPriceLabel: formatWon(auction.currentHighestBidAmount),
    status: auction.buyingStatus,
    statusLabel: statusMeta.label,
    statusClassName: statusMeta.className,
    timeLabel: formatTimeLabel(auction.endsAt, auction.buyingStatus),
    bidCountLabel: `입찰 ${auction.bidCount}회 · ${auction.bidderCount}명`,
    canHide: auction.buyingStatus === "ENDED",
  };
}

export async function fetchMyBuyingAuctions(
  page = 0,
  size = 20,
): Promise<BuyingAuctionListViewModel> {
  const response = await buyingAuctionApi.getMyBuyingAuctions(page, size);

  return {
    items: response.content.map(toBuyingAuctionViewModel),
    page: response.page,
    size: response.size,
    totalElements: response.totalElements,
    hasNext: response.hasNext,
  };
}

export async function fetchMyBuyingAuctionCount() {
  const response = await buyingAuctionApi.getMyBuyingAuctions(0, 1);

  return response.totalElements;
}

export async function hideMyBuyingAuction(auctionId: number) {
  await buyingAuctionApi.deleteMyBuyingAuction(auctionId);
}

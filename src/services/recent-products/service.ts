import * as recentProductsApi from "@/services/recent-products/api";
import type {
  RecentProductItemResponse,
  RecentProductItemViewModel,
} from "@/services/recent-products/types";

const DEFAULT_CATEGORY_LABEL = "카테고리 없음";
const DEFAULT_LOCATION_LABEL = "지역 정보 없음";

function formatPrice(price: number | null | undefined) {
  return `${Number(price || 0).toLocaleString()}원`;
}

function toRecentProductItemViewModel(
  item: RecentProductItemResponse,
): RecentProductItemViewModel {
  const isAuction = item.type === "AUCTION";
  const price = isAuction ? item.currentPrice : item.price;
  const priceLabel = formatPrice(price);

  return {
    saleType: item.type,
    productId: item.productId,
    auctionId: item.auctionId,
    name: item.name,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel,
    currentPriceLabel: isAuction ? priceLabel : undefined,
    categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    viewCount: 0,
    favoriteCount: 0,
    createdAt: item.viewedAt,
    viewedAt: item.viewedAt,
    auctionStatusLabel: isAuction ? "경매" : undefined,
  };
}

export async function fetchRecentProducts(
  size = 20,
): Promise<RecentProductItemViewModel[]> {
  const response = await recentProductsApi.getRecentProducts(size);

  return response.content.map(toRecentProductItemViewModel);
}

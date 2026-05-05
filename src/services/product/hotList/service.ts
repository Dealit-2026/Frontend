import * as hotListApi from "@/services/product/hotList/api";
import type { HotListProductItemResponse } from "@/services/product/hotList/types";

const DEFAULT_CATEGORY_LABEL = "카테고리 없음";
const DEFAULT_LOCATION_LABEL = "지역 정보 없음";

function formatPrice(price: number) {
  return `${Number(price || 0).toLocaleString()}원`;
}

export interface HotListProductItemViewModel {
  productId: number;
  name: string;
  thumbnailUrl?: string | null;
  priceLabel: string;
  location: string;
  categoryName: string;
  viewCount: number;
  favoriteCount: number;
  chatCount: number;
  hotScore: number;
  rank: number;
  createdAt: string;
}

function toHotListProductItemViewModel(
  item: HotListProductItemResponse,
): HotListProductItemViewModel {
  return {
    productId: item.productId,
    name: item.name,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel: formatPrice(item.price),
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    viewCount: item.viewCount,
    favoriteCount: item.favoriteCount,
    chatCount: item.chatCount ?? 0,
    hotScore: item.hotScore,
    rank: item.rank,
    createdAt: item.createdAt,
  };
}

export async function fetchHotRegularProducts(
  size = 8,
): Promise<HotListProductItemViewModel[]> {
  const response = await hotListApi.getHotListProducts(size);
  return response.content.map(toHotListProductItemViewModel);
}

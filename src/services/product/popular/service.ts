import * as popularProductApi from "@/services/product/popular/api";
import type {
  PopularProductItemResponse,
  PopularProductItemViewModel,
} from "@/services/product/popular/types";

const DEFAULT_CATEGORY_LABEL = "카테고리 없음";
const DEFAULT_LOCATION_LABEL = "지역 정보 없음";

function formatPrice(price: number) {
  return `${Number(price || 0).toLocaleString()}원`;
}

function toPopularProductItemViewModel(
  item: PopularProductItemResponse,
): PopularProductItemViewModel {
  return {
    productId: item.productId,
    name: item.name,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel: formatPrice(item.price),
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    viewCount: item.viewCount,
    popularScore: item.popularScore,
  };
}

export async function fetchPopularRegularProducts(
  size = 10,
): Promise<PopularProductItemViewModel[]> {
  const response = await popularProductApi.getPopularProducts(size);
  return response.content.map(toPopularProductItemViewModel);
}

import * as wishlistApi from "@/services/wishlist/api";
import type {
  WishlistItemResponse,
  WishlistItemViewModel,
} from "@/services/wishlist/types";

const DEFAULT_CATEGORY_LABEL = "카테고리 없음";
const DEFAULT_LOCATION_LABEL = "지역 정보 없음";

function formatPrice(price: number) {
  return `${Number(price || 0).toLocaleString()}원`;
}

function toWishlistItemViewModel(
  item: WishlistItemResponse,
): WishlistItemViewModel {
  return {
    productId: item.productId,
    name: item.name,
    status: item.status,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel: formatPrice(item.price),
    categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    favoriteCount: item.favoriteCount,
    likedAt: item.likedAt,
  };
}

export async function fetchRegularWishlist(): Promise<
  WishlistItemViewModel[]
> {
  const response = await wishlistApi.getMyWishlist();

  return response.content
    .filter((item) => item.saleType === "REGULAR")
    .map(toWishlistItemViewModel);
}

export async function addRegularWishlist(productId: number) {
  return wishlistApi.addWishlist(productId);
}

export async function removeRegularWishlist(productId: number) {
  return wishlistApi.removeWishlist(productId);
}

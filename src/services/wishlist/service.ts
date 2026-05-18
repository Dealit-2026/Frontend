import * as wishlistApi from "@/services/wishlist/api";
import type {
  AuctionWishlistItemResponse,
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
    itemType: "REGULAR",
    auctionId: null,
    productId: item.productId,
    name: item.name,
    status: item.status,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel: formatPrice(item.price),
    categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    favoriteCount: item.favoriteCount,
    likedAt: item.likedAt,
    metaLabel: "일반 상품",
  };
}

function toAuctionWishlistItemViewModel(
  item: AuctionWishlistItemResponse,
): WishlistItemViewModel {
  return {
    itemType: "AUCTION",
    auctionId: item.auctionId,
    productId: item.productId,
    name: item.name,
    status: item.auctionStatus,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel: formatPrice(item.currentPrice),
    categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    favoriteCount: item.favoriteCount,
    likedAt: item.likedAt,
    metaLabel: `경매 상품 · 입찰 ${item.bidCount}명`,
  };
}

function sortByLikedAtDesc(
  items: WishlistItemViewModel[],
): WishlistItemViewModel[] {
  return [...items].sort(
    (a, b) => new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime(),
  );
}

export async function fetchRegularWishlist(): Promise<WishlistItemViewModel[]> {
  const response = await wishlistApi.getMyWishlist();

  return response.content
    .filter((item) => item.saleType === "REGULAR")
    .map(toWishlistItemViewModel);
}

export async function fetchAuctionWishlist(): Promise<WishlistItemViewModel[]> {
  const response = await wishlistApi.getMyAuctionWishlist();

  return response.content.map(toAuctionWishlistItemViewModel);
}

export async function fetchMyWishlist(): Promise<WishlistItemViewModel[]> {
  const [regularItems, auctionItems] = await Promise.all([
    fetchRegularWishlist(),
    fetchAuctionWishlist(),
  ]);

  return sortByLikedAtDesc([...regularItems, ...auctionItems]);
}

export async function addWishlist(productId: number) {
  return wishlistApi.addWishlist(productId);
}

export async function removeWishlist(productId: number) {
  return wishlistApi.removeWishlist(productId);
}

export async function addRegularWishlist(productId: number) {
  return addWishlist(productId);
}

export async function removeRegularWishlist(productId: number) {
  return removeWishlist(productId);
}

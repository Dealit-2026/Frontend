export type WishlistSaleType = "REGULAR" | "AUCTION";

export interface WishlistItemResponse {
  productId: number;
  name: string;
  saleType: WishlistSaleType;
  status: string;
  thumbnailUrl: string | null;
  price: number;
  categoryName: string | null;
  location: string | null;
  favoriteCount: number;
  likedAt: string;
}

export interface WishlistListResponse {
  content: WishlistItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface AuctionWishlistItemResponse {
  auctionId: number;
  productId: number;
  name: string;
  thumbnailUrl: string | null;
  categoryName: string | null;
  location: string | null;
  favoriteCount: number;
  currentPrice: number;
  bidCount: number;
  auctionStatus: string;
  endedAt: string;
  likedAt: string;
}

export interface AuctionWishlistListResponse {
  content: AuctionWishlistItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface WishlistToggleResponse {
  productId: number;
  liked: boolean;
  favoriteCount: number;
}

export interface WishlistItemViewModel {
  itemType: WishlistSaleType;
  auctionId: number | null;
  productId: number;
  name: string;
  status: string;
  thumbnailUrl: string | null;
  priceLabel: string;
  categoryName: string;
  location: string;
  favoriteCount: number;
  likedAt: string;
  metaLabel: string;
}

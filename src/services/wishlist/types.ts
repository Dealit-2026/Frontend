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

export interface WishlistToggleResponse {
  productId: number;
  liked: boolean;
  favoriteCount: number;
}

export interface WishlistItemViewModel {
  productId: number;
  name: string;
  status: string;
  thumbnailUrl: string | null;
  priceLabel: string;
  categoryName: string;
  location: string;
  favoriteCount: number;
  likedAt: string;
}

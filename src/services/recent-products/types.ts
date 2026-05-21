export type RecentProductType = "REGULAR" | "AUCTION";

export interface RecentProductItemResponse {
  type: RecentProductType;
  productId: number;
  auctionId: number | null;
  name: string;
  thumbnailUrl: string | null;
  price: number | null;
  currentPrice: number | null;
  location: string | null;
  categoryName: string | null;
  viewedAt: string;
}

export interface RecentProductListResponse {
  content: RecentProductItemResponse[];
  size: number;
}

export interface RecentProductItemViewModel {
  saleType: RecentProductType;
  productId: number;
  auctionId: number | null;
  name: string;
  thumbnailUrl: string | null;
  priceLabel: string;
  currentPriceLabel?: string;
  categoryName: string;
  location: string;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  viewedAt: string;
  auctionStatusLabel?: string;
}

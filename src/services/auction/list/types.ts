export type AuctionStatus =
  | "DRAFT"
  | "ONGOING"
  | "ENDED"
  | "NO_BID"
  | "SUCCESSFUL_BID";

export interface AuctionListItemResponse {
  auctionId: number;
  productId: number;
  title: string;
  thumbnailUrl: string | null;
  startPrice: number;
  currentPrice: number;
  bidCount: number;
  endAt: string;
  auctionStatus: AuctionStatus;
  location: string | null;
  categoryName: string | null;
  sellerId: number;
  popularScore: number;
  rank: number;
  createdAt: string;
}

export interface AuctionListResponse {
  content: AuctionListItemResponse[];
}

export interface AuctionListItemViewModel {
  productId: number;
  auctionId: number;
  name: string;
  thumbnailUrl: string | null;
  priceLabel: string;
  startPriceLabel: string;
  currentPriceLabel: string;
  location: string;
  categoryName: string;
  bidCount: number;
  endAt: string;
  endAtLabel: string;
  auctionStatus: AuctionStatus;
  auctionStatusLabel: string;
  popularScore: number;
  rank: number;
  createdAt: string;
}

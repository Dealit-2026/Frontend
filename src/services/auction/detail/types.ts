export type AuctionDetailStatus =
  | "AUCTION_SCHEDULED"
  | "AUCTION_LIVE"
  | "AUCTION_ENDED"
  | "ONGOING"
  | "ENDED"
  | "NO_BID"
  | "SUCCESSFUL_BID";

export interface AuctionDetailImage {
  imageId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface AuctionDetailSeller {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
  rating?: number | null;
  bio?: string | null;
}

export interface AuctionDetailResponse {
  auctionId: number;
  productId: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  location: string;
  images: AuctionDetailImage[];
  seller: AuctionDetailSeller;
  startPrice: number;
  currentPrice: number;
  minimumBidAmount: number;
  minimumNextBidPrice: number;
  bidCount: number;
  bidderCount: number;
  startAt: string;
  endsAt: string;
  serverTime: string;
  status: AuctionDetailStatus;
  liked: boolean;
  favoriteCount: number;
}

export interface CreateAuctionBidRequest {
  bidPrice: number;
}

export interface CreateAuctionBidResponse {
  auctionId: number;
  currentPrice: number;
  bidderId: number;
  serverTime: string;
}

export interface AuctionBidHistoryItem {
  bidId: number;
  bidderId: number;
  bidderNickname: string;
  bidderProfileImageUrl: string | null;
  bidPrice: number;
  bidAt: string;
  highest: boolean;
}

export interface AuctionBidHistoryResponse {
  auctionId: number;
  currentPrice: number;
  bidCount: number;
  bids: AuctionBidHistoryItem[];
}

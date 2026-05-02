export type AuctionDetailStatus =
  | "AUCTION_SCHEDULED"
  | "AUCTION_LIVE"
  | "AUCTION_ENDED"
  | "ENDED";

export interface AuctionDetailImage {
  imageId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface AuctionDetailSeller {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
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

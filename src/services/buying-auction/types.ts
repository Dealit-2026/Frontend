export type BuyingAuctionStatus = "LEADING" | "OUTBID" | "ENDED";

export interface MyBuyingAuctionItemResponse {
  productId: number;
  auctionId: number;
  name: string;
  thumbnailUrl: string | null;
  categoryName: string | null;
  location: string | null;
  myBidAmount: number;
  currentHighestBidAmount: number;
  buyingStatus: BuyingAuctionStatus;
  auctionStatus: string;
  bidCount: number;
  bidderCount: number;
  endsAt: string;
  lastBidAt: string | null;
}

export interface MyBuyingAuctionListResponse {
  content: MyBuyingAuctionItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface BuyingAuctionViewModel {
  productId: number;
  auctionId: number;
  name: string;
  imageUrl: string | null;
  categoryName: string;
  location: string;
  myBidPriceLabel: string;
  currentPriceLabel: string;
  status: BuyingAuctionStatus;
  statusLabel: string;
  statusClassName: string;
  timeLabel: string;
  bidCountLabel: string;
  canHide: boolean;
}

export interface BuyingAuctionListViewModel {
  items: BuyingAuctionViewModel[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

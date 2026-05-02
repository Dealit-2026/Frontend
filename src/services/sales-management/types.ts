export type SalesManagementSaleType = "REGULAR" | "AUCTION";

export type RegularSalesManagementStatus =
  | "DRAFT"
  | "ON_SALE"
  | "SOLD"
  | "ENDED";

export type AuctionSalesManagementStatus =
  | "DRAFT"
  | "ONGOING"
  | "ON_SALE"
  | "AUCTION_LIVE"
  | "AUCTION_SCHEDULED"
  | "AUCTION_ENDED"
  | "ENDED"
  | "NO_BID"
  | "SUCCESSFUL_BID";

export interface RegularSalesManagementItemResponse {
  productId: number;
  name: string;
  description: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  productStatus: RegularSalesManagementStatus;
  price: number;
  location: string;
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegularSalesManagementListResponse {
  content: RegularSalesManagementItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface AuctionSalesManagementItemResponse {
  productId: number;
  auctionId: number;
  name: string;
  description: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  auctionStatus?: AuctionSalesManagementStatus | null;
  status?: AuctionSalesManagementStatus | null;
  startPrice: number | null;
  minimumBidAmount: number | null;
  currentPrice: number | null;
  minimumNextBidPrice: number | null;
  bidCount: number;
  bidderCount: number;
  startAt: string | null;
  endAt: string | null;
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuctionSalesManagementListResponse {
  content: AuctionSalesManagementItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface SalesManagementListSummary {
  regularCount: number;
  auctionCount: number;
}

export interface ProductEditDetailResponse {
  productId: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string | null;
  location: string;
  images: {
    imageId: number;
    imageUrl: string;
    sortOrder: number;
  }[];
  price: number;
  allowOffer: boolean;
  status: RegularSalesManagementStatus;
  editable: boolean;
}

export interface AuctionEditDetailResponse {
  productId: number;
  auctionId: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string | null;
  location: string;
  images: {
    imageId: number;
    imageUrl: string;
    sortOrder: number;
  }[];
  startPrice: number;
  auctionDurationDays: number;
  auctionStatus: AuctionSalesManagementStatus;
  bidCount: number;
  bidderCount: number;
  canEdit: boolean;
}

export interface UpdateRegularSalesManagementProductRequest {
  name: string;
  description: string;
  categoryId: number;
  price: number;
  allowOffer: boolean;
  location: string;
  images: {
    imageId: number;
    imageUrl: string;
    sortOrder: number;
  }[];
}

export interface UpdateAuctionSalesManagementProductRequest {
  name: string;
  description: string;
  categoryId: number;
  startPrice: number;
  auctionDurationDays: number;
  location: string;
  images: {
    imageId: number;
    imageUrl: string;
    sortOrder: number;
  }[];
}

export interface SalesManagementItemViewModel {
  id: string;
  productId: number;
  auctionId?: number;
  type: "regular" | "auction";
  name: string;
  description: string;
  status: string;
  statusLabel: string;
  price: number;
  priceLabel: string;
  imageUrl: string | null;
  category: string;
  location: string | null;
  bidders: number | null;
  bidderCount: number | null;
  editable: boolean;
  deletable: boolean;
  createdAt: string;
  updatedAt: string;
}

import type { LocationFormValues, LocationSource } from "@/services/location/types";

export interface MyProfileResponse {
  id: number;
  name: string | null;
  nickname: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  location: string | null;
  verified: boolean;
  rating: number;
  warningCount: number;
  biddingCount: number;
  sellingCount: number;
  wishlistCount: number;
}

export interface UpdateMyProfileRequest {
  name?: string | null;
  nickname: string;
  bio: string;
  profileImageUrl?: string | null;
}

export interface MyLocationResponse {
  location: string;
  postalCode: string | null;
  roadAddress: string | null;
  jibunAddress: string | null;
  detailAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  locationSource: LocationSource | null;
}

export interface UpdateMyLocationRequest {
  location: string;
  postalCode: string | null;
  roadAddress: string | null;
  jibunAddress: string | null;
  detailAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  locationSource: LocationSource | null;
}

export interface UpdateMyLocationResponse extends MyLocationResponse {}

export interface UploadProfileImageResponse {
  profileImageUrl: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface MySellingAuctionItemResponse {
  productId: number;
  auctionId: number;
  name: string;
  description: string;
  categoryName: string;
  categoryId?: number | null;
  thumbnailUrl: string | null;
  auctionStatus: "AUCTION_LIVE";
  startPrice: number;
  currentPrice: number;
  minimumNextBidPrice: number;
  bidCount: number;
  bidderCount: number;
  startAt: string;
  endAt: string;
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MySellingAuctionViewModel {
  id: number;
  auctionId: number;
  name: string;
  type: "auction";
  status: string;
  price: string;
  img: string | null;
  description: string;
  category: string;
  categoryId: number | null;
  location: string;
  bidders: number;
  bidCount: number;
  canEdit: boolean;
  canDelete: boolean;
  startPrice: number;
  currentPrice: number;
  minimumNextBidPrice: number;
  startAt: string;
  endAt: string;
}

export interface AuctionEditImageResponse {
  imageId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface AuctionEditDetailResponse {
  productId: number;
  auctionId: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  location: string;
  startPrice: number;
  auctionDurationDays: number;
  images: AuctionEditImageResponse[];
  canEdit: boolean;
}

export interface AuctionEditInitialData {
  productId: number;
  auctionId: number;
  type: "auction";
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  location: string;
  price: string;
  startPrice: string;
  auctionDurationDays: number;
  images: AuctionEditImageResponse[];
  canEdit: boolean;
  auction: {
    startPrice: string;
    bidUnit: string;
    durationDays: number;
  };
}

export interface MyProfileFormValues {
  name: string;
  nickname: string;
  bio: string;
  profileImageUrl: string | null;
  location: string;
}

export interface MyProfileEditViewModel {
  form: MyProfileFormValues;
  verified: boolean;
}

export interface MyPageProfileViewModel {
  id: number;
  name: string;
  nickname: string;
  email: string;
  bio: string;
  profileImageUrl: string;
  location: string;
  ratingLabel: string;
  warningLabel: string;
  biddingCount: number;
  sellingCount: number;
  wishlistCount: number;
}

export interface MyProfileDraftValues extends MyProfileFormValues {
  locationDetails?: LocationFormValues | null;
}

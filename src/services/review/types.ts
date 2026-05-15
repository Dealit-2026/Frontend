export type ReviewMode = "written" | "received";

export interface CreateReviewRequest {
  productId?: number | null;
  auctionId?: number | null;
  rating: number;
  content: string;
}

export interface ReviewResponse {
  reviewId: number;
  reviewerId: number;
  reviewerNickname: string;
  revieweeId: number;
  revieweeNickname: string;
  productId: number;
  productName: string;
  auctionId: number | null;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ReviewRatingSummaryResponse {
  memberId: number;
  averageRating: number;
  reviewCount: number;
}

export interface ReviewListResponse {
  ratingSummary: ReviewRatingSummaryResponse;
  content: ReviewResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface ReviewItemViewModel {
  reviewId: number;
  productId: number;
  auctionId: number | null;
  productName: string;
  productImageUrl: string | null;
  partnerNickname: string;
  productTypeLabel: string;
  statusLabel: string;
  rating: number;
  content: string;
  dateLabel: string;
}

export interface ReviewListViewModel {
  averageRatingLabel: string;
  reviewCountLabel: string;
  reviews: ReviewItemViewModel[];
  hasNext: boolean;
}

import * as reviewApi from "@/services/review/api";
import type {
  CreateReviewRequest,
  ReviewItemViewModel,
  ReviewListResponse,
  ReviewListViewModel,
  ReviewMode,
  ReviewResponse,
} from "@/services/review/types";

function formatDateLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/\.\s?/g, ".")
    .replace(/\.$/, "");
}

function toReviewItemViewModel(
  review: ReviewResponse,
  mode: ReviewMode,
): ReviewItemViewModel {
  return {
    reviewId: review.reviewId,
    productId: review.productId,
    auctionId: review.auctionId,
    productName: review.productName,
    partnerNickname:
      mode === "written" ? review.revieweeNickname : review.reviewerNickname,
    productTypeLabel: review.auctionId == null ? "일반" : "경매",
    statusLabel: "거래 완료",
    rating: Number(review.rating),
    content: review.content,
    dateLabel: formatDateLabel(review.createdAt),
  };
}

function toReviewListViewModel(
  response: ReviewListResponse,
  mode: ReviewMode,
): ReviewListViewModel {
  return {
    averageRatingLabel: `평점 ${response.ratingSummary.averageRating.toFixed(1)}`,
    reviewCountLabel: `${response.ratingSummary.reviewCount}개`,
    reviews: response.content.map((review) =>
      toReviewItemViewModel(review, mode),
    ),
    hasNext: response.hasNext,
  };
}

export async function fetchMyReviews(
  mode: ReviewMode,
): Promise<ReviewListViewModel> {
  const response =
    mode === "written"
      ? await reviewApi.getMyWrittenReviews()
      : await reviewApi.getMyReceivedReviews();

  return toReviewListViewModel(response, mode);
}

export function buildCreateReviewRequest(
  payload: CreateReviewRequest,
): CreateReviewRequest {
  const productId = payload.productId ?? null;
  const auctionId = payload.auctionId ?? null;

  if (productId == null && auctionId == null) {
    throw new Error("리뷰 대상 상품 정보가 없습니다.");
  }

  return {
    productId,
    auctionId,
    rating: payload.rating,
    content: payload.content.trim(),
  };
}

export async function createReview(
  payload: CreateReviewRequest,
): Promise<ReviewResponse> {
  return reviewApi.postReview(buildCreateReviewRequest(payload));
}

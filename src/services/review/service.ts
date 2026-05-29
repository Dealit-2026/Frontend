import * as reviewApi from "@/services/review/api";
import { getAuctionDetail } from "@/services/auction/detail/api";
import { formatApiDate, parseApiDate } from "@/services/dateTime";
import { getProductDetail } from "@/services/product/productDetail/api";
import type {
  CreateReviewRequest,
  ReviewItemViewModel,
  ReviewListResponse,
  ReviewListViewModel,
  ReviewMode,
  ReviewResponse,
} from "@/services/review/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

function resolveProductImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return null;
  }

  if (/^(data:|blob:|https?:\/\/)/.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  return imageUrl;
}

function formatDateLabel(value: string) {
  if (!parseApiDate(value)) {
    return "";
  }

  return formatApiDate(value, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
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
    productImageUrl: null,
    partnerNickname:
      mode === "written" ? review.revieweeNickname : review.reviewerNickname,
    productTypeLabel: review.auctionId == null ? "일반" : "경매",
    statusLabel: "거래 완료",
    rating: Number(review.rating),
    content: review.content,
    dateLabel: formatDateLabel(review.createdAt),
  };
}

async function attachProductImages(
  reviews: ReviewItemViewModel[],
): Promise<ReviewItemViewModel[]> {
  const detailResults = await Promise.allSettled(
    reviews.map((review) =>
      review.auctionId
        ? getAuctionDetail(review.auctionId).then((auction) => ({
            name: auction.name,
            imageUrl: auction.images?.[0]?.imageUrl ?? null,
          }))
        : getProductDetail(review.productId).then((product) => ({
            name: product.name,
            imageUrl: product.imageUrls?.[0] ?? null,
          })),
    ),
  );

  return reviews.map((review, index) => {
    const result = detailResults[index];

    if (result?.status !== "fulfilled") {
      return review;
    }

    return {
      ...review,
      productName: result.value.name || review.productName,
      productImageUrl: resolveProductImageUrl(result.value.imageUrl),
    };
  });
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

  const reviewList = toReviewListViewModel(response, mode);

  return {
    ...reviewList,
    reviews: await attachProductImages(reviewList.reviews),
  };
}

export async function fetchMyReceivedReviewRatingSummary() {
  const response = await reviewApi.getMyReceivedReviews(0, 1);
  return response.ratingSummary;
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

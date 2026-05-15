import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  CreateReviewRequest,
  ReviewListResponse,
  ReviewResponse,
} from "@/services/review/types";

const API_BASE = "/api/v1";

async function throwReviewApiError(
  response: Response,
  fallbackMessage: string,
) {
  if (response.status === 401) {
    handleUnauthorizedAccess();
  }

  throw new ApiRequestError(
    await getApiErrorMessage(response, fallbackMessage),
    response.status,
  );
}

export async function getMyWrittenReviews(
  page = 0,
  size = 20,
): Promise<ReviewListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(
    `${API_BASE}/users/me/reviews/written?${params}`,
    {
      method: "GET",
      headers: getAuthorizationHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    await throwReviewApiError(
      response,
      "작성한 리뷰를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getMyReceivedReviews(
  page = 0,
  size = 20,
): Promise<ReviewListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(
    `${API_BASE}/users/me/reviews/received?${params}`,
    {
      method: "GET",
      headers: getAuthorizationHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    await throwReviewApiError(response, "받은 리뷰를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function postReview(
  payload: CreateReviewRequest,
): Promise<ReviewResponse> {
  const response = await fetch(`${API_BASE}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwReviewApiError(response, "리뷰 등록에 실패했습니다.");
  }

  return response.json();
}

import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import { getAuthorizationHeaders } from "@/services/auth/service";
import type {
  InterestCategoryOptionResponse,
  UpdateMyInterestCategoriesRequest,
} from "@/services/interest-category/types";

export async function getInterestCategories(): Promise<
  InterestCategoryOptionResponse[]
> {
  const response = await fetch("/api/v1/members/interest-categories", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(
        response,
        "관심 카테고리를 불러오지 못했습니다.",
      ),
      response.status,
    );
  }

  return response.json();
}

export async function getMyInterestCategories(): Promise<
  InterestCategoryOptionResponse[]
> {
  const response = await fetch("/api/v1/users/me/interest-categories", {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(
        response,
        "관심 카테고리 설정을 불러오지 못했습니다.",
      ),
      response.status,
    );
  }

  return response.json();
}

export async function patchMyInterestCategories(
  payload: UpdateMyInterestCategoriesRequest,
): Promise<InterestCategoryOptionResponse[]> {
  const response = await fetch("/api/v1/users/me/interest-categories", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(
        response,
        "관심 카테고리 설정 저장에 실패했습니다.",
      ),
      response.status,
    );
  }

  return response.json();
}

import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type { PopularProductListResponse } from "@/services/product/popular/types";

async function throwPopularProductApiError(
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

export async function getPopularProducts(
  size = 10,
): Promise<PopularProductListResponse> {
  const params = new URLSearchParams({ size: String(size) });
  const response = await fetch(`/api/v1/products/popular?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwPopularProductApiError(
      response,
      "실시간 인기 상품을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

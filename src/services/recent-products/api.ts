import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type { RecentProductListResponse } from "@/services/recent-products/types";

const RECENT_PRODUCTS_API_BASE = "/api/v1/users/me/recent-products";

async function throwRecentProductsApiError(
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

export async function getRecentProducts(
  size = 20,
): Promise<RecentProductListResponse> {
  const params = new URLSearchParams({
    size: String(size),
  });

  const response = await fetch(`${RECENT_PRODUCTS_API_BASE}?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwRecentProductsApiError(
      response,
      "최근 본 상품을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

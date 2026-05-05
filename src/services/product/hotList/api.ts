import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type { HotListProductListResponse } from "./types";

async function throwHotListApiError(
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

export async function getHotListProducts(
  size = 8,
): Promise<HotListProductListResponse> {
  const params = new URLSearchParams({ size: String(size) });
  const response = await fetch(`/api/v1/products/hot-list?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwHotListApiError(response, "핫한 상품을 불러오지 못했습니다.");
  }

  return response.json();
}

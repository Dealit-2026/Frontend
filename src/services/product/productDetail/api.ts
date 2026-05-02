import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type { ProductDetailResponse } from "./types";

async function throwProductDetailApiError(
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

export async function getProductDetail(
  productId: number,
): Promise<ProductDetailResponse> {
  const response = await fetch(`/api/v1/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProductDetailApiError(
      response,
      "상품 상세 정보를 조회하지 못했습니다.",
    );
  }

  return response.json();
}

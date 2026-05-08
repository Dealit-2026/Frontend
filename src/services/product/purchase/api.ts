import { ApiRequestError, getApiErrorDetail } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  ProductPurchaseAvailabilityResponse,
  PurchaseReceiptResponse,
  PurchaseRequest,
  PurchaseStatusActionResponse,
  PurchaseResponse,
} from "@/services/product/purchase/types";

async function throwProtectedApiError(
  response: Response,
  fallbackMessage: string,
) {
  if (response.status === 401) {
    handleUnauthorizedAccess();
  }

  const detail = await getApiErrorDetail(response, fallbackMessage);

  throw new ApiRequestError(detail.message, response.status, detail.code);
}

export async function getPurchaseProductDetail(
  productId: number,
): Promise<ProductPurchaseAvailabilityResponse> {
  const response = await fetch(`/api/v1/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "상품 구매 정보를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function postProductPurchase(
  productId: number,
  payload: PurchaseRequest,
): Promise<PurchaseResponse> {
  const response = await fetch(`/api/v1/products/${productId}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "상품 결제에 실패했습니다.");
  }

  return response.json();
}

export async function getPurchaseReceipt(
  purchaseId: number,
): Promise<PurchaseReceiptResponse> {
  const response = await fetch(`/api/v1/purchases/${purchaseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "영수증 정보를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function postPurchaseShip(
  purchaseId: number,
): Promise<PurchaseStatusActionResponse> {
  const response = await fetch(`/api/v1/purchases/${purchaseId}/ship`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "발송 처리에 실패했습니다.");
  }

  return response.json();
}

export async function postPurchaseReceive(
  purchaseId: number,
): Promise<PurchaseStatusActionResponse> {
  const response = await fetch(`/api/v1/purchases/${purchaseId}/receive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "수령 확정에 실패했습니다.");
  }

  return response.json();
}

import { PURCHASE_RECEIPT_URL, SALES_RECEIPT_URL } from "./urls";
import type { TransactionReceiptResponse } from "./types";
import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";

async function throwProtectedApiError(
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

export async function getPurchaseReceipt(
  purchaseId: number,
  options?: { signal?: AbortSignal },
): Promise<TransactionReceiptResponse> {
  const response = await fetch(PURCHASE_RECEIPT_URL(purchaseId), {
    method: "GET",
    headers: {
      ...getAuthorizationHeaders(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: options?.signal,
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "영수증을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getSalesReceipt(
  saleId: number,
  options?: { signal?: AbortSignal },
): Promise<TransactionReceiptResponse> {
  // Try sales-specific URL first; if backend doesn't expose it, fall back to purchases URL.
  let response = await fetch(SALES_RECEIPT_URL(saleId), {
    method: "GET",
    headers: {
      ...getAuthorizationHeaders(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: options?.signal,
  });

  if (response.status === 404) {
    // fallback to purchases-based receipt endpoint
    response = await fetch(PURCHASE_RECEIPT_URL(saleId), {
      method: "GET",
      headers: {
        ...getAuthorizationHeaders(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: options?.signal,
    });
  }

  if (!response.ok) {
    await throwProtectedApiError(response, "영수증을 불러오지 못했습니다.");
  }

  return response.json();
}

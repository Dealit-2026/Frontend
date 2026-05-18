import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type { PurchasePageResponse, PurchaseDetailResponse } from "./types";

// In-flight 요청 캐시: 동일한 요청 키에 대해 진행중인 Promise를 재사용합니다.
const inFlightRequests = new Map<string, Promise<PurchasePageResponse>>();

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

export async function getMyPurchases(
  page = 0,
  size = 20,
  statuses: string[] = [],
): Promise<PurchasePageResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  statuses.forEach((s) => searchParams.append("status", s));

  const key = `purchases:${page}:${size}:${statuses.join(",")}`;

  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)!;
  }

  const promise = (async () => {
    const response = await fetch(
      `/api/v1/mypage/purchases?${searchParams.toString()}`,
      {
        method: "GET",
        headers: getAuthorizationHeaders(),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      await throwProtectedApiError(response, "구매내역을 불러오지 못했습니다.");
    }

    return (await response.json()) as PurchasePageResponse;
  })();

  inFlightRequests.set(key, promise);

  // 성공/실패 상관없이 캐시에서 제거
  promise.finally(() => {
    inFlightRequests.delete(key);
  });

  return promise;
}

export async function getPurchaseDetail(
  purchaseId: number,
): Promise<PurchaseDetailResponse> {
  const response = await fetch(`/api/v1/purchases/${purchaseId}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "구매 상세정보를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

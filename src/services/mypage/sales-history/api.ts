import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type { SalePageResponse, SaleDetailResponse } from "./types";

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

export async function getMySales(
  page = 0,
  size = 20,
  statuses: string[] = [],
): Promise<SalePageResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  statuses.forEach((s) => searchParams.append("status", s));

  const response = await fetch(
    `/api/v1/mypage/sales?${searchParams.toString()}`,
    {
      method: "GET",
      headers: getAuthorizationHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    await throwProtectedApiError(response, "판매내역을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getSaleDetail(
  purchaseId: number,
): Promise<SaleDetailResponse> {
  const response = await fetch(`/api/v1/purchases/${purchaseId}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "판매 상세정보를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

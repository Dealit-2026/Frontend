import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type { AuctionListResponse } from "@/services/auction/list/types";

async function throwAuctionListApiError(
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

export async function getPopularAuctions(
  limit = 4,
): Promise<AuctionListResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(`/api/v1/auctions/popular?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwAuctionListApiError(
      response,
      "실시간 인기 경매를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getClosingSoonAuctions(
  limit = 3,
): Promise<AuctionListResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(`/api/v1/auctions/closing-soon?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwAuctionListApiError(
      response,
      "마감임박 경매를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

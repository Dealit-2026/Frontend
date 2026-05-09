import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type { MyBuyingAuctionListResponse } from "@/services/buying-auction/types";

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

export async function getMyBuyingAuctions(
  page = 0,
  size = 20,
): Promise<MyBuyingAuctionListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  const response = await fetch(
    `/api/v1/mypage/auctions/buying?${params.toString()}`,
    {
      method: "GET",
      headers: getAuthorizationHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "구매중 경매 목록을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function deleteMyBuyingAuction(auctionId: number): Promise<void> {
  const response = await fetch(`/api/v1/mypage/auctions/buying/${auctionId}`, {
    method: "DELETE",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "종료된 구매중 경매 숨김 처리에 실패했습니다.",
    );
  }
}

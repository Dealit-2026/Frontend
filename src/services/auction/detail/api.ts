import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  AuctionBidHistoryResponse,
  AuctionDetailResponse,
  CreateAuctionBidRequest,
  CreateAuctionBidResponse,
} from "@/services/auction/detail/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

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

export async function getAuctionDetail(
  auctionId: number,
): Promise<AuctionDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auctions/${auctionId}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "경매 상품 정보를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getAuctionBidHistory(
  auctionId: number,
): Promise<AuctionBidHistoryResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auctions/${auctionId}/bids`,
    {
      method: "GET",
      headers: getAuthorizationHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "입찰 현황을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function postAuctionBid(
  auctionId: number,
  payload: CreateAuctionBidRequest,
): Promise<CreateAuctionBidResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auctions/${auctionId}/bids`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeaders(),
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    await throwProtectedApiError(response, "입찰에 실패했습니다.");
  }

  return response.json();
}

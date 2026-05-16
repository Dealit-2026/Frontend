import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  AuctionWishlistListResponse,
  WishlistListResponse,
  WishlistToggleResponse,
} from "@/services/wishlist/types";

const API_BASE = "/api/v1";

async function throwWishlistApiError(
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

export async function getMyWishlist(
  page = 0,
  size = 20,
): Promise<WishlistListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(`${API_BASE}/mypage/wishlist?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwWishlistApiError(
      response,
      "찜 목록을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getMyAuctionWishlist(
  page = 0,
  size = 20,
): Promise<AuctionWishlistListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(`${API_BASE}/mypage/wishlist/auctions?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwWishlistApiError(
      response,
      "경매 찜 목록을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function addWishlist(
  productId: number,
): Promise<WishlistToggleResponse> {
  const response = await fetch(`${API_BASE}/wishlist/${productId}`, {
    method: "POST",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwWishlistApiError(response, "찜 추가에 실패했습니다.");
  }

  return response.json();
}

export async function removeWishlist(
  productId: number,
): Promise<WishlistToggleResponse> {
  const response = await fetch(`${API_BASE}/wishlist/${productId}`, {
    method: "DELETE",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwWishlistApiError(response, "찜 취소에 실패했습니다.");
  }

  return response.json();
}

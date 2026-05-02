import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  AuctionEditDetailResponse,
  AuctionSalesManagementListResponse,
  ProductEditDetailResponse,
  RegularSalesManagementListResponse,
  UpdateAuctionSalesManagementProductRequest,
  UpdateRegularSalesManagementProductRequest,
} from "@/services/sales-management/types";

const API_BASE = "/api/v1";

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

export async function getRegularSalesManagementProducts(): Promise<RegularSalesManagementListResponse> {
  const params = new URLSearchParams({ page: "0", size: "20" });
  const response = await fetch(`${API_BASE}/mypage/products/selling?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "일반 상품 판매 중 목록을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getAuctionSalesManagementProducts(): Promise<AuctionSalesManagementListResponse> {
  const params = new URLSearchParams({ page: "0", size: "20" });
  const response = await fetch(`${API_BASE}/mypage/auctions/selling?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "경매 상품 판매 중 목록을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function deleteRegularSalesManagementProduct(
  productId: number,
): Promise<void> {
  const response = await fetch(`${API_BASE}/products/${productId}`, {
    method: "DELETE",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "일반 상품 삭제에 실패했습니다.");
  }

  return;
}

export async function deleteAuctionSalesManagementProduct(
  auctionId: number,
): Promise<void> {
  const response = await fetch(`${API_BASE}/auctions/${auctionId}`, {
    method: "DELETE",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "경매 상품 삭제에 실패했습니다.");
  }

  return;
}

export async function getRegularSalesManagementEditDetail(
  productId: number,
): Promise<ProductEditDetailResponse> {
  const response = await fetch(`${API_BASE}/products/${productId}/edit`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "일반 상품 수정 정보를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getAuctionSalesManagementEditDetail(
  auctionId: number,
): Promise<AuctionEditDetailResponse> {
  const response = await fetch(`${API_BASE}/auctions/${auctionId}/edit`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "경매 상품 수정 정보를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function updateRegularSalesManagementProduct(
  productId: number,
  payload: UpdateRegularSalesManagementProductRequest,
): Promise<ProductEditDetailResponse> {
  const response = await fetch(`${API_BASE}/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "일반 상품 수정에 실패했습니다.");
  }

  return response.json();
}

export async function updateAuctionSalesManagementProduct(
  auctionId: number,
  payload: UpdateAuctionSalesManagementProductRequest,
): Promise<AuctionEditDetailResponse> {
  const response = await fetch(`${API_BASE}/auctions/${auctionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "경매 상품 수정에 실패했습니다.");
  }

  return response.json();
}

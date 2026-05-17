import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  ProductSearchListResponse,
  SearchCategoryOptionResponse,
} from "@/services/product/search/types";
import type { AuctionListResponse } from "@/services/auction/list/types";

const PRODUCT_SEARCH_API_BASE = "/api/v1/products/search";
const AUCTION_SEARCH_API_BASE = "/api/v1/auctions/search";

async function throwProductSearchApiError(
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

export async function getSearchCategories(): Promise<
  SearchCategoryOptionResponse[]
> {
  const response = await fetch(`${PRODUCT_SEARCH_API_BASE}/categories`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProductSearchApiError(
      response,
      "검색 카테고리를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getAuctionSearchCategories(): Promise<
  SearchCategoryOptionResponse[]
> {
  const response = await fetch(`${AUCTION_SEARCH_API_BASE}/categories`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProductSearchApiError(
      response,
      "경매 검색 카테고리를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function searchProductsByCategory({
  categoryId,
  page = 0,
  size = 20,
}: {
  categoryId: number;
  page?: number;
  size?: number;
}): Promise<ProductSearchListResponse> {
  const params = new URLSearchParams({
    categoryId: String(categoryId),
    page: String(page),
    size: String(size),
  });

  const response = await fetch(`${PRODUCT_SEARCH_API_BASE}?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProductSearchApiError(
      response,
      "카테고리 상품을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function searchAuctionsByCategory({
  categoryId,
  page = 0,
  size = 20,
}: {
  categoryId: number;
  page?: number;
  size?: number;
}): Promise<AuctionListResponse> {
  const params = new URLSearchParams({
    categoryId: String(categoryId),
    page: String(page),
    size: String(size),
  });

  const response = await fetch(`${AUCTION_SEARCH_API_BASE}?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProductSearchApiError(
      response,
      "카테고리 경매를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

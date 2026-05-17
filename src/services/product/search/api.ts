import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  PopularSearchKeywordListResponse,
  ProductSearchListResponse,
  SearchCategoryOptionResponse,
  UnifiedSearchListResponse,
} from "@/services/product/search/types";
import type { AuctionListResponse } from "@/services/auction/list/types";

const PRODUCT_SEARCH_API_BASE = "/api/v1/products/search";
const AUCTION_SEARCH_API_BASE = "/api/v1/auctions/search";
const UNIFIED_SEARCH_API_BASE = "/api/v1/search";

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

export async function searchIntegrated({
  keyword,
  categoryId,
  page = 0,
  size = 20,
}: {
  keyword?: string | null;
  categoryId?: number | null;
  page?: number;
  size?: number;
}): Promise<UnifiedSearchListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const normalizedKeyword = keyword?.trim();

  if (normalizedKeyword) {
    params.set("keyword", normalizedKeyword);
  }
  if (categoryId != null && categoryId > 0) {
    params.set("categoryId", String(categoryId));
  }

  const response = await fetch(`${UNIFIED_SEARCH_API_BASE}?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProductSearchApiError(
      response,
      "통합 검색 결과를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getPopularSearchKeywords(
  size = 10,
): Promise<PopularSearchKeywordListResponse> {
  const params = new URLSearchParams({
    size: String(size),
  });

  const response = await fetch(`${UNIFIED_SEARCH_API_BASE}/popular?${params}`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProductSearchApiError(
      response,
      "인기 검색어를 불러오지 못했습니다.",
    );
  }

  return response.json();
}

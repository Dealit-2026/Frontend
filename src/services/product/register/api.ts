import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  DeleteRegularProductImageResponse,
  RecommendRegularProductCategoryRequest,
  RecommendRegularProductCategoryResponse,
  RecommendRegularProductPriceRequest,
  RecommendRegularProductPriceResponse,
  RegularProductCategory,
  RegularProductCreateRequest,
  RegularProductCreateResponse,
  SaveRegularProductDraftRequest,
  SaveRegularProductDraftResponse,
  UploadRegularProductImageResponse,
} from "@/services/product/register/types";

// api.ts는 HTTP 호출만 담당한다.
// 숫자 변환, 폼 가공, 기본값 생성은 service.ts에서 처리한다.

const PRODUCT_API_BASE = "/api/v1/products";

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

export async function getRegularProductCategories(): Promise<
  RegularProductCategory[]
> {
  const response = await fetch(`${PRODUCT_API_BASE}/categories`, {
    method: "GET",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "카테고리 목록을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function uploadRegularProductImage(
  file: File,
): Promise<UploadRegularProductImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${PRODUCT_API_BASE}/image`, {
    method: "POST",
    headers: getAuthorizationHeaders(),
    body: formData,
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "상품 이미지 업로드에 실패했습니다.");
  }

  return response.json();
}

export async function deleteRegularProductImage(
  imageId: number,
): Promise<DeleteRegularProductImageResponse> {
  const response = await fetch(`${PRODUCT_API_BASE}/image/${imageId}`, {
    method: "DELETE",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "상품 이미지 삭제에 실패했습니다.");
  }

  return response.json();
}

export async function saveRegularProductDraft(
  payload: SaveRegularProductDraftRequest,
): Promise<SaveRegularProductDraftResponse> {
  const response = await fetch(`${PRODUCT_API_BASE}/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "임시저장에 실패했습니다.");
  }

  return response.json();
}

export async function recommendRegularProductCategory(
  payload: RecommendRegularProductCategoryRequest,
): Promise<RecommendRegularProductCategoryResponse> {
  const response = await fetch(`${PRODUCT_API_BASE}/category/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "카테고리 추천에 실패했습니다.",
    );
  }

  return response.json();
}

export async function recommendRegularProductPrice(
  payload: RecommendRegularProductPriceRequest,
): Promise<RecommendRegularProductPriceResponse> {
  const response = await fetch(`${PRODUCT_API_BASE}/price/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "가격 추천에 실패했습니다.",
    );
  }

  return response.json();
}

export async function postRegularProduct(
  payload: RegularProductCreateRequest,
): Promise<RegularProductCreateResponse> {
  const response = await fetch(PRODUCT_API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "상품 등록에 실패했습니다.");
  }

  return response.json();
}

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";
const PRODUCT_API_BASE = `${API_BASE_URL}/api/v1/products`;

export async function getRegularProductCategories(): Promise<
  RegularProductCategory[]
> {
  const response = await fetch(`${PRODUCT_API_BASE}/categories`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch regular product categories: ${response.status}`,
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
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload regular product image: ${response.status}`,
    );
  }

  return response.json();
}

export async function deleteRegularProductImage(
  imageId: number,
): Promise<DeleteRegularProductImageResponse> {
  const response = await fetch(`${PRODUCT_API_BASE}/image/${imageId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete regular product image: ${response.status}`,
    );
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
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to save regular product draft: ${response.status}`);
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
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to recommend regular product category: ${response.status}`,
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
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to recommend regular product price: ${response.status}`,
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
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create regular product: ${response.status}`);
  }

  return response.json();
}

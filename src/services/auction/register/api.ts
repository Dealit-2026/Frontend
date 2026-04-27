import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import {
  AuctionCategory,
  CreateAuctionRequest,
  CreateAuctionResponse,
  DeleteAuctionImageResponse,
  RecommendCategoryRequest,
  RecommendCategoryResponse,
  RecommendPriceRequest,
  RecommendPriceResponse,
  SaveAuctionDraftRequest,
  SaveAuctionDraftResponse,
  UploadAuctionImageResponse,
} from "@/services/auction/register/types";

// api.ts는 HTTP 호출만 담당한다.
// 숫자 변환, 폼 가공, 기본값 생성은 service.ts에서 처리한다.

const AUCTION_API_BASE = "/api/v1/auction";

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

export async function getAuctionCategories(): Promise<AuctionCategory[]> {
  const response = await fetch(`${AUCTION_API_BASE}/categories`, {
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

// 1. 상품 이미지 업로드.
// 카메라 클릭 후 선택한 File을 multipart/form-data로 서버에 전송한다.
// 응답으로 받은 imageId, imageUrl을 폼 상태에 넣어 이후 등록/임시저장에 사용한다.
export async function uploadAuctionImage(
  file: File,
): Promise<UploadAuctionImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${AUCTION_API_BASE}/image`, {
    method: "POST",
    headers: getAuthorizationHeaders(),
    body: formData,
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "상품 이미지 업로드에 실패했습니다.");
  }

  return response.json();
}

export async function deleteAuctionImage(
  imageId: number,
): Promise<DeleteAuctionImageResponse> {
  const response = await fetch(`${AUCTION_API_BASE}/image/${imageId}`, {
    method: "DELETE",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "상품 이미지 삭제에 실패했습니다.");
  }

  return response.json();
}

// 2. 임시저장.
// 등록 직전의 완성 요청과 비슷한 shape를 저장하지만, 상태는 draft로 관리된다.
export async function saveAuctionDraft(
  payload: SaveAuctionDraftRequest,
): Promise<SaveAuctionDraftResponse> {
  const response = await fetch(`${AUCTION_API_BASE}/draft`, {
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

// 3. 카테고리 AI 추천.
// 현재 입력한 상품명/설명을 기반으로 추천 카테고리를 요청한다.
export async function recommendAuctionCategory(
  payload: RecommendCategoryRequest,
): Promise<RecommendCategoryResponse> {
  const response = await fetch(`${AUCTION_API_BASE}/category/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "카테고리 추천에 실패했습니다.");
  }

  return response.json();
}

// 4. 가격 AI 추천.
// 판매 방식과 상품 정보를 바탕으로 추천 시작가/가격을 요청한다.
export async function recommendAuctionPrice(
  payload: RecommendPriceRequest,
): Promise<RecommendPriceResponse> {
  const response = await fetch(`${AUCTION_API_BASE}/price/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "가격 추천에 실패했습니다.");
  }

  return response.json();
}

// 5. 등록 완료.
// service.ts에서 가공이 끝난 최종 request DTO만 받아 실제 등록을 요청한다.
export async function postAuction(
  payload: CreateAuctionRequest,
): Promise<CreateAuctionResponse> {
  const response = await fetch(AUCTION_API_BASE, {
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

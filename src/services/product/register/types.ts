// UI에서 사용하는 일반 판매 등록 폼 모델.
// 경매 등록과 공통 필드가 많지만, 판매 유형은 REGULAR로 고정한다.
export interface RegularProductCreateFormValues {
  name: string;
  description: string;
  categoryId: number | null;
  categoryName?: string;
  price: string;
  allowOffer: boolean;
  location: string;
  draftId: number | null;
  images: RegularProductImagePayload[];
}

export type RegularProductSaleType = "REGULAR";

export interface RegularProductImagePayload {
  imageId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface UploadRegularProductImageResponse {
  imageId: number;
  imageUrl: string;
}

export interface DeleteRegularProductImageResponse {
  imageId: number;
  deleted: boolean;
}

export interface RegularProductCategory {
  id: number;
  nameKo: string;
  nameEn: string;
  depth: number;
  parentId: number | null;
  children: RegularProductCategory[];
}

// 서버로 보내는 일반 판매 등록 요청 DTO.
export interface RegularProductCreateRequest {
  name: string;
  description: string;
  saleType: RegularProductSaleType;
  categoryId: number;
  price: number;
  startPrice: null;
  auctionEndAt: null;
  allowOffer: boolean;
  images: RegularProductImagePayload[];
  location: string;
  draftId: number | null;
}

export interface RegularProductCreateResponse {
  productId: number;
  saleType: RegularProductSaleType;
  status: "DRAFT" | "ON_SALE" | "SOLD" | "ENDED";
  generalSale: {
    price: number;
  } | null;
}

export interface SaveRegularProductDraftRequest
  extends Omit<RegularProductCreateRequest, "price"> {
  price: number | null;
}

export interface SaveRegularProductDraftResponse {
  draftId: number;
  savedAt: string;
}

export interface RecommendRegularProductCategoryRequest {
  name: string;
  description: string;
}

export interface RecommendRegularProductCategoryResponse {
  categoryId: number;
  categoryName: string;
}

export interface RecommendRegularProductPriceRequest {
  name: string;
  description: string;
  saleType: RegularProductSaleType;
}

export interface RecommendRegularProductPriceResponse {
  recommendedPrice: number;
}

export type RegularProductRegisterDraft = RegularProductCreateFormValues;

// UI에서 사용하는 판매 유형.
// 화면 분기와 폼 제어는 이 값으로 처리한다.
export type SaleType = "regular" | "auction";

// 백엔드 enum과 맞추기 위한 API 전용 판매 유형.
// UI 타입과 분리해 두면 request 변환 시점이 명확해진다.
export type ProductSaleType = "REGULAR" | "AUCTION";

// 업로드가 끝난 이미지 메타데이터.
// Form 단계의 File 객체와 달리, API 요청에서는 식별 가능한 payload를 사용한다.
export interface ProductImagePayload {
  imageId: number;
  imageUrl: string;
  sortOrder: number;
}

// 이미지 업로드 성공 후 서버가 돌려주는 응답.
// 이후 폼 상태에는 File 대신 이 메타데이터를 보관하는 쪽이 안정적이다.
export interface UploadAuctionImageResponse {
  imageId: number;
  imageUrl: string;
}

export interface DeleteAuctionImageResponse {
  imageId: number;
  deleted: boolean;
}

// 경매 관련 폼 상태.
// 입력 중인 값이므로 숫자도 string으로 관리한다.
export interface AuctionFormValues {
  startPrice: string;
  bidUnit: string;
  durationDays: number;
  startsAt: string;
  endsAt: string;
}

// 등록 화면 전체에서 관리하는 프론트 폼 모델.
// page.tsx는 이 타입만 신경 쓰고, API 요청 형태는 service에서 변환한다.
export interface AuctionCreateFormValues {
  name: string;
  description: string;
  saleType: SaleType;
  categoryId: number | null;
  categoryName?: string;
  price: string;
  startPrice: string;
  auctionEndAt: string;
  allowOffer: boolean;
  location: string;
  draftId: number | null;
  images: ProductImagePayload[];
  auction: AuctionFormValues;
}

// 서버로 보내는 등록 요청 DTO.
// 백엔드 명세에 맞는 최종 payload 형태만 둔다.
export interface AuctionCreateRequest {
  name: string;
  description: string;
  saleType: ProductSaleType;
  categoryId: number;
  price: number | null;
  startPrice: number | null;
  auctionEndAt: string | null;
  allowOffer: boolean;
  images: ProductImagePayload[];
  location: string;
  draftId: number | null;
}

// 등록 성공 직후 필요한 최소 응답.
// 상세 페이지 렌더링 데이터는 별도 상세 조회 응답으로 분리한다.
export interface AuctionCreateResponse {
  productId: number;
  saleType: ProductSaleType;
  status: "DRAFT" | "ON_SALE" | "AUCTION_SCHEDULED" | "AUCTION_LIVE" | "ENDED";
  auction: {
    status: "AUCTION_SCHEDULED" | "AUCTION_LIVE" | "ENDED";
    startAt: string;
    endAt: string;
  } | null;
}

// 임시저장도 등록과 거의 같은 request shape를 사용한다.
export interface SaveProductDraftRequest extends AuctionCreateRequest {}

export interface SaveProductDraftResponse {
  draftId: number;
  savedAt: string;
}

// 카테고리 추천 요청/응답.
// 등록 화면 보조 기능이지만 같은 도메인에서 관리한다.
export interface RecommendCategoryRequest {
  name: string;
  description: string;
}

export interface RecommendCategoryResponse {
  categoryId: number;
  categoryName: string;
}

// 가격 추천 요청/응답.
export interface RecommendPriceRequest {
  name: string;
  description: string;
  saleType: ProductSaleType;
}

export interface RecommendPriceResponse {
  recommendedPrice: number;
  startPrice?: number;
}

// 화면 문구처럼 UI 렌더링을 돕는 ViewModel.
// API DTO와 섞지 않기 위해 별도 타입으로 둔다.
export interface AuctionFieldContent {
  sectionTitle: string;
  priceLabel: string;
  helperText: string;
}

// 상세 페이지는 등록 응답과 별도로 관리하는 것이 안전하다.
// 등록 API는 식별자만, 실제 렌더링 데이터는 상세 조회에서 받는다.
export interface ProductDetailResponse {
  productId: number;
  name: string;
  description: string;
  saleType: ProductSaleType;
  category: {
    categoryId: number;
    categoryName: string;
  };
  imageUrls: string[];
  status: "ACTIVE" | "ENDED" | "SOLD";
  seller: {
    sellerId: number;
    nickname: string;
  };
  auction: {
    auctionId: number;
    startPrice: number;
    currentPrice: number;
    minimumNextBidPrice: number;
    bidCount: number;
    endAt: string;
    status: "SCHEDULED" | "BIDDING" | "ENDED";
  } | null;
  generalSale: {
    price: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// 기존 코드와의 호환을 위한 별칭.
// 화면 코드를 한 번에 다 바꾸기 전까지 bridge 역할을 한다.
export type AuctionRegisterDraft = AuctionCreateFormValues;
export type CreateAuctionRequest = AuctionCreateRequest;
export type CreateAuctionResponse = AuctionCreateResponse;
export type SaveAuctionDraftRequest = SaveProductDraftRequest;
export type SaveAuctionDraftResponse = SaveProductDraftResponse;

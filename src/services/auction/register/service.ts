import * as auctionApi from "@/services/auction/register/api";
import type {
  AuctionCategory,
  AuctionFieldContent,
  AuctionFormValues,
  AuctionRegisterDraft,
  CreateAuctionRequest,
  ProductImagePayload,
  ProductSaleType,
  RecommendCategoryRequest,
  RecommendPriceRequest,
  SaleType,
  SaveAuctionDraftRequest,
  UploadAuctionImageResponse,
} from "@/services/auction/register/types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toLocalDatetimeValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

// 화면 초기 렌더링용 기본 폼 상태를 만든다.
// page.tsx는 이 값을 그대로 useState 초기값으로 사용하면 된다.
export function createDefaultAuctionForm(now = new Date()): AuctionFormValues {
  const startsAt = toLocalDatetimeValue(now);
  const endsAt = toLocalDatetimeValue(new Date(now.getTime() + 3 * DAY_IN_MS));
  const startPrice = "";

  return {
    startPrice,
    bidUnit: calculateBidUnit(startPrice),
    durationDays: 3,
    startsAt,
    endsAt,
  };
}

// UI에서 판매 방식에 따라 보여줄 문구를 분리한다.
// page.tsx에서 문자열 분기 로직을 줄이기 위한 ViewModel 성격의 함수다.
export function getAuctionFieldContent(saleType: SaleType): AuctionFieldContent {
  if (saleType === "auction") {
    return {
      sectionTitle: "경매 설정",
      priceLabel: "시작가",
      helperText: "입찰 시작 금액과 종료 일정을 설정해 주세요.",
    };
  }

  return {
    sectionTitle: "가격 설정",
    priceLabel: "판매가",
    helperText: "구매자가 바로 결제할 판매 가격을 입력해 주세요.",
  };
}

// 숫자 문자열 표시용 포맷터.
// 입력 상태는 string으로 유지하고, 보여줄 때만 format 한다.
export function formatDisplayPrice(value: string) {
  if (!value) {
    return "";
  }

  return Number(value).toLocaleString();
}

// 입력 중 섞인 문자 제거.
// page.tsx에 직접 정규식을 두지 않기 위해 service로 뺀다.
export function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9]/g, "");
}

// 시작가 기준으로 입찰 단위를 계산한다.
// 현재는 1% 규칙을 사용하며, 정책이 바뀌면 여기만 수정하면 된다.
export function calculateBidUnit(startPrice: string) {
  const amount = Number(startPrice);

  if (!amount || Number.isNaN(amount)) {
    return "0";
  }

  return Math.max(1, Math.floor(amount * 0.01)).toString();
}

// 시작 일시와 진행 기간을 기준으로 종료 일시를 다시 계산한다.
export function updateAuctionDuration(
  auction: AuctionFormValues,
  durationDays: number,
): AuctionFormValues {
  const startsAtDate = new Date(auction.startsAt);
  const safeDuration = Number.isFinite(durationDays) ? durationDays : 1;
  const endsAt = toLocalDatetimeValue(
    new Date(startsAtDate.getTime() + safeDuration * DAY_IN_MS),
  );

  return {
    ...auction,
    durationDays: safeDuration,
    endsAt,
  };
}

// 경매 일정 표시용 문자열 생성.
// 상세한 Date formatting 로직을 화면에서 분리한다.
export function formatAuctionSchedule(auction: AuctionFormValues) {
  const start = new Date(auction.startsAt);
  const end = new Date(auction.endsAt);

  const startLabel = new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(start);

  const endLabel = new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(end);

  return `${startLabel} 시작 · ${endLabel} 종료`;
}

// 부분 입력값이나 임시저장 데이터를 안전한 폼 모델로 정규화한다.
// localStorage나 서버 draft를 다시 폼에 주입할 때 사용한다.
export function createDraft(
  draft: Partial<AuctionRegisterDraft>,
): AuctionRegisterDraft {
  const saleType = draft.saleType ?? "regular";
  const price = draft.price ?? "";
  const startPrice = draft.startPrice ?? draft.auction?.startPrice ?? "";
  const normalizedImages = (draft.images ?? []) as ProductImagePayload[];

  return {
    name: draft.name ?? "",
    description: draft.description ?? "",
    saleType,
    categoryId: draft.categoryId ?? null,
    categoryName: draft.categoryName ?? "",
    price,
    startPrice,
    auctionEndAt: draft.auctionEndAt ?? draft.auction?.endsAt ?? "",
    allowOffer: draft.allowOffer ?? false,
    location: draft.location ?? "",
    draftId: draft.draftId ?? null,
    images: normalizedImages,
    auction: {
      ...createDefaultAuctionForm(),
      ...draft.auction,
      startPrice,
      bidUnit: calculateBidUnit(startPrice),
      endsAt: draft.auction?.endsAt ?? draft.auctionEndAt ?? createDefaultAuctionForm().endsAt,
    },
  };
}

// 프론트 전용 판매 타입을 API enum으로 변환한다.
export function toProductSaleType(saleType: SaleType): ProductSaleType {
  return saleType === "auction" ? "AUCTION" : "REGULAR";
}

// 이미지 배열을 서버 payload 형식으로 정렬/정규화한다.
export function normalizeImagePayload(images: ProductImagePayload[]) {
  return images.map((image, index) => ({
    imageId: image.imageId,
    imageUrl: image.imageUrl,
    sortOrder: image.sortOrder || index + 1,
  }));
}

// 업로드 응답을 등록 폼에서 쓰는 이미지 payload로 변환한다.
// page.tsx는 imageId, imageUrl, sortOrder를 직접 조립하지 않고 이 함수를 사용하면 된다.
export function toProductImagePayload(
  uploadedImage: UploadAuctionImageResponse,
  sortOrder: number,
): ProductImagePayload {
  return {
    imageId: uploadedImage.imageId,
    imageUrl: uploadedImage.imageUrl,
    sortOrder,
  };
}

// 화면 Form 모델을 서버 request DTO로 변환한다.
// Number 변환, nullable 처리, ISO 문자열 보정은 여기서 수행한다.
export function buildCreateAuctionRequest(
  draft: AuctionRegisterDraft,
): CreateAuctionRequest {
  return {
    name: draft.name,
    description: draft.description,
    saleType: toProductSaleType(draft.saleType),
    categoryId: draft.categoryId ?? 0,
    price: draft.saleType === "regular" ? Number(draft.price || 0) : null,
    startPrice:
      draft.saleType === "auction"
        ? Number(draft.startPrice || draft.auction.startPrice || 0)
        : null,
    auctionEndAt:
      draft.saleType === "auction"
        ? new Date(draft.auctionEndAt || draft.auction.endsAt).toISOString()
        : null,
    allowOffer: draft.allowOffer,
    images: normalizeImagePayload(draft.images),
    location: draft.location,
    draftId: draft.draftId,
  };
}

// 임시저장은 등록 요청과 거의 같은 payload를 사용한다.
// service에서 request를 재사용하면 page.tsx가 두 DTO 차이를 신경 쓰지 않아도 된다.
export function buildSaveAuctionDraftRequest(
  draft: AuctionRegisterDraft,
): SaveAuctionDraftRequest {
  return {
    ...buildCreateAuctionRequest(draft),
    price: draft.price ? Number(draft.price) : null,
  };
}

// 카테고리 AI 추천 요청은 현재 입력된 상품명/설명만 사용한다.
export function buildRecommendCategoryRequest(
  draft: Pick<AuctionRegisterDraft, "name" | "description">,
): RecommendCategoryRequest {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
  };
}

// 가격 AI 추천 요청은 상품 정보와 판매 방식을 함께 보낸다.
export function buildRecommendPriceRequest(
  draft: Pick<AuctionRegisterDraft, "name" | "description" | "saleType">,
): RecommendPriceRequest {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    saleType: toProductSaleType(draft.saleType),
  };
}

// 이미지 업로드를 service 레이어에서 감싼다.
// 업로드 응답을 화면에서 바로 쓸 수 있는 ProductImagePayload로 바꿔 돌려준다.
export async function uploadAuctionImage(file: File, sortOrder: number) {
  const uploadedImage = await auctionApi.uploadAuctionImage(file);
  return toProductImagePayload(uploadedImage, sortOrder);
}

export async function getAuctionCategories(): Promise<AuctionCategory[]> {
  return auctionApi.getAuctionCategories();
}

export async function deleteAuctionImage(imageId: number) {
  return auctionApi.deleteAuctionImage(imageId);
}

// 임시저장도 page.tsx에서 직접 DTO를 만들지 않도록 service에서 조립 후 위임한다.
export async function saveAuctionDraft(draft: AuctionRegisterDraft) {
  return auctionApi.saveAuctionDraft(buildSaveAuctionDraftRequest(draft));
}

// 카테고리 추천 요청 위임.
export async function recommendAuctionCategory(
  draft: Pick<AuctionRegisterDraft, "name" | "description">,
) {
  return auctionApi.recommendAuctionCategory(
    buildRecommendCategoryRequest(draft),
  );
}

// 가격 추천 요청 위임.
export async function recommendAuctionPrice(
  draft: Pick<AuctionRegisterDraft, "name" | "description" | "saleType">,
) {
  return auctionApi.recommendAuctionPrice(buildRecommendPriceRequest(draft));
}

// 페이지에서 바로 API를 호출하지 않도록 service에서 조립 후 위임한다.
export async function registerAuction(draft: AuctionRegisterDraft) {
  return auctionApi.postAuction(buildCreateAuctionRequest(draft));
}

// 공용 등록 화면에서 사용하는 상품 등록용 함수명.
// 실제 payload는 saleType 값으로 분기되므로 일반 판매/경매를 모두 처리한다.
export async function uploadProductImage(file: File, sortOrder: number) {
  return uploadAuctionImage(file, sortOrder);
}

export async function getProductCategories(): Promise<AuctionCategory[]> {
  return getAuctionCategories();
}

export async function deleteProductImage(imageId: number) {
  return deleteAuctionImage(imageId);
}

export async function saveProductDraft(draft: AuctionRegisterDraft) {
  return saveAuctionDraft(draft);
}

export async function recommendProductCategory(
  draft: Pick<AuctionRegisterDraft, "name" | "description">,
) {
  return recommendAuctionCategory(draft);
}

export async function recommendProductPrice(
  draft: Pick<AuctionRegisterDraft, "name" | "description" | "saleType">,
) {
  return recommendAuctionPrice(draft);
}

export async function registerProduct(draft: AuctionRegisterDraft) {
  return registerAuction(draft);
}

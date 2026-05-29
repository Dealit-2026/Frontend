import * as salesManagementApi from "@/services/sales-management/api";
import * as mypageApi from "@/services/mypage/api";
import { getApiTime } from "@/services/dateTime";
import type {
  AuctionSalesManagementItemResponse,
  RegularSalesManagementItemResponse,
  SalesManagementItemViewModel,
  SalesManagementListSummary,
  UpdateAuctionSalesManagementProductRequest,
  UpdateRegularSalesManagementProductRequest,
} from "@/services/sales-management/types";
import type { AuctionRegisterDraft } from "@/services/auction/register/types";

const DEFAULT_CATEGORY_LABEL = "카테고리 없음";

function formatPrice(price: number) {
  return `${Number(price || 0).toLocaleString()}원`;
}

function getRegularStatusLabel(status: string) {
  if (status === "ON_SALE") {
    return "판매 중";
  }

  if (status === "SOLD") {
    return "판매 완료";
  }

  if (status === "ENDED") {
    return "판매 종료";
  }

  return "임시 저장";
}

function getAuctionStatusLabel(status: string) {
  if (status === "ONGOING" || status === "ON_SALE" || status === "AUCTION_LIVE") {
    return "경매 진행 중";
  }

  if (status === "AUCTION_SCHEDULED" || status === "DRAFT") {
    return "경매 예정";
  }

  if (status === "SUCCESSFUL_BID") {
    return "낙찰 완료";
  }

  if (status === "NO_BID") {
    return "재경매 대기";
  }

  return "경매 종료";
}

function toRegularViewModel(
  item: RegularSalesManagementItemResponse,
): SalesManagementItemViewModel {
  return {
    id: `regular-${item.productId}`,
    productId: item.productId,
    type: "regular",
    name: item.name,
    description: item.description,
    status: item.productStatus,
    statusLabel: getRegularStatusLabel(item.productStatus),
    price: Number(item.price || 0),
    priceLabel: formatPrice(item.price),
    imageUrl: item.thumbnailUrl,
    category: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    location: item.location,
    bidders: null,
    bidderCount: null,
    editable: item.canEdit,
    deletable: item.canDelete,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toAuctionViewModel(
  item: AuctionSalesManagementItemResponse,
  sellerLocation = "",
): SalesManagementItemViewModel {
  const displayPrice = Number(item.currentPrice ?? item.startPrice ?? 0);
  const auctionStatus =
    item.auctionStatus ??
    item.status ??
    (item.endAt && getApiTime(item.endAt) > Date.now()
      ? "ONGOING"
      : "ENDED");

  return {
    id: `auction-${item.auctionId}`,
    productId: item.productId,
    auctionId: item.auctionId,
    type: "auction",
    name: item.name,
    description: item.description,
    status: auctionStatus,
    statusLabel: getAuctionStatusLabel(auctionStatus),
    price: displayPrice,
    priceLabel: formatPrice(displayPrice),
    imageUrl: item.thumbnailUrl,
    category: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    location: item.location ?? sellerLocation,
    bidders: item.bidCount,
    bidderCount: item.bidderCount,
    editable: item.canEdit,
    deletable: item.canDelete,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function getAuctionProductIdSet(
  auctionProducts: AuctionSalesManagementItemResponse[],
) {
  return new Set(auctionProducts.map((product) => product.productId));
}

function excludeAuctionProductsFromRegularList(
  regularProducts: RegularSalesManagementItemResponse[],
  auctionProducts: AuctionSalesManagementItemResponse[],
) {
  const auctionProductIds = getAuctionProductIdSet(auctionProducts);

  return regularProducts.filter(
    (product) => !auctionProductIds.has(product.productId),
  );
}

export async function fetchSalesManagementProducts(): Promise<
  SalesManagementItemViewModel[]
> {
  const [regularProducts, auctionProducts, profile] = await Promise.all([
    salesManagementApi.getRegularSalesManagementProducts(),
    salesManagementApi.getAuctionSalesManagementProducts(),
    mypageApi.getMyProfile().catch(() => null),
  ]);
  const sellerLocation = profile?.location ?? "";
  const visibleRegularProducts = excludeAuctionProductsFromRegularList(
    regularProducts.content,
    auctionProducts.content,
  );

  return [
    ...visibleRegularProducts.map(toRegularViewModel),
    ...auctionProducts.content.map((product) =>
      toAuctionViewModel(product, sellerLocation),
    ),
  ].sort(
    (a, b) =>
      getApiTime(b.createdAt) - getApiTime(a.createdAt),
  );
}

export async function fetchSalesManagementSummary(): Promise<SalesManagementListSummary> {
  const [regularProducts, auctionProducts] = await Promise.all([
    salesManagementApi.getRegularSalesManagementProducts(),
    salesManagementApi.getAuctionSalesManagementProducts(),
  ]);
  const auctionProductIds = getAuctionProductIdSet(auctionProducts.content);
  const hasDuplicatedAuctionProduct = regularProducts.content.some((product) =>
    auctionProductIds.has(product.productId),
  );
  const regularCount = hasDuplicatedAuctionProduct
    ? Math.max(0, regularProducts.totalElements - auctionProducts.totalElements)
    : regularProducts.totalElements;

  return {
    regularCount,
    auctionCount: auctionProducts.totalElements,
  };
}

export async function fetchSalesManagementCount() {
  const summary = await fetchSalesManagementSummary();
  return summary.regularCount + summary.auctionCount;
}

export async function deleteSalesManagementProduct(
  product: SalesManagementItemViewModel,
) {
  if (product.type === "auction") {
    return salesManagementApi.deleteAuctionSalesManagementProduct(
      product.auctionId ?? product.productId,
    );
  }

  return salesManagementApi.deleteRegularSalesManagementProduct(
    product.productId,
  );
}

function normalizeImages(images: AuctionRegisterDraft["images"]) {
  return images.map((image, index) => ({
    imageId: image.imageId,
    imageUrl: image.imageUrl,
    sortOrder: image.sortOrder || index + 1,
  }));
}

export async function fetchRegularSalesManagementEditInitialData(
  productId: number,
) {
  const detail = await salesManagementApi.getRegularSalesManagementEditDetail(
    productId,
  );

  return {
    type: "regular",
    productId: detail.productId,
    name: detail.name,
    description: detail.description,
    categoryId: detail.categoryId,
    categoryName: detail.categoryName ?? "",
    price: String(detail.price ?? ""),
    location: detail.location,
    images: detail.images,
    allowOffer: detail.allowOffer,
  };
}

export async function fetchAuctionSalesManagementEditInitialData(
  auctionId: number,
) {
  const detail = await salesManagementApi.getAuctionSalesManagementEditDetail(
    auctionId,
  );

  return {
    type: "auction",
    productId: detail.productId,
    auctionId: detail.auctionId,
    name: detail.name,
    description: detail.description,
    categoryId: detail.categoryId,
    categoryName: detail.categoryName ?? "",
    price: String(detail.startPrice ?? ""),
    startPrice: String(detail.startPrice ?? ""),
    location: detail.location,
    images: detail.images,
    auction: {
      startPrice: String(detail.startPrice ?? ""),
      bidUnit: "0",
      durationDays: detail.auctionDurationDays || 1,
    },
  };
}

export async function updateRegularSalesManagementProduct(
  productId: number,
  draft: AuctionRegisterDraft,
) {
  const payload: UpdateRegularSalesManagementProductRequest = {
    name: draft.name.trim(),
    description: draft.description.trim(),
    categoryId: draft.categoryId ?? 0,
    price: Number(draft.price || 0),
    allowOffer: draft.allowOffer,
    location: draft.location.trim(),
    images: normalizeImages(draft.images),
  };

  return salesManagementApi.updateRegularSalesManagementProduct(
    productId,
    payload,
  );
}

export async function updateAuctionSalesManagementProduct(
  auctionId: number,
  draft: AuctionRegisterDraft,
) {
  const payload: UpdateAuctionSalesManagementProductRequest = {
    name: draft.name.trim(),
    description: draft.description.trim(),
    categoryId: draft.categoryId ?? 0,
    startPrice: Number(draft.startPrice || draft.auction.startPrice || 0),
    auctionDurationDays: draft.auction.durationDays,
    location: draft.location.trim(),
    images: normalizeImages(draft.images),
  };

  return salesManagementApi.updateAuctionSalesManagementProduct(
    auctionId,
    payload,
  );
}

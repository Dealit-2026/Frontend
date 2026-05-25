import * as api from "./api";
import type {
  PurchaseItemResponse,
  PurchasePageResponse,
  PurchaseItemViewModel,
  PurchaseDetailResponse,
  PurchaseDetailViewModel,
} from "./types";

function formatAmount(amount: number) {
  return `${Number(amount || 0).toLocaleString()}원`;
}

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

function formatPurchasedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());

  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

function mapItem(item: PurchaseItemResponse): PurchaseItemViewModel {
  return {
    id: item.purchaseId,
    productId: item.productId,
    title: item.productTitle ?? `상품 #${item.productId}`,
    imageUrl: item.productImageUrl ?? null,
    counterpartMemberId: item.counterpartMemberId,
    amountFormatted: formatAmount(item.amount),
    status: item.status,
    purchasedAtDisplay: formatPurchasedAt(item.purchasedAt),
    chatRoomId: item.chatRoomId ?? null,
    productType: item.productType ?? null,
    auctionId: item.auctionId ?? null,
    sellerShipped: item.sellerShipped,
    buyerConfirmed: item.buyerConfirmed,
    completed: item.completed,
    shippedAt: item.shippedAt ?? null,
    completedAt: item.completedAt ?? null,
    reviewWritten: item.reviewWritten,
    reviewAvailable: item.reviewAvailable,
  };
}

export async function fetchMyPurchases(
  page = 0,
  size = 20,
  statuses: string[] = [],
) {
  const resp: PurchasePageResponse = await api.getMyPurchases(
    page,
    size,
    statuses,
  );

  return {
    ...resp,
    content: resp.content.map(mapItem),
  };
}

function mapDetailItem(item: PurchaseDetailResponse): PurchaseDetailViewModel {
  return {
    id: item.purchaseId,
    title: item.productTitle ?? `상품 #${item.productId}`,
    imageUrl: item.productImageUrl ?? null,
    amountFormatted: formatAmount(item.amount),
    status: item.status,
    purchasedAtDisplay: formatPurchasedAt(item.purchasedAt),
    chatRoomId: item.chatRoomId ?? null,
    productType: item.productType ?? null,
    auctionId: item.auctionId ?? null,
    sellerShipped: item.sellerShipped,
    buyerConfirmed: item.buyerConfirmed,
    completed: item.completed,
    shippedAt: item.shippedAt ?? null,
    completedAt: item.completedAt ?? null,
    reviewWritten: item.reviewWritten,
    reviewAvailable: item.reviewAvailable,
  };
}

export async function fetchPurchaseDetail(
  purchaseId: number,
): Promise<PurchaseDetailViewModel> {
  const detail: PurchaseDetailResponse =
    await api.getPurchaseDetail(purchaseId);

  return mapDetailItem(detail);
}

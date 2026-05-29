import * as api from "./api";
import { getApiDateTimeParts } from "@/services/dateTime";
import type {
  SaleItemResponse,
  SalePageResponse,
  SaleItemViewModel,
  SaleDetailResponse,
  SaleDetailViewModel,
} from "./types";

function formatAmount(amount: number) {
  return `${Number(amount || 0).toLocaleString()}원`;
}

function formatPurchasedAt(iso: string) {
  const parts = getApiDateTimeParts(iso);
  if (!parts) return "";

  return `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute}`;
}

function mapItem(item: SaleItemResponse): SaleItemViewModel {
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
    reviewReceived: item.reviewReceived,
  };
}

export async function fetchMySales(
  page = 0,
  size = 20,
  statuses: string[] = [],
) {
  const resp: SalePageResponse = await api.getMySales(page, size, statuses);

  return {
    ...resp,
    content: resp.content.map(mapItem),
  };
}

function mapDetailItem(item: SaleDetailResponse): SaleDetailViewModel {
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
    reviewReceived: item.reviewReceived,
  };
}

export async function fetchSaleDetail(
  purchaseId: number,
): Promise<SaleDetailViewModel> {
  const detail: SaleDetailResponse = await api.getSaleDetail(purchaseId);

  return mapDetailItem(detail);
}

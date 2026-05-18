import * as api from "./api";
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
  };
}

export async function fetchSaleDetail(
  purchaseId: number,
): Promise<SaleDetailViewModel> {
  const detail: SaleDetailResponse = await api.getSaleDetail(purchaseId);

  return mapDetailItem(detail);
}

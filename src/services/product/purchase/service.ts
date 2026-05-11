import * as purchaseApi from "@/services/product/purchase/api";
import type {
  ProductPurchaseAvailabilityResponse,
  PurchaseBlockedReason,
  PurchaseReceiptResponse,
  PurchaseStatusActionResponse,
  PurchaseResponse,
} from "@/services/product/purchase/types";

const PURCHASE_BLOCKED_REASON_MESSAGE: Record<PurchaseBlockedReason, string> = {
  EMAIL_NOT_VERIFIED: "이메일 인증 후 구매할 수 있어요.",
  OWN_PRODUCT: "내가 등록한 상품은 구매할 수 없어요.",
  PRODUCT_NOT_PURCHASABLE: "현재 구매할 수 없는 상품이에요.",
};

export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export async function fetchPurchaseProductDetail(
  productId: number,
): Promise<ProductPurchaseAvailabilityResponse> {
  return purchaseApi.getPurchaseProductDetail(productId);
}

export async function purchaseProduct(
  productId: number,
): Promise<PurchaseResponse> {
  return purchaseApi.postProductPurchase(productId, {
    idempotencyKey: createIdempotencyKey(),
  });
}

export async function fetchPurchaseReceipt(
  purchaseId: number,
): Promise<PurchaseReceiptResponse> {
  return purchaseApi.getPurchaseReceipt(purchaseId);
}

export async function markPurchaseShipped(
  purchaseId: number,
): Promise<PurchaseStatusActionResponse> {
  return purchaseApi.postPurchaseShip(purchaseId);
}

export async function markPurchaseReceived(
  purchaseId: number,
): Promise<PurchaseStatusActionResponse> {
  return purchaseApi.postPurchaseReceive(purchaseId);
}

export function getPurchaseBlockedReasonMessage(
  reason: PurchaseBlockedReason | null,
): string | null {
  if (!reason) {
    return null;
  }

  return PURCHASE_BLOCKED_REASON_MESSAGE[reason] ?? null;
}

export function canPurchaseWithBalance(
  balance: number,
  product: ProductPurchaseAvailabilityResponse | null,
): boolean {
  if (!product?.canPurchase) {
    return false;
  }

  const price = product.generalSale?.price;

  if (typeof price !== "number") {
    return false;
  }

  return balance >= price;
}

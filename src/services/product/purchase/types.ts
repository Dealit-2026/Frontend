export type PurchaseBlockedReason =
  | "EMAIL_NOT_VERIFIED"
  | "OWN_PRODUCT"
  | "PRODUCT_NOT_PURCHASABLE";

export interface ProductGeneralSale {
  price: number;
  status: string;
}

export interface ProductPurchaseAvailabilityResponse {
  productId: number;
  name: string;
  status: string;
  generalSale: ProductGeneralSale | null;
  canPurchase: boolean;
  purchaseBlockedReason: PurchaseBlockedReason | null;
}

export interface PurchaseRequest {
  idempotencyKey: string;
}

export interface PurchaseResponse {
  purchaseId: number;
  productId: number;
  amount: number;
  status: "PAID" | "COMPLETED" | string;
  purchasedAt: string;
}

export interface PurchaseReceiptResponse {
  purchaseId: number;
  productId: number;
  productTitle: string;
  productImageUrl: string | null;
  buyerId: number;
  sellerId: number;
  amount: number;
  status: "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED" | string;
  purchasedAt: string;
  shippingDeadlineAt: string | null;
  shippedAt: string | null;
  autoCompleteAt: string | null;
  buyerCompleted: boolean;
  sellerCompleted: boolean;
  buyerCompletedAt: string | null;
  sellerCompletedAt: string | null;
  completedAt: string | null;
  canceledAt: string | null;
  settledAt: string | null;
  chatRoomId: number | null;
}

export interface PurchaseStatusActionResponse {
  purchaseId: number;
  status: "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED" | string;
  buyerCompleted: boolean;
  sellerCompleted: boolean;
  buyerCompletedAt: string | null;
  sellerCompletedAt: string | null;
  shippedAt: string | null;
  autoCompleteAt: string | null;
  completedAt: string | null;
  canceledAt: string | null;
  settledAt: string | null;
}

export type PurchaseErrorCode =
  | "EMAIL_NOT_VERIFIED"
  | "OWN_PRODUCT"
  | "PRODUCT_NOT_PURCHASABLE"
  | "INSUFFICIENT_BALANCE"
  | "IDEMPOTENCY_CONFLICT"
  | "INVALID_REQUEST"
  | "VALIDATION_ERROR"
  | "PURCHASE_FORBIDDEN"
  | "PURCHASE_NOT_FOUND"
  | "PURCHASE_NOT_COMPLETABLE"
  | "TOKEN_EXPIRED"
  | "INVALID_TOKEN";

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  code: PurchaseErrorCode | string;
  message: string;
  errors: unknown[];
}

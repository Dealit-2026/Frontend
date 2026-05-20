export type TransactionStatus =
  | "PAID"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELED"
  | "PENDING"
  | string;

export type ProductType = "REGULAR" | "AUCTION" | string;

export interface Participant {
  id: number;
  nickname: string | null;
}

export interface TransactionReceiptResponse {
  id: number;
  transactionId: string;
  productId: number;
  productName: string;
  productImageUrl?: string | null;
  productType: ProductType;
  price: number;
  currency?: string;
  status: TransactionStatus;
  createdAt: string; // 주문 생성일
  purchasedAt: string; // 구매 일자 (백엔드에서 제공)
  paidAt: string | null;
  shippedAt: string | null;
  completedAt: string | null;
  canceledAt: string | null;
  sellerShipped: boolean;
  buyerConfirmed: boolean;
  counterpartNickname: string | null; // 예: 판매자명(구매 영수증에서는 판매자)
  seller: Participant;
  buyer: Participant;
  // 추가 정보 (결제수단 등) - optional
  meta?: Record<string, unknown> | null;
}

export default TransactionReceiptResponse;

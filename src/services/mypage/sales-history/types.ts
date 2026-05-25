import type { PageResponse } from "@/services/mypage/types";

export type SaleStatus = "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED";

export interface SaleItemResponse {
  purchaseId: number; // 거래 ID
  productId: number;
  productTitle: string | null;
  productImageUrl: string | null;
  counterpartMemberId: number;
  amount: number;
  status: SaleStatus;
  purchasedAt: string; // ISO timestamp
  chatRoomId: number | null;
  productType?: string | null;
  auctionId?: number | null;
  sellerShipped?: boolean;
  buyerConfirmed?: boolean;
  completed?: boolean;
  shippedAt?: string | null;
  completedAt?: string | null;
  reviewWritten?: boolean;
  reviewAvailable?: boolean;
  reviewReceived?: boolean;
}

export type SalePageResponse = PageResponse<SaleItemResponse>;

// 화면용 뷰모델 — service.ts에서 변환해 사용
export interface SaleItemViewModel {
  id: number;
  productId: number;
  title: string;
  imageUrl: string | null;
  counterpartMemberId: number;
  amountFormatted: string;
  status: SaleStatus;
  purchasedAtDisplay: string;
  chatRoomId: number | null;
  productType?: string | null;
  auctionId?: number | null;
  sellerShipped?: boolean;
  buyerConfirmed?: boolean;
  completed?: boolean;
  shippedAt?: string | null;
  completedAt?: string | null;
  reviewWritten?: boolean;
  reviewAvailable?: boolean;
  reviewReceived?: boolean;
}

// 상세 조회용 백엔드 응답
export interface SaleDetailResponse {
  purchaseId: number;
  productId: number;
  productTitle: string | null;
  productImageUrl: string | null;
  buyerId: number;
  sellerId: number;
  amount: number;
  status: SaleStatus;
  purchasedAt: string; // ISO timestamp
  chatRoomId: number | null;
  productType?: string | null;
  auctionId?: number | null;
  sellerShipped?: boolean;
  buyerConfirmed?: boolean;
  completed?: boolean;
  shippedAt?: string | null;
  completedAt?: string | null;
  reviewWritten?: boolean;
  reviewAvailable?: boolean;
  reviewReceived?: boolean;
}

// 상세 화면용 뷰모델
export interface SaleDetailViewModel {
  id: number;
  title: string;
  imageUrl: string | null;
  amountFormatted: string;
  status: SaleStatus;
  purchasedAtDisplay: string;
  chatRoomId: number | null;
  productType?: string | null;
  auctionId?: number | null;
  sellerShipped?: boolean;
  buyerConfirmed?: boolean;
  completed?: boolean;
  shippedAt?: string | null;
  completedAt?: string | null;
  reviewWritten?: boolean;
  reviewAvailable?: boolean;
  reviewReceived?: boolean;
}

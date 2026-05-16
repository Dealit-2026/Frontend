import type { PageResponse } from "@/services/mypage/types";

export type PurchaseStatus = "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED";

export interface PurchaseItemResponse {
  purchaseId: number;
  productId: number;
  productTitle: string | null;
  productImageUrl: string | null;
  counterpartMemberId: number;
  amount: number;
  status: PurchaseStatus;
  purchasedAt: string; // ISO timestamp
  chatRoomId: number | null;
}

export type PurchasePageResponse = PageResponse<PurchaseItemResponse>;

// 화면용 뷰모델 — service.ts에서 변환해 사용
export interface PurchaseItemViewModel {
  id: number;
  productId: number;
  title: string;
  imageUrl: string | null;
  counterpartMemberId: number;
  amountFormatted: string; // 예: "12,000원"
  status: PurchaseStatus;
  purchasedAtDisplay: string; // 예: "2026.05.06 21:30"
  chatRoomId: number | null;
}

// 상세 조회용 백엔드 응답
export interface PurchaseDetailResponse {
  purchaseId: number;
  productId: number;
  productTitle: string | null;
  productImageUrl: string | null;
  buyerId: number;
  sellerId: number;
  amount: number;
  status: PurchaseStatus;
  purchasedAt: string; // ISO timestamp
  chatRoomId: number | null;
}

// 상세 화면용 뷰모델
export interface PurchaseDetailViewModel {
  id: number;
  title: string;
  imageUrl: string | null;
  amountFormatted: string;
  status: PurchaseStatus;
  purchasedAtDisplay: string;
  chatRoomId: number | null;
}

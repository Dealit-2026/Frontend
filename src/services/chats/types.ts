// src/services/chats/types.ts

/**
 * chats 도메인 1차 범위:
 * - 목록
 * - 생성
 * - 안읽음
 * - 상세(roomId)
 * 실시간(SSE/WS)은 2차에서 확장
 */

/* =========================
 * 공통/기본 타입
 * ========================= */

export type ChatRoomType = "AUCTION" | "REGULAR";

export interface ChatParticipant {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface ChatProductSummary {
  productId: number;
  productName: string;
  productImageUrl: string | null;
  saleType: ChatRoomType;
}

/* =========================
 * 목록(List) - API DTO
 * ========================= */

export interface GetChatRoomsRequest {
  cursor?: number | null;
  size?: number;
  keyword?: string;
}

export interface ChatRoomListItemResponse {
  roomId: number;
  participant: ChatParticipant;
  product: ChatProductSummary;
  lastMessage: string | null;
  lastMessageAt: string | null; // ISO string
  unreadCount: number;
}

export interface GetChatRoomsResponse {
  items: ChatRoomListItemResponse[];
  nextCursor: number | null;
  hasNext: boolean;
  totalUnreadCount: number;
}

/* =========================
 * 생성(Create) - API DTO
 * ========================= */

export interface CreateChatRoomRequest {
  productId: number;
  opponentUserId: number;
}

export interface CreateChatRoomResponse {
  roomId: number;
  createdAt: string; // ISO string
}

/* =========================
 * 안읽음(Unread) - API DTO
 * ========================= */

export interface MarkChatRoomAsReadRequest {
  roomId: number;
  lastReadMessageId?: number | null;
}

export interface MarkChatRoomAsReadResponse {
  roomId: number;
  unreadCount: number; // 보통 0
  updatedAt: string; // ISO string
}

export interface GetUnreadCountResponse {
  totalUnreadCount: number;
}

/* =========================
 * 상세(Room Detail) - API DTO
 * ========================= */

export interface GetChatRoomDetailRequest {
  roomId: number;
  cursor?: number | null;
  size?: number;
}

export type ChatMessageSenderType = "ME" | "OTHER" | "SYSTEM";
export type ChatMessageType = "TEXT" | "IMAGE" | "SYSTEM";

export interface ChatMessageResponse {
  messageId: number;
  senderType: ChatMessageSenderType;
  senderId: number | null;
  senderNickname: string | null;
  content: string;
  messageType: ChatMessageType;
  createdAt: string; // ISO string
  isRead: boolean;
}

export interface GetChatRoomDetailResponse {
  roomId: number;
  participant: ChatParticipant;
  product: ChatProductSummary;
  messages: ChatMessageResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}

/* =========================
 * 화면(ViewModel) 타입
 * - page/index에서 바로 쓰기 쉬운 형태
 * ========================= */

export interface ChatRoomListItemVM {
  id: number;
  name: string;
  productName: string;
  productTypeLabel: "Deal it!" | "일반 판매";
  lastMessage: string;
  timeLabel: string;
  unreadCount: number;
  profileImageUrl: string | null;
}

export interface ChatRoomDetailVM {
  roomId: number;
  opponentName: string;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  productStatusLabel: string;
}

/* =========================
 * Service 반환 계약 (화면 전용)
 * ========================= */

export interface ChatRoomDetailResult {
  room: ChatRoomDetailVM;
  messages: ChatMessageResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}

/* =========================
 * (선택) 기존 코드 호환용 별칭
 * ========================= */

export type ChatRoomSummary = ChatRoomListItemResponse;
export type ChatRoomMessage = ChatMessageResponse;

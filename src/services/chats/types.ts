// src/services/chats/types.ts

/**
 * chats 도메인 범위:
 * - 채팅방 생성/목록
 * - 메시지 조회/전송/삭제
 * - 읽음/안읽음 조회
 * - 신고/웹소켓 확장 포인트
 */

/* =========================
 * 공통/기본 타입
 * ========================= */

export type ChatRoomType = "GENERAL" | "AUCTION";
export type ChatProductSaleType = "GENERAL" | "AUCTION";
export type ChatProductStatus = "ACTIVE" | "AUCTION_ENDED" | string;
export type ChatParticipantRole = "SELLER" | "BUYER";
export type ChatMessageType = "TEXT" | "IMAGE" | "SYSTEM" | "TALK";
export type ChatMessageSenderType = "ME" | "OTHER" | "SYSTEM";
export type ChatActionButtonType =
  | "GENERAL_PURCHASE"
  | "AUCTION_PAYMENT"
  | "SELLER_CONFIRM"
  | "BUYER_CONFIRM"
  | null;

export interface ChatActionButtons {
  canPay: boolean;
  canCompleteTrade: boolean;
  payButtonType: Exclude<ChatActionButtonType, null> | null;
  completeTradeButtonType: Exclude<ChatActionButtonType, null> | null;
}

export interface ChatRoomProduct {
  productId: number;
  name: string;
  thumbnailUrl: string | null;
  saleType?: ChatProductSaleType;
  status?: ChatProductStatus;
}

export interface ChatRoomParticipant {
  userId: number;
  nickname: string;
  profileImageUrl?: string | null;
  role?: ChatParticipantRole;
}

export interface ChatRoomLastMessage {
  messageId: number;
  type: ChatMessageType;
  content: string;
  sentAt: string;
}

/* =========================
 * 채팅방 생성
 * ========================= */

export interface CreateChatRoomRequest {
  productId: number;
}

export interface CreateChatRoomResponse {
  roomId: number;
  chatType: ChatRoomType;
  product: ChatRoomProduct;
  participants: ChatRoomParticipant[];
  isWinner: boolean;
  actionButtons: ChatActionButtons;
  createdAt: string;
}

/* =========================
 * 채팅방 목록
 * ========================= */

export interface GetChatRoomsRequest {
  page?: number;
  size?: number;
}

export interface ChatRoomListItemResponse {
  roomId: number;
  chatType: ChatRoomType;
  product: Pick<ChatRoomProduct, "productId" | "name" | "thumbnailUrl">;
  opponent: Pick<
    ChatRoomParticipant,
    "userId" | "nickname" | "profileImageUrl"
  >;
  lastMessage: ChatRoomLastMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface GetChatRoomsResponse {
  content: ChatRoomListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/* =========================
 * 메시지 조회/전송/삭제
 * ========================= */

export interface GetChatRoomMessagesRequest {
  roomId: number;
  page?: number;
  size?: number;
}

export interface ChatMessageResponse {
  messageId: number;
  senderId: number;
  senderNickname: string;
  messageType: ChatMessageType;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface GetChatRoomMessagesResponse {
  content: ChatMessageResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface SendChatMessageRequest {
  messageType: ChatMessageType;
  content: string;
}

export interface SendChatMessageResponse {
  messageId: number;
  roomId: number;
  senderId: number;
  messageType: ChatMessageType;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface ReportChatMessageRequest {
  reason: string;
}

export interface ReportChatMessageResponse {
  reportId: number;
  messageId: number;
  reason: string;
  reportedAt: string;
}

/* =========================
 * 읽음/안읽음
 * ========================= */

export interface MarkChatRoomAsReadResponse {
  roomId: number;
  message: string;
  readAt: string;
}

export interface GetUnreadCountResponse {
  totalUnreadCount: number;
  updatedAt: string;
}

/* =========================
 * 화면(ViewModel) 타입
 * ========================= */

export interface ChatRoomListItemVM {
  id: number;
  productId: number;
  name: string;
  productName: string;
  productTypeLabel: "Deal it!" | "일반 판매";
  lastMessage: string;
  timeLabel: string;
  unreadCount: number;
  profileImageUrl: string | null;
  chatType: ChatRoomType;
  isWinner?: boolean;
  actionButtons?: ChatActionButtons;
}

export interface ChatRoomDetailVM {
  roomId: number;
  opponentName: string;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  productStatusLabel: string;
  chatType?: ChatRoomType;
  isWinner?: boolean;
  actionButtons?: ChatActionButtons;
}

export interface ChatMessageVM extends ChatMessageResponse {
  senderType?: ChatMessageSenderType;
}

export interface ChatRoomMessagesResult {
  room: ChatRoomDetailVM;
  messages: ChatMessageVM[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/* =========================
 * 확장 포인트 / 별칭
 * ========================= */

export type ChatRoomSummary = ChatRoomListItemResponse;
export type ChatRoomMessage = ChatMessageResponse;
export type GetChatRoomDetailRequest = GetChatRoomMessagesRequest;
export type GetChatRoomDetailResponse = GetChatRoomMessagesResponse;
export type ChatRoomDetailResult = ChatRoomMessagesResult;

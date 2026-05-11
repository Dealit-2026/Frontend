// src/services/chats/service.ts
import * as chatsApi from "./api";
import {
  createFallbackChatRoomsResponse,
  createFallbackChatRoomDetailResult,
  createFallbackMarkReadResponse,
  createFallbackRoom,
  createFallbackUnreadCountResponse,
} from "./fallback";
import type {
  ChatActionButtons,
  ChatMessageType,
  ChatMessageVM,
  ChatRoomDetailVM,
  ChatRoomListItemResponse,
  ChatRoomListItemVM,
  ChatRoomMessagesResult,
  ChatRoomType,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  GetChatRoomMessagesRequest,
  GetChatRoomsRequest,
  MarkChatRoomAsReadResponse,
  ReportChatMessageRequest,
  SendChatMessageRequest,
  ActionButton,
  ChatRoomDetailResponse,
} from "./types";

/**
 * service.ts 규칙:
 * - page/컴포넌트가 직접 사용하는 진입점
 * - API 응답 -> 화면 친화 형태(VM) 변환
 * - 상세 화면은 room 메타가 없을 수 있으므로 안전한 fallback 유지
 */

/* =========================
 * 내부 유틸
 * ========================= */

function toProductTypeLabel(type: ChatRoomType): "Deal it!" | "일반 판매" {
  return type === "AUCTION" ? "Deal it!" : "일반 판매";
}

function toTimeLabel(iso: string | null | undefined): string {
  if (!iso) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minute = Math.floor(diffMs / (1000 * 60));
  const hour = Math.floor(diffMs / (1000 * 60 * 60));
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minute < 1) return "방금 전";
  if (minute < 60) return `${minute}분 전`;
  if (hour < 24) return `${hour}시간 전`;
  if (day < 7) return `${day}일 전`;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function mapMessageType(type: ChatMessageType): ChatMessageType {
  return type;
}

function toMessageVM(message: {
  messageId: number;
  senderId: number;
  senderNickname: string;
  messageType: ChatMessageType;
  content: string;
  isRead: boolean;
  sentAt: string;
}): ChatMessageVM {
  return {
    ...message,
    messageType: mapMessageType(message.messageType),
    senderType: message.senderNickname === "나" ? "ME" : "OTHER",
  };
}

export function toChatRoomListItemVM(
  item: ChatRoomListItemResponse,
): ChatRoomListItemVM {
  return {
    id: item.roomId,
    productId: item.product.productId,
    name: item.opponent.nickname,
    productName: item.product.name,
    productTypeLabel: toProductTypeLabel(item.chatType),
    lastMessage: item.lastMessage?.content ?? "",
    timeLabel: toTimeLabel(item.lastMessage?.sentAt ?? item.updatedAt),
    unreadCount: item.unreadCount,
    profileImageUrl: item.opponent.profileImageUrl ?? null,
    chatType: item.chatType,
    isWinner: undefined,
    actionButtons: undefined,
  };
}

function toRoomVMFromDetailRequest(roomId: number): ChatRoomDetailVM {
  return createFallbackRoom(roomId);
}

function toRoomDetailVM(response: CreateChatRoomResponse): ChatRoomDetailVM {
  const opponent = response.participants[1] ?? response.participants[0];

  return {
    roomId: response.roomId,
    opponentName: opponent?.nickname ?? "채팅방",
    productId: response.product.productId,
    productName: response.product.name ?? `상품 #${response.product.productId}`,
    productImageUrl: response.product.thumbnailUrl ?? null,
    productStatusLabel:
      response.chatType === "AUCTION" ? "Deal it! 거래" : "거래 중",
    chatType: response.chatType,
    isWinner: response.isWinner,
    actionButtons: response.actionButtons,
  };
}

/* =========================
 * page에서 호출할 공개 함수
 * ========================= */

/** 목록 조회 */
export async function fetchChatRooms(request: GetChatRoomsRequest = {}) {
  try {
    const response = await chatsApi.getChatRooms(request);

    return {
      ...response,
      content: response.content.map(toChatRoomListItemVM),
    };
  } catch (error) {
    console.warn("fetchChatRooms fallback activated:", error);

    return createFallbackChatRoomsResponse(
      request.page ?? 0,
      request.size ?? 20,
    );
  }
}

export async function findExistingChatRoomByProductId(productId: number) {
  const response = await chatsApi.getChatRooms({ page: 0, size: 100 });
  return response.content.find((room) => room.product.productId === productId);
}

/** 생성 */
export async function createChatRoom(request: CreateChatRoomRequest) {
  return chatsApi.postChatRoom(request);
}

export async function fetchChatRoom(roomId: number): Promise<ChatRoomDetailVM> {
  const response = await chatsApi.getChatRoom(roomId);
  return toRoomDetailVM(response);
}

/** 메시지 조회 */
export async function fetchChatMessages(
  request: GetChatRoomMessagesRequest,
): Promise<ChatRoomMessagesResult> {
  try {
    const [response, currentMember, roomMetadata] = await Promise.all([
      chatsApi.getChatRoomMessages(request),
      fetchCurrentMember().catch(() => null),
      chatsApi.getChatRoom(request.roomId).catch((error) => {
        console.warn("getChatRoom metadata fallback activated:", error);
        return null;
      }),
    ]);
    const currentMemberId = currentMember?.memberId ?? null;
    const room = roomMetadata
      ? toRoomDetailVM(roomMetadata)
      : toRoomVMFromDetailRequest(request.roomId);

    return {
      room,
      messages: response.content.map((message) =>
        toMessageVM(message, currentMemberId),
      ),
      page: response.page,
      size: response.size,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      hasNext: response.hasNext,
    };
  } catch (error) {
    console.warn("fetchChatMessages fallback activated:", error);

    return createFallbackChatRoomDetailResult(request.roomId);
  }
}

/** 상세 조회 호환 함수 */
export async function fetchChatRoomDetail(
  request: GetChatRoomMessagesRequest,
): Promise<ChatRoomMessagesResult> {
  return fetchChatMessages(request);
}

/** 거래 정보 조회 (actionButton 포함) */
export async function fetchChatRoomTradeInfo(
  roomId: number,
): Promise<ChatRoomDetailResponse> {
  return chatsApi.getChatRoomDetail(roomId);
}

/** 메시지 전송 */
export async function sendChatMessage(
  roomId: number,
  request: SendChatMessageRequest,
) {
  return chatsApi.postChatMessage(roomId, request);
}

export async function markAuctionShipment(
  roomId: number,
): Promise<ChatRoomDetailVM> {
  const response = await chatsApi.postChatRoomShipment(roomId);
  return toRoomDetailVM(response);
}

export async function confirmAuctionReceipt(
  roomId: number,
): Promise<ChatRoomDetailVM> {
  const response = await chatsApi.postChatRoomReceipt(roomId);
  return toRoomDetailVM(response);
}

/** 채팅 메시지 신고 */
export async function reportChatMessage(
  messageId: number,
  request: ReportChatMessageRequest,
) {
  return chatsApi.postChatMessageReport(messageId, request);
}

/** 안읽음 읽음 처리 */
export async function markChatRoomAsRead(
  roomId: number,
): Promise<MarkChatRoomAsReadResponse> {
  try {
    return await chatsApi.patchChatRoomRead(roomId);
  } catch (error) {
    console.warn("markChatRoomAsRead fallback:", error);

    return createFallbackMarkReadResponse(roomId);
  }
}

/** 전체 안읽음 개수 조회 */
export async function fetchTotalUnreadCount() {
  try {
    const resp = await chatsApi.getUnreadCount();

    const total =
      (resp as any).totalUnreadCount ?? (resp as any).unreadCount ?? 0;

    return {
      unreadCount: total,
      updatedAt: (resp as any).updatedAt,
    };
  } catch (error) {
    console.warn("fetchTotalUnreadCount fallback:", error);

    const fb = createFallbackUnreadCountResponse();
    return {
      unreadCount: (fb as any).totalUnreadCount ?? (fb as any).unreadCount ?? 0,
      updatedAt: fb.updatedAt,
    };
  }
}

/* =========================
 * unread 통합 규칙(도메인 유틸)
 * ========================= */

export function applyReadToChatList(
  list: ChatRoomListItemVM[],
  roomId: number,
): ChatRoomListItemVM[] {
  return list.map((item) =>
    item.id === roomId ? { ...item, unreadCount: 0 } : item,
  );
}

export function getTotalUnreadFromList(list: ChatRoomListItemVM[]): number {
  return list.reduce((sum, item) => sum + item.unreadCount, 0);
}

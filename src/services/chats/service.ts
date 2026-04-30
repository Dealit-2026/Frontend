// src/services/chats/service.ts
import * as chatsApi from "./api";
import {
  createFallbackChatRoomsResponse,
  createFallbackChatRoomDetailResult,
  createFallbackCreateChatRoomResponse,
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
  GetChatRoomMessagesRequest,
  GetChatRoomsRequest,
  MarkChatRoomAsReadResponse,
  ReportChatMessageRequest,
  SendChatMessageRequest,
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

/** 생성 */
export async function createChatRoom(request: CreateChatRoomRequest) {
  try {
    return await chatsApi.postChatRoom(request);
  } catch (error) {
    console.warn("createChatRoom failed:", error);

    return createFallbackCreateChatRoomResponse(request);
  }
}

/** 메시지 조회 */
export async function fetchChatMessages(
  request: GetChatRoomMessagesRequest,
): Promise<ChatRoomMessagesResult> {
  try {
    const response = await chatsApi.getChatRoomMessages(request);

    return {
      room: toRoomVMFromDetailRequest(request.roomId),
      messages: response.content.map(toMessageVM),
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

/** 메시지 전송 */
export async function sendChatMessage(
  roomId: number,
  request: SendChatMessageRequest,
) {
  return chatsApi.postChatMessage(roomId, request);
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

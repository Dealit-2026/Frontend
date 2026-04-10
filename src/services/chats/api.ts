// src/services/chats/api.ts
import type {
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  GetChatRoomDetailRequest,
  GetChatRoomDetailResponse,
  GetChatRoomsRequest,
  GetChatRoomsResponse,
  GetUnreadCountResponse,
  MarkChatRoomAsReadRequest,
  MarkChatRoomAsReadResponse,
} from "./types";

/**
 * api.ts 규칙:
 * - HTTP 요청/응답만 담당
 * - 데이터 가공/도메인 판단은 service.ts에서 처리
 */

function toQueryString(
  params: Record<string, string | number | null | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/** 1) 채팅방 목록 조회 */

/**
 * TODO(chats-api): 백엔드 최종 스펙 확정 시 엔드포인트/쿼리 파라미터 동기화 필요.
 * 현재 경로: GET /chats
 * 확인 항목: base path(/api 여부), cursor/size/keyword 명세
 */
export async function getChatRooms(
  request: GetChatRoomsRequest = {},
): Promise<GetChatRoomsResponse> {
  const query = toQueryString({
    cursor: request.cursor,
    size: request.size,
    keyword: request.keyword,
  });

  const response = await fetch(`/chats${query}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat rooms: ${response.status}`);
  }

  return response.json();
}

/** 2) 채팅방 생성 */
export async function postChatRoom(
  payload: CreateChatRoomRequest,
): Promise<CreateChatRoomResponse> {
  const response = await fetch("/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create chat room: ${response.status}`);
  }

  return response.json();
}

/** 3) 채팅방 상세 조회 */
export async function getChatRoomDetail(
  request: GetChatRoomDetailRequest,
): Promise<GetChatRoomDetailResponse> {
  const { roomId, cursor, size } = request;

  const query = toQueryString({
    cursor,
    size,
  });

  const response = await fetch(`/chats/${roomId}${query}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat room detail: ${response.status}`);
  }

  return response.json();
}

/** 4) 안읽음 처리(읽음 반영) */
export async function patchChatRoomRead(
  payload: MarkChatRoomAsReadRequest,
): Promise<MarkChatRoomAsReadResponse> {
  const response = await fetch(`/chats/${payload.roomId}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lastReadMessageId: payload.lastReadMessageId ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to mark chat room as read: ${response.status}`);
  }

  return response.json();
}

/** 5) 전체 안읽음 개수 조회 */
export async function getUnreadCount(): Promise<GetUnreadCountResponse> {
  const response = await fetch("/chats/unread-count", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch unread count: ${response.status}`);
  }

  return response.json();
}

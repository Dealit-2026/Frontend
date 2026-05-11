// src/services/chats/api.ts
import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import type {
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  GetChatRoomMessagesRequest,
  GetChatRoomMessagesResponse,
  GetChatRoomsRequest,
  GetChatRoomsResponse,
  GetUnreadCountResponse,
  MarkChatRoomAsReadResponse,
  ReportChatMessageRequest,
  ReportChatMessageResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
  ChatRoomDetailResponse,
} from "./types";

const CHAT_API_PREFIX = "/api/v1/chats";

/**
 * api.ts 규칙:
 * - HTTP 요청/응답만 담당
 * - 데이터 가공/도메인 판단은 service.ts에서 처리
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function createAuthHeaders(
  headers: Record<string, string> = {},
): Record<string, string> {
  const token = getAccessToken();
  if (!token) return headers;

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}

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

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(
        response,
        `HTTP ${response.status} ${response.statusText}`,
      ),
      response.status,
    );
  }
  return response.json() as Promise<T>;
}

/** 1) 채팅방 생성 */
export async function postChatRoom(
  payload: CreateChatRoomRequest,
): Promise<CreateChatRoomResponse> {
  const response = await fetch(`${CHAT_API_PREFIX}/rooms`, {
    method: "POST",
    headers: createAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseJson<CreateChatRoomResponse>(response);
}

/** 2) 채팅방 목록 조회 */
export async function getChatRooms(
  request: GetChatRoomsRequest = {},
): Promise<GetChatRoomsResponse> {
  const query = toQueryString({
    page: request.page ?? 0,
    size: request.size ?? 20,
  });

  const response = await fetch(`${CHAT_API_PREFIX}/rooms${query}`, {
    method: "GET",
    headers: createAuthHeaders(),
  });

  return parseJson<GetChatRoomsResponse>(response);
}

/** 3) 채팅 내역 조회 */
export async function getChatRoomMessages(
  request: GetChatRoomMessagesRequest,
): Promise<GetChatRoomMessagesResponse> {
  const { roomId, page = 0, size = 50 } = request;
  const query = toQueryString({ page, size });

  const response = await fetch(
    `${CHAT_API_PREFIX}/rooms/${roomId}/messages${query}`,
    {
      method: "GET",
      headers: createAuthHeaders(),
    },
  );

  return parseJson<GetChatRoomMessagesResponse>(response);
}

/** 3-1) 채팅방 상세 조회 (거래 버튼 정보 포함) */
export async function getChatRoomDetail(
  roomId: number,
): Promise<ChatRoomDetailResponse> {
  const response = await fetch(`${CHAT_API_PREFIX}/rooms/${roomId}`, {
    method: "GET",
    headers: createAuthHeaders(),
  });

  const data = await parseJson<ChatRoomDetailResponse>(response);
  console.log("[API] getChatRoomDetail response:", data);
  return data;
}

/** 4) 메시지 전송 */
export async function postChatMessage(
  roomId: number,
  payload: SendChatMessageRequest,
): Promise<SendChatMessageResponse> {
  const response = await fetch(`${CHAT_API_PREFIX}/rooms/${roomId}/messages`, {
    method: "POST",
    headers: createAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseJson<SendChatMessageResponse>(response);
}

/** 5) 메시지 삭제 (204 No Content) */
export async function deleteChatMessage(messageId: number): Promise<void> {
  const response = await fetch(`${CHAT_API_PREFIX}/messages/${messageId}`, {
    method: "DELETE",
    headers: createAuthHeaders(),
  });

  if (response.status === 204) return;
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
}

/** 6) 채팅방 읽음 처리 */
export async function patchChatRoomRead(
  roomId: number,
): Promise<MarkChatRoomAsReadResponse> {
  const response = await fetch(`${CHAT_API_PREFIX}/rooms/${roomId}/read`, {
    method: "PATCH",
    headers: createAuthHeaders(),
  });

  return parseJson<MarkChatRoomAsReadResponse>(response);
}

/** 7) 채팅 메시지 신고 */
export async function postChatMessageReport(
  messageId: number,
  payload: ReportChatMessageRequest,
): Promise<ReportChatMessageResponse> {
  const response = await fetch(
    `${CHAT_API_PREFIX}/messages/${messageId}/reports`,
    {
      method: "POST",
      headers: createAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    },
  );

  return parseJson<ReportChatMessageResponse>(response);
}

/** 8) 안읽은 채팅 수 조회 */
export async function getUnreadCount(): Promise<GetUnreadCountResponse> {
  const response = await fetch(`${CHAT_API_PREFIX}/unread-count`, {
    method: "GET",
    headers: createAuthHeaders(),
  });

  return parseJson<GetUnreadCountResponse>(response);
}

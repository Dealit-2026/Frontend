// src/services/chats/service.ts
import * as chatsApi from "./api";
import type {
  ChatRoomDetailResult,
  ChatRoomDetailVM,
  ChatRoomListItemResponse,
  ChatRoomListItemVM,
  ChatRoomType,
  CreateChatRoomRequest,
  GetChatRoomDetailRequest,
  GetChatRoomsRequest,
  MarkChatRoomAsReadRequest,
} from "./types";

/**
 * service.ts 규칙:
 * - page/컴포넌트가 직접 사용하는 진입점
 * - API 응답 -> 화면 친화 형태(VM) 변환
 * - unread 관련 도메인 규칙 통합
 */

/* =========================
 * 내부 유틸
 * ========================= */

function toProductTypeLabel(type: ChatRoomType): "Deal it!" | "일반 판매" {
  return type === "AUCTION" ? "Deal it!" : "일반 판매";
}

function toTimeLabel(iso: string | null): string {
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

/* =========================
 * 목록 변환
 * ========================= */

export function toChatRoomListItemVM(
  item: ChatRoomListItemResponse,
): ChatRoomListItemVM {
  return {
    id: item.roomId,
    name: item.participant.nickname,
    productName: item.product.productName,
    productTypeLabel: toProductTypeLabel(item.product.saleType),
    lastMessage: item.lastMessage ?? "",
    timeLabel: toTimeLabel(item.lastMessageAt),
    unreadCount: item.unreadCount,
    profileImageUrl: item.participant.profileImageUrl,
  };
}

export function toChatRoomListVM(
  items: ChatRoomListItemResponse[],
): ChatRoomListItemVM[] {
  return items.map(toChatRoomListItemVM);
}

/** 개발 단계 fallback 데이터 (백엔드 미연결 시) */
function getChatRoomsFallback(): ChatRoomListItemVM[] {
  return [
    {
      id: 1,
      name: "이경석",
      productName: "아이폰 14 Pro 256GB",
      productTypeLabel: "Deal it!",
      lastMessage: "네, 직거래 가능합니다",
      timeLabel: "5분 전",
      unreadCount: 2,
      profileImageUrl: "https://picsum.photos/seed/user1/100/100",
    },
    {
      id: 2,
      name: "이동녕",
      productName: "맥북 프로 16인치",
      productTypeLabel: "일반 판매",
      lastMessage: "직거래 안됩니다...",
      timeLabel: "1시간 전",
      unreadCount: 0,
      profileImageUrl: "https://picsum.photos/seed/user2/100/100",
    },
    {
      id: 3,
      name: "이다윤",
      productName: "에어팟 프로 2세대",
      productTypeLabel: "일반 판매",
      lastMessage: "입금 확인했습니다",
      timeLabel: "3시간 전",
      unreadCount: 1,
      profileImageUrl: "https://picsum.photos/seed/user3/100/100",
    },
  ];
}

/* =========================
 * 상세 변환
 * ========================= */

export function toChatRoomDetailVM(detail: {
  roomId: number;
  participant: { nickname: string };
  product: {
    productId: number;
    productName: string;
    productImageUrl: string | null;
  };
}): ChatRoomDetailVM {
  return {
    roomId: detail.roomId,
    opponentName: detail.participant.nickname,
    productId: detail.product.productId,
    productName: detail.product.productName,
    productImageUrl: detail.product.productImageUrl,
    productStatusLabel: "거래 중", // 1차 고정값
  };
}

/** 상세 fallback 데이터 (백엔드 미연결 시) */
function getChatRoomDetailFallback(roomId: number): ChatRoomDetailResult {
  return {
    room: {
      roomId,
      opponentName: "상대방",
      productId: 1,
      productName: "임시 상품",
      productImageUrl: "https://picsum.photos/seed/p1/100/100",
      productStatusLabel: "거래 중",
    },
    messages: [
      {
        messageId: 1,
        senderType: "OTHER",
        senderId: 2,
        senderNickname: "상대방",
        content: "안녕하세요! 문의 주신 내용 확인했습니다.",
        messageType: "TEXT",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        isRead: true,
      },
      {
        messageId: 2,
        senderType: "ME",
        senderId: 1,
        senderNickname: "나",
        content: "네, 감사합니다. 거래 가능 시간 궁금해요.",
        messageType: "TEXT",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        isRead: true,
      },
    ],
    nextCursor: null,
    hasNext: false,
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
      items: toChatRoomListVM(response.items),
    };
  } catch (error) {
    console.warn("fetchChatRooms fallback activated:", error);

    const fallbackItems = getChatRoomsFallback();

    return {
      items: fallbackItems,
      nextCursor: null,
      hasNext: false,
      totalUnreadCount: getTotalUnreadFromList(fallbackItems),
    };
  }
}

/** 생성 */
export async function createChatRoom(request: CreateChatRoomRequest) {
  try {
    return await chatsApi.postChatRoom(request);
  } catch (error) {
    console.warn("createChatRoom failed:", error);
    // 생성은 fallback roomId로 임시 대체
    return {
      roomId: 1,
      createdAt: new Date().toISOString(),
    };
  }
}

/** 상세 조회 */
export async function fetchChatRoomDetail(
  request: GetChatRoomDetailRequest,
): Promise<ChatRoomDetailResult> {
  try {
    const response = await chatsApi.getChatRoomDetail(request);

    return {
      room: toChatRoomDetailVM(response),
      messages: response.messages,
      nextCursor: response.nextCursor,
      hasNext: response.hasNext,
    };
  } catch (error) {
    console.warn("fetchChatRoomDetail fallback activated:", error);
    return getChatRoomDetailFallback(request.roomId);
  }
}

/** 안읽음 읽음 처리 */
export async function markChatRoomAsRead(request: MarkChatRoomAsReadRequest) {
  try {
    return await chatsApi.patchChatRoomRead(request);
  } catch (error) {
    console.warn("markChatRoomAsRead fallback:", error);
    return {
      roomId: request.roomId,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };
  }
}

/** 전체 안읽음 개수 조회 */
export async function fetchTotalUnreadCount() {
  try {
    return await chatsApi.getUnreadCount();
  } catch (error) {
    console.warn("fetchTotalUnreadCount fallback:", error);
    return {
      totalUnreadCount: 0,
    };
  }
}

/* =========================
 * unread 통합 규칙(도메인 유틸)
 * ========================= */

/**
 * 목록에서 특정 방 unread를 0으로 반영하는 규칙.
 * page에서 상태 업데이트 시 재사용 가능.
 */
export function applyReadToChatList(
  list: ChatRoomListItemVM[],
  roomId: number,
): ChatRoomListItemVM[] {
  return list.map((item) =>
    item.id === roomId ? { ...item, unreadCount: 0 } : item,
  );
}

/** 목록 전체 unread 총합 계산 */
export function getTotalUnreadFromList(list: ChatRoomListItemVM[]): number {
  return list.reduce((sum, item) => sum + item.unreadCount, 0);
}

import type {
  ChatActionButtons,
  ChatMessageVM,
  ChatRoomDetailVM,
  ChatRoomListItemVM,
  ChatRoomMessagesResult,
  ChatRoomType,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  MarkChatRoomAsReadResponse,
  GetUnreadCountResponse,
} from "./types";

function createFallbackActionButtons(): ChatActionButtons {
  return {
    canPay: false,
    canCompleteTrade: false,
    payButtonType: null,
    completeTradeButtonType: null,
    canShip: false,
    canConfirmReceipt: false,
    shipButtonType: null,
    confirmReceiptButtonType: null,
    status: null,
    notice: null,
    shipDeadline: null,
    receiptDeadline: null,
  };
}

export function createFallbackRoom(roomId: number): ChatRoomDetailVM {
  return {
    roomId,
    opponentName: "상대방",
    productId: 1,
    productName: "임시 상품",
    productImageUrl: "https://picsum.photos/seed/p1/100/100",
    productStatusLabel: "거래 중",
    chatType: "GENERAL",
    isWinner: false,
    actionButtons: createFallbackActionButtons(),
  };
}

export function createFallbackMessages(): ChatMessageVM[] {
  return [
    {
      messageId: 1,
      senderId: 2,
      senderNickname: "상대방",
      messageType: "TEXT",
      content: "안녕하세요! 문의 주신 내용 확인했습니다.",
      isRead: true,
      sentAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      senderType: "OTHER",
    },
    {
      messageId: 2,
      senderId: 1,
      senderNickname: "나",
      messageType: "TEXT",
      content: "네, 감사합니다. 거래 가능 시간 궁금해요.",
      isRead: true,
      sentAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      senderType: "ME",
    },
  ];
}

export function createFallbackChatRooms(): ChatRoomListItemVM[] {
  return [
    {
      id: 1,
      productId: 1,
      name: "이경석",
      productName: "아이폰 14 Pro 256GB",
      productTypeLabel: "Deal it!",
      lastMessage: "네, 직거래 가능합니다",
      timeLabel: "5분 전",
      unreadCount: 2,
      profileImageUrl: "https://picsum.photos/seed/user1/100/100",
      chatType: "AUCTION",
    },
  ];
}

export function createFallbackChatRoomsResponse(
  page: number,
  size: number,
): {
  content: ChatRoomListItemVM[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
} {
  const content = createFallbackChatRooms();

  return {
    content,
    page,
    size,
    totalElements: content.length,
    totalPages: 1,
    hasNext: false,
  };
}

export function createFallbackChatRoomDetailResult(
  roomId: number,
): ChatRoomMessagesResult {
  return {
    room: createFallbackRoom(roomId),
    messages: createFallbackMessages(),
    page: 0,
    size: 50,
    totalElements: 2,
    totalPages: 1,
    hasNext: false,
  };
}

export function createFallbackCreateChatRoomResponse(
  request: CreateChatRoomRequest,
): CreateChatRoomResponse {
  return {
    roomId: 1,
    chatType: "GENERAL" as ChatRoomType,
    product: {
      productId: request.productId,
      name: "임시 상품",
      thumbnailUrl: "https://picsum.photos/seed/p1/100/100",
      saleType: "GENERAL",
      status: "ACTIVE",
    },
    participants: [
      {
        userId: 1,
        nickname: "나",
        role: "BUYER",
      },
      {
        userId: 2,
        nickname: "상대방",
        role: "SELLER",
      },
    ],
    isWinner: false,
    actionButtons: {
      canPay: false,
      canCompleteTrade: false,
      payButtonType: null,
      completeTradeButtonType: null,
      canShip: false,
      canConfirmReceipt: false,
      shipButtonType: null,
      confirmReceiptButtonType: null,
      status: null,
      notice: null,
      shipDeadline: null,
      receiptDeadline: null,
    },
    createdAt: new Date().toISOString(),
  };
}

export function createFallbackMarkReadResponse(
  roomId: number,
): MarkChatRoomAsReadResponse {
  return {
    roomId,
    message: "채팅방 메시지가 모두 읽음 처리되었습니다.",
    readAt: new Date().toISOString(),
  };
}

export function createFallbackUnreadCountResponse(): GetUnreadCountResponse {
  return {
    totalUnreadCount: 0,
    updatedAt: new Date().toISOString(),
  };
}

import type { ChatRoomListItemVM } from "./types";

const STORAGE_KEY_PREFIX = "dealit_chat_room_preview:";

export function saveChatRoomPreview(room: ChatRoomListItemVM) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    `${STORAGE_KEY_PREFIX}${room.id}`,
    JSON.stringify({
      id: room.id,
      productId: room.productId,
      auctionId: room.auctionId,
      name: room.name,
      productName: room.productName,
      productImageUrl: room.productImageUrl,
    }),
  );
}

export function getChatRoomPreview(roomId: number) {
  if (typeof window === "undefined") return null;

  const value = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${roomId}`);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<ChatRoomListItemVM>;
    if (
      typeof parsed.id !== "number" ||
      typeof parsed.productId !== "number"
    ) {
      return null;
    }

    return {
      id: parsed.id,
      productId: parsed.productId,
      auctionId: parsed.auctionId ?? null,
      name: parsed.name ?? "",
      productName: parsed.productName ?? "",
      productImageUrl: parsed.productImageUrl ?? null,
    };
  } catch {
    return null;
  }
}

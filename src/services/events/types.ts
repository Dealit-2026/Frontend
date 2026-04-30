import type { ChatRoomListItemResponse } from "../chats/types";

export interface EventStreamConnectedEvent {
  type: "event.stream.connected";
  userId: number;
  connectedAt: string;
}

export interface ChatRoomUpdatedEvent {
  type: "chat.room.updated";
  room: ChatRoomListItemResponse;
  emittedAt: string;
}

export interface ChatUnreadCountUpdatedEvent {
  type: "chat.unread-count.updated";
  totalUnreadCount: number;
  emittedAt: string;
}

export type AppEventStreamEvent =
  | EventStreamConnectedEvent
  | ChatRoomUpdatedEvent
  | ChatUnreadCountUpdatedEvent
  | { type: string; [key: string]: unknown };

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

export interface AuctionBidUpdatedEvent {
  type: "AUCTION_BID_UPDATED";
  auctionId: number;
  currentPrice: number;
  minimumNextBidPrice: number;
  bidCount: number;
  bidderCount: number;
  serverTime: string;
}

export interface AuctionBidReceivedEvent {
  type: "BID_RECEIVED";
  auctionId: number;
  bidderId: number;
  currentPrice: number;
  bidCount: number;
  firstBid: boolean;
  serverTime: string;
}

export interface AuctionOutbidEvent {
  type: "OUTBID";
  auctionId: number;
  previousBidderId: number;
  newBidderId: number;
  currentPrice: number;
  serverTime: string;
}

export interface AuctionEndedEvent {
  type: "AUCTION_ENDED";
  auctionId: number;
  winnerId: number | null;
  finalPrice: number | null;
  status: "SUCCESSFUL_BID" | "NO_BID" | "ENDED" | string;
  serverTime: string;
}

export interface AuctionBidSubmittedEvent {
  type: "BID_UPDATED";
  auctionId: number;
  currentPrice: number;
  bidderId: number;
  serverTime: string;
}

export type AuctionEventStreamEvent =
  | AuctionBidUpdatedEvent
  | AuctionBidReceivedEvent
  | AuctionOutbidEvent
  | AuctionEndedEvent
  | AuctionBidSubmittedEvent;

export type AppEventStreamEvent =
  | EventStreamConnectedEvent
  | ChatRoomUpdatedEvent
  | ChatUnreadCountUpdatedEvent
  | AuctionEventStreamEvent
  | { type: string; [key: string]: unknown };

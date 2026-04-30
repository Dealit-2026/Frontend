"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchTotalUnreadCount } from "../chats/service";
import type {
  AppEventStreamEvent,
  ChatRoomUpdatedEvent,
  ChatUnreadCountUpdatedEvent,
} from "./types";
import { subscribeEventStream } from "./stream";

interface EventStreamContextValue {
  chatUnreadCount: number;
  latestChatRoomEvent: ChatRoomUpdatedEvent | null;
  setChatUnreadCount: (count: number) => void;
}

const EventStreamContext = createContext<EventStreamContextValue | null>(null);

function hasAccessToken(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("accessToken"));
}

function isChatUnreadCountUpdatedEvent(
  event: AppEventStreamEvent,
): event is ChatUnreadCountUpdatedEvent {
  return (
    event.type === "chat.unread-count.updated" &&
    typeof (event as { totalUnreadCount?: unknown }).totalUnreadCount ===
      "number"
  );
}

function isChatRoomUpdatedEvent(
  event: AppEventStreamEvent,
): event is ChatRoomUpdatedEvent {
  return (
    event.type === "chat.room.updated" &&
    typeof (event as { room?: unknown }).room === "object" &&
    (event as { room?: unknown }).room !== null
  );
}

export function EventStreamProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const [chatUnreadCount, setChatUnreadCountState] = useState(0);
  const [latestChatRoomEvent, setLatestChatRoomEvent] =
    useState<ChatRoomUpdatedEvent | null>(null);

  const setChatUnreadCount = useCallback((count: number) => {
    setChatUnreadCountState(Math.max(0, count));
  }, []);

  useEffect(() => {
    if (!enabled || !hasAccessToken()) {
      setChatUnreadCount(0);
      setLatestChatRoomEvent(null);
      return;
    }

    let cancelled = false;

    fetchTotalUnreadCount()
      .then((result) => {
        if (!cancelled) {
          setChatUnreadCount(result.unreadCount);
        }
      })
      .catch((error) => {
        console.warn("fetchTotalUnreadCount failed:", error);
      });

    const subscription = subscribeEventStream({
      onEvent: (event) => {
        if (isChatUnreadCountUpdatedEvent(event)) {
          setChatUnreadCount(event.totalUnreadCount);
          return;
        }

        if (isChatRoomUpdatedEvent(event)) {
          setLatestChatRoomEvent(event);
        }
      },
      onError: (error) => {
        console.warn("event stream error:", error);
      },
    });

    return () => {
      cancelled = true;
      subscription.close();
    };
  }, [enabled, setChatUnreadCount]);

  const value = useMemo<EventStreamContextValue>(
    () => ({
      chatUnreadCount,
      latestChatRoomEvent,
      setChatUnreadCount,
    }),
    [chatUnreadCount, latestChatRoomEvent, setChatUnreadCount],
  );

  return (
    <EventStreamContext.Provider value={value}>
      {children}
    </EventStreamContext.Provider>
  );
}

export function useEventStream() {
  const context = useContext(EventStreamContext);
  return (
    context ?? {
      chatUnreadCount: 0,
      latestChatRoomEvent: null,
      setChatUnreadCount: () => {},
    }
  );
}

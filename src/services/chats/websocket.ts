import type { ChatMessageResponse, SendChatMessageRequest } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

export interface ChatRoomSocketSubscription {
  send: (message: SendChatMessageRequest) => boolean;
  close: () => void;
}

interface SubscribeChatRoomOptions {
  roomId: number;
  onMessage: (message: ChatMessageResponse) => void;
  onError?: (error: unknown) => void;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getWebSocketUrl() {
  const baseUrl = new URL(API_BASE_URL);
  if (
    typeof window !== "undefined" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname) &&
    ["localhost", "127.0.0.1"].includes(baseUrl.hostname)
  ) {
    baseUrl.hostname = window.location.hostname;
  }
  baseUrl.protocol = baseUrl.protocol === "https:" ? "wss:" : "ws:";
  baseUrl.pathname = "/ws/chat";
  baseUrl.search = "";
  baseUrl.hash = "";
  return baseUrl.toString();
}

function buildFrame(
  command: string,
  headers: Record<string, string>,
  body = "",
) {
  const headerLines = Object.entries(headers).map(
    ([key, value]) => `${key}:${value}`,
  );
  return `${command}\n${headerLines.join("\n")}\n\n${body}\0`;
}

function parseFrames(buffer: string) {
  const frames = buffer.split("\0");
  const remainder = frames.pop() ?? "";
  return {
    frames: frames.filter(Boolean),
    remainder,
  };
}

function parseFrame(frame: string) {
  const normalized = frame.replace(/^\n+/, "");
  const separatorIndex = normalized.indexOf("\n\n");
  const headerPart =
    separatorIndex >= 0 ? normalized.slice(0, separatorIndex) : normalized;
  const body = separatorIndex >= 0 ? normalized.slice(separatorIndex + 2) : "";
  const [command, ...headerLines] = headerPart.split("\n");
  const headers = Object.fromEntries(
    headerLines
      .map((line) => {
        const delimiterIndex = line.indexOf(":");
        if (delimiterIndex < 0) return null;
        return [line.slice(0, delimiterIndex), line.slice(delimiterIndex + 1)];
      })
      .filter((entry): entry is [string, string] => entry !== null),
  );

  return { command, headers, body };
}

export function subscribeChatRoom({
  roomId,
  onMessage,
  onError,
}: SubscribeChatRoomOptions): ChatRoomSocketSubscription {
  const token = getAccessToken();
  let connected = false;
  let closed = false;
  let pendingMessages: SendChatMessageRequest[] = [];
  let frameBuffer = "";
  let socket: WebSocket | null = null;

  const sendFrame = (frame: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(frame);
      return true;
    }
    return false;
  };

  const sendMessage = (message: SendChatMessageRequest) => {
    if (!connected) {
      pendingMessages = [...pendingMessages, message];
      return false;
    }

    return sendFrame(
      buildFrame(
        "SEND",
        {
          destination: `/app/chats/rooms/${roomId}/messages`,
          "content-type": "application/json",
        },
        JSON.stringify(message),
      ),
    );
  };

  if (!token || typeof window === "undefined") {
    onError?.(new Error("채팅 WebSocket 인증 토큰이 없습니다."));
    return {
      send: sendMessage,
      close: () => {
        closed = true;
      },
    };
  }

  socket = new WebSocket(getWebSocketUrl());

  socket.addEventListener("open", () => {
    sendFrame(
      buildFrame("CONNECT", {
        "accept-version": "1.2",
        "heart-beat": "0,0",
        Authorization: `Bearer ${token}`,
      }),
    );
  });

  socket.addEventListener("message", (event) => {
    frameBuffer += String(event.data);
    const parsed = parseFrames(frameBuffer);
    frameBuffer = parsed.remainder;

    parsed.frames.forEach((rawFrame) => {
      const frame = parseFrame(rawFrame);

      if (frame.command === "CONNECTED") {
        connected = true;
        sendFrame(
          buildFrame("SUBSCRIBE", {
            id: `chat-room-${roomId}`,
            destination: `/topic/chats/rooms/${roomId}`,
          }),
        );
        pendingMessages.forEach(sendMessage);
        pendingMessages = [];
        return;
      }

      if (frame.command === "MESSAGE") {
        try {
          onMessage(JSON.parse(frame.body) as ChatMessageResponse);
        } catch (error) {
          onError?.(error);
        }
      }

      if (frame.command === "ERROR") {
        onError?.(new Error(frame.body || "채팅 WebSocket 오류가 발생했습니다."));
      }
    });
  });

  socket.addEventListener("error", (event) => {
    if (!closed) {
      onError?.(event);
    }
  });

  socket.addEventListener("close", () => {
    connected = false;
  });

  return {
    send: sendMessage,
    close: () => {
      closed = true;
      connected = false;
      pendingMessages = [];
      if (socket?.readyState === WebSocket.OPEN) {
        sendFrame(buildFrame("DISCONNECT", {}));
      }
      socket?.close();
    },
  };
}

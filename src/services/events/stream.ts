import type { AppEventStreamEvent } from "./types";

const EVENT_STREAM_API_URL = "/api/v1/events/stream";

export interface EventStreamSubscription {
  close: () => void;
}

interface SubscribeOptions {
  onEvent: (event: AppEventStreamEvent) => void;
  onError?: (error: unknown) => void;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function parseSseData(buffer: string): string[] {
  const chunks = buffer.split(/\n\n/);
  chunks.pop();

  return chunks
    .map((chunk) =>
      chunk
        .split(/\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n"),
    )
    .filter(Boolean);
}

export function subscribeEventStream({
  onEvent,
  onError,
}: SubscribeOptions): EventStreamSubscription {
  let closed = false;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let controller: AbortController | null = null;

  const connect = async () => {
    const token = getAccessToken();
    if (!token || closed) return;

    controller = new AbortController();

    try {
      const response = await fetch(EVENT_STREAM_API_URL, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`SSE HTTP ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (!closed) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

        const lastBoundary = buffer.lastIndexOf("\n\n");
        if (lastBoundary < 0) continue;

        const complete = buffer.slice(0, lastBoundary + 2);
        buffer = buffer.slice(lastBoundary + 2);

        for (const data of parseSseData(complete)) {
          try {
            onEvent(JSON.parse(data) as AppEventStreamEvent);
          } catch (error) {
            onError?.(error);
          }
        }
      }
    } catch (error) {
      if (!closed) {
        onError?.(error);
      }
    } finally {
      controller = null;
      if (!closed) {
        retryTimer = setTimeout(connect, 3000);
      }
    }
  };

  void connect();

  return {
    close: () => {
      closed = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      controller?.abort();
    },
  };
}

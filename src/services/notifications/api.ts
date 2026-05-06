import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  DeleteNotificationResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  NotificationListResponse,
  UnreadNotificationCountResponse,
} from "./types";

export type RegisterFcmTokenPayload = {
  token: string;
  deviceId?: string;
  platform?: string;
};

export type RegisterFcmTokenResponse = {
  fcmTokenId: number;
  registered: boolean;
};

async function throwProtectedApiError(
  response: Response,
  fallbackMessage: string,
) {
  if (response.status === 401) {
    handleUnauthorizedAccess();
  }

  throw new ApiRequestError(
    await getApiErrorMessage(response, fallbackMessage),
    response.status,
  );
}

export async function getNotifications(
  page = 0,
  size = 20,
): Promise<NotificationListResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(
    `/api/v1/notifications?${searchParams.toString()}`,
    {
      method: "GET",
      headers: getAuthorizationHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    await throwProtectedApiError(response, "알림 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getUnreadNotificationCount(): Promise<UnreadNotificationCountResponse> {
  const response = await fetch("/api/v1/notifications/unread-count", {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "안 읽은 알림 개수를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function markNotificationAsRead(
  notificationId: number,
): Promise<MarkNotificationReadResponse> {
  const response = await fetch(`/api/v1/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "알림 읽음 처리에 실패했습니다.");
  }

  return response.json();
}

export async function markAllNotificationsAsRead(): Promise<MarkAllNotificationsReadResponse> {
  const response = await fetch("/api/v1/notifications/read-all", {
    method: "PATCH",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "전체 알림 읽음 처리에 실패했습니다.");
  }

  return response.json();
}

export async function deleteNotification(
  notificationId: number,
): Promise<DeleteNotificationResponse> {
  const response = await fetch(`/api/v1/notifications/${notificationId}`, {
    method: "DELETE",
    headers: getAuthorizationHeaders(),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "알림 삭제에 실패했습니다.");
  }

  return response.json();
}

export async function registerFcmToken(
  payload: RegisterFcmTokenPayload,
  headers: Record<string, string> = {},
): Promise<RegisterFcmTokenResponse> {
  const response = await fetch("/api/v1/notifications/fcm-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(response, "푸시 알림 연결에 실패했습니다."),
      response.status,
    );
  }

  return response.json();
}

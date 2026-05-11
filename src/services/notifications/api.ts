import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";

export type RegisterFcmTokenPayload = {
  token: string;
  deviceId?: string;
  platform?: string;
};

export type RegisterFcmTokenResponse = {
  fcmTokenId: number;
  registered: boolean;
};

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

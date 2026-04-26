import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import { getAuthorizationHeaders, handleUnauthorizedAccess } from "@/services/auth/service";
import type { ResolveLocationRequest, ResolvedLocationResponse } from "@/services/location/types";

async function throwLocationApiError(response: Response, fallbackMessage: string) {
  if (response.status === 401) {
    handleUnauthorizedAccess();
  }

  throw new ApiRequestError(
    await getApiErrorMessage(response, fallbackMessage),
    response.status,
  );
}

export async function resolveLocation(
  payload: ResolveLocationRequest,
): Promise<ResolvedLocationResponse> {
  const response = await fetch("/api/v1/locations/resolve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwLocationApiError(response, "현재 위치를 주소로 변환하지 못했습니다.");
  }

  return response.json();
}

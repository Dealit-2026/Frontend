import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  MyLocationResponse,
  MyProfileResponse,
  UpdateMyLocationRequest,
  UpdateMyLocationResponse,
  UpdateMyProfileRequest,
  UploadProfileImageResponse,
} from "@/services/mypage/types";

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

export async function getMyProfile(): Promise<MyProfileResponse> {
  const response = await fetch("/api/v1/users/me/mypage", {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "마이페이지 조회에 실패했습니다.");
  }

  return response.json();
}

export async function getMyLocation(): Promise<MyLocationResponse> {
  const response = await fetch("/api/v1/users/me/location", {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "지역 정보를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function updateMyProfile(
  payload: UpdateMyProfileRequest,
): Promise<MyProfileResponse> {
  const response = await fetch("/api/v1/users/me/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "프로필 저장에 실패했습니다.");
  }

  return response.json();
}

export async function updateMyLocation(
  payload: UpdateMyLocationRequest,
): Promise<UpdateMyLocationResponse> {
  const response = await fetch("/api/v1/users/me/location", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, "지역 저장에 실패했습니다.");
  }

  return response.json();
}

export async function uploadProfileImage(
  file: File,
): Promise<UploadProfileImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/v1/users/me/profile-image", {
    method: "POST",
    headers: getAuthorizationHeaders(),
    body: formData,
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "프로필 이미지 업로드에 실패했습니다.",
    );
  }

  return response.json();
}

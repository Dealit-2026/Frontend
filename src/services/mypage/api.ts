import type {
  MyProfileResponse,
  UpdateMyLocationRequest,
  UpdateMyLocationResponse,
  UpdateMyProfileRequest,
  UploadProfileImageResponse,
} from "@/services/mypage/types";

export async function getMyProfile(): Promise<MyProfileResponse> {
  const response = await fetch("/users/me/mypage", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get my profile: ${response.status}`);
  }

  return response.json();
}

export async function updateMyProfile(
  payload: UpdateMyProfileRequest,
): Promise<MyProfileResponse> {
  const response = await fetch("/users/me/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update my profile: ${response.status}`);
  }

  return response.json();
}

export async function updateMyLocation(
  payload: UpdateMyLocationRequest,
): Promise<UpdateMyLocationResponse> {
  const response = await fetch("/users/me/location", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update my location: ${response.status}`);
  }

  return response.json();
}

export async function uploadProfileImage(
  file: File,
): Promise<UploadProfileImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/users/me/profile-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload profile image: ${response.status}`);
  }

  return response.json();
}

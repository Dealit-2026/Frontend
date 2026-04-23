import * as mypageApi from "@/services/mypage/api";
import type {
  MyPageProfileViewModel,
  MyProfileFormValues,
  MyProfileResponse,
  UpdateMyLocationRequest,
  UpdateMyProfileRequest,
} from "@/services/mypage/types";

const PROFILE_IMAGE_PATH_PATTERN = /^\/profile\/images\//;

function resolveProfileImageUrl(profileImageUrl: string | null) {
  if (!profileImageUrl) {
    return "";
  }

  if (/^(data:|blob:)/.test(profileImageUrl)) {
    return profileImageUrl;
  }

  if (/^https?:\/\//.test(profileImageUrl)) {
    try {
      const url = new URL(profileImageUrl);

      if (
        PROFILE_IMAGE_PATH_PATTERN.test(url.pathname) &&
        ["localhost", "127.0.0.1"].includes(url.hostname)
      ) {
        return `${url.pathname}${url.search}`;
      }
    } catch {
      return profileImageUrl;
    }

    return profileImageUrl;
  }

  if (PROFILE_IMAGE_PATH_PATTERN.test(profileImageUrl)) {
    return profileImageUrl;
  }

  return profileImageUrl;
}

export function createDefaultProfileForm(): MyProfileFormValues {
  return {
    nickname: "",
    bio: "",
    profileImageUrl: null,
    location: "",
  };
}

export function normalizeProfileForm(
  profile: MyProfileResponse,
): MyProfileFormValues {
  return {
    nickname: profile.nickname ?? "",
    bio: profile.bio ?? "",
    profileImageUrl: resolveProfileImageUrl(profile.profileImageUrl) || null,
    location: profile.location ?? "",
  };
}

export function buildUpdateMyProfileRequest(
  form: MyProfileFormValues,
): UpdateMyProfileRequest {
  return {
    nickname: form.nickname.trim(),
    bio: form.bio.trim(),
  };
}

export function buildUpdateMyLocationRequest(
  location: string,
): UpdateMyLocationRequest {
  return {
    location: location.trim(),
  };
}

export function toMyPageProfileViewModel(
  profile: MyProfileResponse,
): MyPageProfileViewModel {
  return {
    id: profile.id,
    nickname: profile.nickname || "\uc774\ub984 \uc5c6\uc74c",
    email: profile.email,
    bio: profile.bio ?? "",
    profileImageUrl: resolveProfileImageUrl(profile.profileImageUrl),
    location: profile.location || "\uc9c0\uc5ed \ubbf8\uc124\uc815",
    ratingLabel: `\ud3c9\uc810 ${profile.rating.toFixed(1)}`,
    warningLabel: `\uacbd\uace0 ${profile.warningCount}\ud68c`,
    biddingCount: profile.biddingCount,
    sellingCount: profile.sellingCount,
    wishlistCount: profile.wishlistCount,
  };
}

export async function fetchMyPageProfile() {
  return toMyPageProfileViewModel(await mypageApi.getMyProfile());
}

export async function fetchMyProfileForm() {
  return normalizeProfileForm(await mypageApi.getMyProfile());
}

export async function uploadMyProfileImage(file: File) {
  const uploadedImage = await mypageApi.uploadProfileImage(file);

  return {
    ...uploadedImage,
    profileImageUrl: resolveProfileImageUrl(uploadedImage.profileImageUrl),
  };
}

export async function saveMyProfile(form: MyProfileFormValues) {
  const updatedProfile = await mypageApi.updateMyProfile(
    buildUpdateMyProfileRequest(form),
  );
  return toMyPageProfileViewModel(updatedProfile);
}

export async function saveMyLocation(location: string) {
  return mypageApi.updateMyLocation(buildUpdateMyLocationRequest(location));
}

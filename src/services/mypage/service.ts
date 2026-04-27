import {
  createLocationFormFromSavedLocation,
  getLocationDisplayName,
} from "@/services/location/service";
import type { LocationFormValues } from "@/services/location/types";
import * as mypageApi from "@/services/mypage/api";
import type {
  MyProfileEditViewModel,
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
    name: "",
    nickname: "",
    bio: "",
    profileImageUrl: null,
    location: "",
  };
}

function normalizeOptionalText(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue === "" ? null : trimmedValue;
}

export function normalizeProfileForm(
  profile: MyProfileResponse,
): MyProfileFormValues {
  return {
    name: profile.name ?? "",
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
    name: normalizeOptionalText(form.name),
    nickname: form.nickname.trim(),
    bio: form.bio.trim(),
  };
}

export function buildUpdateMyLocationRequest(
  locationForm: LocationFormValues,
): UpdateMyLocationRequest {
  return {
    location: getLocationDisplayName(locationForm),
    postalCode: normalizeOptionalText(locationForm.postalCode),
    roadAddress: normalizeOptionalText(locationForm.roadAddress),
    jibunAddress: normalizeOptionalText(locationForm.jibunAddress),
    detailAddress: normalizeOptionalText(locationForm.detailAddress),
    latitude: locationForm.latitude,
    longitude: locationForm.longitude,
    locationSource: locationForm.locationSource,
  };
}

export function toMyProfileEditViewModel(
  profile: MyProfileResponse,
): MyProfileEditViewModel {
  return {
    form: normalizeProfileForm(profile),
    verified: profile.verified,
  };
}

export function toMyPageProfileViewModel(
  profile: MyProfileResponse,
): MyPageProfileViewModel {
  return {
    id: profile.id,
    name: profile.name || "",
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
  return toMyProfileEditViewModel(await mypageApi.getMyProfile());
}

export async function fetchMyLocationForm() {
  return createLocationFormFromSavedLocation(await mypageApi.getMyLocation());
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

export async function saveMyLocation(locationForm: LocationFormValues) {
  return mypageApi.updateMyLocation(buildUpdateMyLocationRequest(locationForm));
}

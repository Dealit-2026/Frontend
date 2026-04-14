import * as mypageApi from "@/services/mypage/api";
import type {
  MyPageProfileViewModel,
  MyProfileFormValues,
  MyProfileResponse,
  UpdateMyLocationRequest,
  UpdateMyProfileRequest,
} from "@/services/mypage/types";

const DEFAULT_PROFILE_IMAGE = "https://picsum.photos/seed/me/200/200";

// TODO(mypage-api): Remove fallback after the profile API is connected.
const fallbackProfile: MyProfileResponse = {
  id: 1,
  nickname: "\ube44\ub4dc\ub9c8\uc2a4\ud130",
  email: "bidmaster@example.com",
  bio: "\uc548\ub155\ud558\uc138\uc694. \uc88b\uc740 \uac70\ub798 \ubd80\ud0c1\ub4dc\ub824\uc694.",
  profileImageUrl: DEFAULT_PROFILE_IMAGE,
  location: "\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c",
  rating: 4.8,
  warningCount: 0,
  biddingCount: 3,
  sellingCount: 1,
  wishlistCount: 12,
};

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
    profileImageUrl: profile.profileImageUrl ?? null,
    location: profile.location ?? "",
  };
}

export function buildUpdateMyProfileRequest(
  form: MyProfileFormValues,
): UpdateMyProfileRequest {
  return {
    nickname: form.nickname.trim(),
    bio: form.bio.trim(),
    profileImageUrl: form.profileImageUrl,
    location: form.location.trim(),
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
    profileImageUrl: profile.profileImageUrl || DEFAULT_PROFILE_IMAGE,
    location: profile.location || "\uc9c0\uc5ed \ubbf8\uc124\uc815",
    ratingLabel: `\ud3c9\uc810 ${profile.rating.toFixed(1)}`,
    warningLabel: `\uacbd\uace0 ${profile.warningCount}\ud68c`,
    biddingCount: profile.biddingCount,
    sellingCount: profile.sellingCount,
    wishlistCount: profile.wishlistCount,
  };
}

export async function fetchMyPageProfile() {
  try {
    return toMyPageProfileViewModel(await mypageApi.getMyProfile());
  } catch {
    return toMyPageProfileViewModel(fallbackProfile);
  }
}

export async function fetchMyProfileForm() {
  try {
    return normalizeProfileForm(await mypageApi.getMyProfile());
  } catch {
    return normalizeProfileForm(fallbackProfile);
  }
}

export async function uploadMyProfileImage(file: File) {
  try {
    return await mypageApi.uploadProfileImage(file);
  } catch {
    return {
      profileImageUrl: URL.createObjectURL(file),
    };
  }
}

export async function saveMyProfile(form: MyProfileFormValues) {
  try {
    const updatedProfile = await mypageApi.updateMyProfile(
      buildUpdateMyProfileRequest(form),
    );
    return toMyPageProfileViewModel(updatedProfile);
  } catch {
    return toMyPageProfileViewModel(fallbackProfile);
  }
}

export async function saveMyLocation(location: string) {
  try {
    return await mypageApi.updateMyLocation(buildUpdateMyLocationRequest(location));
  } catch {
    return {
      location: fallbackProfile.location ?? "",
    };
  }
}

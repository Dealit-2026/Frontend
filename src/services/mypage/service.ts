import {
  createLocationFormFromSavedLocation,
  getLocationDisplayName,
} from "@/services/location/service";
import type { LocationFormValues } from "@/services/location/types";
import * as mypageApi from "@/services/mypage/api";
import { fetchSalesManagementCount } from "@/services/sales-management/service";
import type {
  AuctionEditDetailResponse,
  AuctionEditInitialData,
  MyProfileEditViewModel,
  MyPageProfileViewModel,
  MyProfileFormValues,
  MyProfileResponse,
  MySellingAuctionItemResponse,
  MySellingAuctionViewModel,
  UpdateMyLocationRequest,
  UpdateMyProfileRequest,
} from "@/services/mypage/types";
import { calculateBidUnit } from "@/services/auction/register/service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";
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

function resolveBackendImageUrl(imageUrl: string | null) {
  if (!imageUrl) {
    return null;
  }

  if (/^(data:|blob:)/.test(imageUrl)) {
    return imageUrl;
  }

  if (/^https?:\/\//.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  return imageUrl;
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
  sellingCount = profile.sellingCount,
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
    sellingCount,
    wishlistCount: profile.wishlistCount,
  };
}

function formatWon(value: number) {
  return `${value.toLocaleString()}\uc6d0`;
}

export function toMySellingAuctionViewModel(
  auction: MySellingAuctionItemResponse,
): MySellingAuctionViewModel {
  const displayPrice = auction.currentPrice || auction.startPrice;

  return {
    id: auction.productId,
    auctionId: auction.auctionId,
    name: auction.name,
    type: "auction",
    status: "\uacbd\ub9e4 \uc911",
    price: formatWon(displayPrice),
    img: resolveBackendImageUrl(auction.thumbnailUrl),
    description: auction.description,
    category: auction.categoryName,
    categoryId: auction.categoryId ?? null,
    bidders: auction.bidderCount,
    bidCount: auction.bidCount,
    canEdit: auction.canEdit,
    canDelete: auction.canDelete,
    startPrice: auction.startPrice,
    currentPrice: auction.currentPrice,
    minimumNextBidPrice: auction.minimumNextBidPrice,
    startAt: auction.startAt,
    endAt: auction.endAt,
  };
}

export function toAuctionEditInitialData(
  detail: AuctionEditDetailResponse,
): AuctionEditInitialData {
  const startPrice = String(detail.startPrice);

  return {
    productId: detail.productId,
    auctionId: detail.auctionId,
    type: "auction",
    name: detail.name,
    description: detail.description,
    categoryId: detail.categoryId,
    categoryName: detail.categoryName,
    location: detail.location,
    price: startPrice,
    startPrice,
    auctionDurationDays: detail.auctionDurationDays,
    images: detail.images.map((image) => ({
      imageId: image.imageId,
      imageUrl: resolveBackendImageUrl(image.imageUrl) ?? image.imageUrl,
      sortOrder: image.sortOrder,
    })),
    canEdit: detail.canEdit,
    auction: {
      startPrice,
      bidUnit: calculateBidUnit(startPrice),
      durationDays: detail.auctionDurationDays,
    },
  };
}

export async function fetchMyPageProfile() {
  const profile = await mypageApi.getMyProfile();

  try {
    return toMyPageProfileViewModel(profile, await fetchSalesManagementCount());
  } catch {
    return toMyPageProfileViewModel(profile);
  }
}

export async function fetchMySellingAuctions(page = 0, size = 20) {
  const response = await mypageApi.getMySellingAuctions(page, size);

  return {
    ...response,
    content: response.content.map(toMySellingAuctionViewModel),
  };
}

export async function fetchMySellingAuctionCount() {
  const response = await mypageApi.getMySellingAuctions(0, 1);
  return response.totalElements;
}

export async function fetchAuctionEditInitialData(auctionId: number) {
  return toAuctionEditInitialData(
    await mypageApi.getAuctionEditDetail(auctionId),
  );
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

export async function removeMySellingAuction(auctionId: number) {
  return mypageApi.deleteMySellingAuction(auctionId);
}

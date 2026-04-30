import type { LocationFormValues, LocationSource } from "@/services/location/types";

export interface MyProfileResponse {
  id: number;
  name: string | null;
  nickname: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  location: string | null;
  verified: boolean;
  rating: number;
  warningCount: number;
  biddingCount: number;
  sellingCount: number;
  wishlistCount: number;
}

export interface UpdateMyProfileRequest {
  name?: string | null;
  nickname: string;
  bio: string;
  profileImageUrl?: string | null;
}

export interface MyLocationResponse {
  location: string;
  postalCode: string | null;
  roadAddress: string | null;
  jibunAddress: string | null;
  detailAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  locationSource: LocationSource | null;
}

export interface UpdateMyLocationRequest {
  location: string;
  postalCode: string | null;
  roadAddress: string | null;
  jibunAddress: string | null;
  detailAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  locationSource: LocationSource | null;
}

export interface UpdateMyLocationResponse extends MyLocationResponse {}

export interface UploadProfileImageResponse {
  profileImageUrl: string;
}

export interface MyProfileFormValues {
  name: string;
  nickname: string;
  bio: string;
  profileImageUrl: string | null;
  location: string;
}

export interface MyProfileEditViewModel {
  form: MyProfileFormValues;
  verified: boolean;
}

export interface MyPageProfileViewModel {
  id: number;
  name: string;
  nickname: string;
  email: string;
  bio: string;
  profileImageUrl: string;
  location: string;
  ratingLabel: string;
  warningLabel: string;
  biddingCount: number;
  sellingCount: number;
  wishlistCount: number;
}

export interface MyProfileDraftValues extends MyProfileFormValues {
  locationDetails?: LocationFormValues | null;
}

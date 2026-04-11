export interface MyProfileResponse {
  id: number;
  nickname: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  location: string | null;
  rating: number;
  warningCount: number;
  biddingCount: number;
  sellingCount: number;
  wishlistCount: number;
}

export interface UpdateMyProfileRequest {
  nickname: string;
  bio: string;
  profileImageUrl: string | null;
  location: string;
}

export interface UpdateMyLocationRequest {
  location: string;
}

export interface UpdateMyLocationResponse {
  location: string;
}

export interface UploadProfileImageResponse {
  profileImageUrl: string;
}

export interface MyProfileFormValues {
  nickname: string;
  bio: string;
  profileImageUrl: string | null;
  location: string;
}

export interface MyPageProfileViewModel {
  id: number;
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

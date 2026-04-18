export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface CurrentMemberResponse {
  memberId: number;
  loginId: string;
  email: string;
  nickname: string;
}

export interface SignUpRequest {
  loginId: string;
  password: string;
  email: string;
  name: string | null;
}

export interface SignUpResponse {
  memberId: number;
  loginId: string;
  email: string;
  nickname: string;
  createdAt: string;
}

export interface LoginIdCheckResponse {
  loginId: string;
  available: boolean;
}

export interface NicknameCheckResponse {
  nickname: string;
  available: boolean;
}

export interface LoginFormValues {
  loginId: string;
  password: string;
}

export interface SignUpFormValues {
  loginId: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

export interface AuthResult<T> {
  data: T;
  message: string;
}

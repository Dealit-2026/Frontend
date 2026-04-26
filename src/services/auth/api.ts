import { ApiRequestError, getApiErrorMessage } from "@/services/apiError";
import type {
  ConfirmEmailVerificationRequest,
  ConfirmEmailVerificationResponse,
  CurrentMemberResponse,
  LoginIdCheckResponse,
  LoginRequest,
  LoginResponse,
  NicknameCheckResponse,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/services/auth/types";

export async function postLogin(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(response, "로그인에 실패했습니다."),
      response.status,
    );
  }

  return response.json();
}

export async function getCurrentMember(
  headers: Record<string, string> = {},
): Promise<CurrentMemberResponse> {
  const response = await fetch("/api/v1/auth/me", {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(response, "내 정보 조회에 실패했습니다."),
      response.status,
    );
  }

  return response.json();
}

export async function postSignUp(
  payload: SignUpRequest,
): Promise<SignUpResponse> {
  const response = await fetch("/api/v1/members/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(response, "회원가입에 실패했습니다."),
      response.status,
    );
  }

  return response.json();
}

export async function checkLoginId(
  loginId: string,
): Promise<LoginIdCheckResponse> {
  const params = new URLSearchParams({ loginId });
  const response = await fetch(`/api/v1/members/login-id/check?${params}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(response, "아이디 중복 확인에 실패했습니다."),
      response.status,
    );
  }

  return response.json();
}

export async function checkNickname(
  nickname: string,
): Promise<NicknameCheckResponse> {
  const params = new URLSearchParams({ nickname });
  const response = await fetch(`/api/v1/members/nickname/check?${params}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(response, "닉네임 중복 확인에 실패했습니다."),
      response.status,
    );
  }

  return response.json();
}

export async function sendEmailVerification(
  payload: SendEmailVerificationRequest,
  headers: Record<string, string> = {},
): Promise<SendEmailVerificationResponse> {
  const response = await fetch("/api/v1/email/verification/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(response, "이메일 인증 코드 발송에 실패했습니다."),
      response.status,
    );
  }

  return response.json();
}

export async function confirmEmailVerification(
  payload: ConfirmEmailVerificationRequest,
  headers: Record<string, string> = {},
): Promise<ConfirmEmailVerificationResponse> {
  const response = await fetch("/api/v1/email/verification/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiRequestError(
      await getApiErrorMessage(response, "이메일 인증 확인에 실패했습니다."),
      response.status,
    );
  }

  return response.json();
}

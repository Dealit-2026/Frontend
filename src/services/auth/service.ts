import { ApiRequestError } from "@/services/apiError";
import * as authApi from "@/services/auth/api";
import type {
  AuthResult,
  ConfirmEmailVerificationResponse,
  CurrentMemberResponse,
  LoginFormValues,
  LoginIdCheckResponse,
  LoginRequest,
  LoginResponse,
  NicknameCheckResponse,
  SendEmailVerificationResponse,
  SignUpFormValues,
  SignUpRequest,
  SignUpResponse,
} from "@/services/auth/types";

const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
const TOKEN_TYPE_STORAGE_KEY = "tokenType";
const LEGACY_ACCESS_TOKEN_STORAGE_KEY = "dealit_access_token";
const LEGACY_TOKEN_TYPE_STORAGE_KEY = "dealit_token_type";
const DEFAULT_TOKEN_TYPE = "Bearer";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeTokenType(tokenType: string | null | undefined) {
  const normalizedTokenType = tokenType?.trim();

  if (normalizedTokenType === "Bearer") {
    return normalizedTokenType;
  }

  return DEFAULT_TOKEN_TYPE;
}

function migrateLegacyTokenStorage(legacyAccessToken: string) {
  const nextTokenType = normalizeTokenType(
    localStorage.getItem(LEGACY_TOKEN_TYPE_STORAGE_KEY),
  );

  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, legacyAccessToken);
  localStorage.setItem(TOKEN_TYPE_STORAGE_KEY, nextTokenType);
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TOKEN_TYPE_STORAGE_KEY);
}

function getStoredTokenType() {
  if (!canUseStorage()) {
    return DEFAULT_TOKEN_TYPE;
  }

  const currentTokenType = localStorage.getItem(TOKEN_TYPE_STORAGE_KEY);

  if (currentTokenType) {
    return normalizeTokenType(currentTokenType);
  }

  const legacyTokenType = localStorage.getItem(LEGACY_TOKEN_TYPE_STORAGE_KEY);

  if (!legacyTokenType) {
    return DEFAULT_TOKEN_TYPE;
  }

  const nextTokenType = normalizeTokenType(legacyTokenType);
  localStorage.setItem(TOKEN_TYPE_STORAGE_KEY, nextTokenType);
  localStorage.removeItem(LEGACY_TOKEN_TYPE_STORAGE_KEY);

  return nextTokenType;
}

function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export function handleUnauthorizedAccess() {
  clearAuthToken();
  redirectToLogin();
}

export function saveAuthToken(loginResponse: LoginResponse) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, loginResponse.accessToken);
  localStorage.setItem(
    TOKEN_TYPE_STORAGE_KEY,
    normalizeTokenType(loginResponse.tokenType),
  );
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TOKEN_TYPE_STORAGE_KEY);
}

export function clearAuthToken() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TOKEN_TYPE_STORAGE_KEY);
}

export function getAuthToken() {
  if (!canUseStorage()) {
    return null;
  }

  const currentAccessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (currentAccessToken) {
    return currentAccessToken;
  }

  const legacyAccessToken = localStorage.getItem(
    LEGACY_ACCESS_TOKEN_STORAGE_KEY,
  );

  if (!legacyAccessToken) {
    return null;
  }

  migrateLegacyTokenStorage(legacyAccessToken);

  return legacyAccessToken;
}

export function getAuthorizationHeaders(): Record<string, string> {
  const accessToken = getAuthToken();

  if (!accessToken) {
    return {};
  }

  return {
    Authorization: `${getStoredTokenType()} ${accessToken}`,
  };
}

export function createDefaultLoginForm(): LoginFormValues {
  return {
    loginId: "",
    password: "",
  };
}

export function createDefaultSignUpForm(): SignUpFormValues {
  return {
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  };
}

export function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPasswordValid(password: string) {
  return password.length >= 8 && password.length <= 30;
}

export function isLoginFormValid(form: LoginFormValues) {
  return form.loginId.trim() !== "" && form.password.trim() !== "";
}

export function isSignUpFormValid(form: SignUpFormValues) {
  return (
    form.loginId.trim() !== "" &&
    isPasswordValid(form.password) &&
    form.password === form.confirmPassword &&
    isEmailValid(form.email)
  );
}

export function isSignUpAccountFormValid(form: SignUpFormValues) {
  return (
    form.loginId.trim() !== "" &&
    isPasswordValid(form.password) &&
    form.password === form.confirmPassword
  );
}

export function isNameValid(name: string) {
  return name.trim() !== "";
}

export function buildLoginRequest(form: LoginFormValues): LoginRequest {
  return {
    loginId: form.loginId.trim(),
    password: form.password,
  };
}

export function buildSignUpRequest(form: SignUpFormValues): SignUpRequest {
  const normalizedEmail = form.email.trim();

  return {
    loginId: form.loginId.trim(),
    password: form.password,
    email: normalizedEmail === "" ? null : normalizedEmail,
    name: form.name.trim() || null,
  };
}

async function loginAndStoreToken(form: LoginFormValues) {
  const loginResponse = await authApi.postLogin(buildLoginRequest(form));
  saveAuthToken(loginResponse);
  return loginResponse;
}

export async function login(
  form: LoginFormValues,
): Promise<AuthResult<LoginResponse>> {
  return {
    data: await loginAndStoreToken(form),
    message: "로그인되었습니다.",
  };
}

export async function fetchCurrentMember(): Promise<CurrentMemberResponse> {
  try {
    return await authApi.getCurrentMember(getAuthorizationHeaders());
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      handleUnauthorizedAccess();
    }

    throw error;
  }
}

export async function signUp(
  form: SignUpFormValues,
): Promise<AuthResult<SignUpResponse>> {
  const signUpResponse = await authApi.postSignUp(buildSignUpRequest(form));
  await loginAndStoreToken(form);

  return {
    data: signUpResponse,
    message: "회원가입 후 자동 로그인되었습니다.",
  };
}

export async function checkLoginIdAvailability(
  loginId: string,
): Promise<LoginIdCheckResponse> {
  return authApi.checkLoginId(loginId.trim());
}

export async function checkNicknameAvailability(
  nickname: string,
): Promise<NicknameCheckResponse> {
  return authApi.checkNickname(nickname.trim());
}

export async function requestEmailVerificationCode(
  email: string,
): Promise<SendEmailVerificationResponse> {
  return authApi.sendEmailVerification({
    email: email.trim(),
  }, getAuthorizationHeaders());
}

export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<ConfirmEmailVerificationResponse> {
  return authApi.confirmEmailVerification({
    email: email.trim(),
    code: code.trim(),
  }, getAuthorizationHeaders());
}

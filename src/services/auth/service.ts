import * as authApi from "@/services/auth/api";
import type {
  AuthResult,
  CurrentMemberResponse,
  LoginFormValues,
  LoginIdCheckResponse,
  LoginRequest,
  LoginResponse,
  NicknameCheckResponse,
  SignUpFormValues,
  SignUpRequest,
  SignUpResponse,
} from "@/services/auth/types";

const AUTH_TOKEN_STORAGE_KEY = "dealit_access_token";
const AUTH_TOKEN_TYPE_STORAGE_KEY = "dealit_token_type";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function saveAuthToken(loginResponse: LoginResponse) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, loginResponse.accessToken);
  localStorage.setItem(AUTH_TOKEN_TYPE_STORAGE_KEY, loginResponse.tokenType || "Bearer");
}

export function clearAuthToken() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_TOKEN_TYPE_STORAGE_KEY);
}

export function getAuthToken() {
  if (!canUseStorage()) {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getAuthorizationHeaders(): Record<string, string> {
  const accessToken = getAuthToken();

  if (!accessToken) {
    return {};
  }

  const tokenType = canUseStorage()
    ? localStorage.getItem(AUTH_TOKEN_TYPE_STORAGE_KEY) || "Bearer"
    : "Bearer";

  return {
    Authorization: `${tokenType} ${accessToken}`,
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

export function buildLoginRequest(form: LoginFormValues): LoginRequest {
  return {
    loginId: form.loginId.trim(),
    password: form.password,
  };
}

export function buildSignUpRequest(form: SignUpFormValues): SignUpRequest {
  return {
    loginId: form.loginId.trim(),
    password: form.password,
    email: form.email.trim(),
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
  return authApi.getCurrentMember(getAuthorizationHeaders());
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

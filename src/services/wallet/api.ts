import { ApiRequestError, getApiErrorDetail } from "@/services/apiError";
import {
  getAuthorizationHeaders,
  handleUnauthorizedAccess,
} from "@/services/auth/service";
import type {
  WalletAmountRequest,
  WalletLedgerListResponse,
  WalletResponse,
} from "@/services/wallet/types";

async function throwProtectedApiError(
  response: Response,
  fallbackMessage: string,
) {
  if (response.status === 401) {
    handleUnauthorizedAccess();
  }

  const detail = await getApiErrorDetail(response, fallbackMessage);

  throw new ApiRequestError(detail.message, response.status, detail.code);
}

export async function getWallet(): Promise<WalletResponse> {
  const response = await fetch("/api/v1/wallet", {
    method: "GET",
    headers: getAuthorizationHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "딜릿머니 잔액을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function getWalletLedgers(
  page = 0,
  size = 20,
): Promise<WalletLedgerListResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(
    `/api/v1/wallet/ledgers?${searchParams.toString()}`,
    {
      method: "GET",
      headers: getAuthorizationHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    await throwProtectedApiError(
      response,
      "딜릿머니 내역을 불러오지 못했습니다.",
    );
  }

  return response.json();
}

export async function chargeWallet(
  payload: WalletAmountRequest,
): Promise<WalletResponse> {
  return postWalletAmount(
    "/api/v1/wallet/charge",
    payload,
    "딜릿머니 충전에 실패했습니다.",
  );
}

export async function withdrawWallet(
  payload: WalletAmountRequest,
): Promise<WalletResponse> {
  return postWalletAmount(
    "/api/v1/wallet/withdraw",
    payload,
    "출금 신청에 실패했습니다.",
  );
}

async function postWalletAmount(
  url: string,
  payload: WalletAmountRequest,
  fallbackMessage: string,
): Promise<WalletResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwProtectedApiError(response, fallbackMessage);
  }

  return response.json();
}

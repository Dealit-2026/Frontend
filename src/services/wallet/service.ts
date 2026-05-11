import * as walletApi from "@/services/wallet/api";
import type {
  WalletLedgerResponse,
  WalletLedgerType,
  WalletResponse,
} from "@/services/wallet/types";

export interface WalletViewModel {
  walletId: number;
  balance: number;
  balanceLabel: string;
}

export interface WalletLedgerViewModel {
  id: number;
  type: WalletLedgerType;
  typeLabel: string;
  amount: number;
  amountLabel: string;
  balanceAfterLabel: string;
  description: string;
  createdAtLabel: string;
  isIncome: boolean;
}

export function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function parseWalletAmount(value: string) {
  const numericValue = Number(value.replace(/[^0-9]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function toWalletViewModel(wallet: WalletResponse): WalletViewModel {
  return {
    walletId: wallet.walletId,
    balance: wallet.balance,
    balanceLabel: formatWon(wallet.balance),
  };
}

export function toWalletLedgerViewModel(
  ledger: WalletLedgerResponse,
): WalletLedgerViewModel {
  const isIncome = ledger.amount > 0;

  return {
    id: ledger.ledgerId,
    type: ledger.type,
    typeLabel: getWalletLedgerTypeLabel(ledger.type),
    amount: ledger.amount,
    amountLabel: `${isIncome ? "+" : "-"}${formatWon(Math.abs(ledger.amount))}`,
    balanceAfterLabel: formatWon(ledger.balanceAfter),
    description: ledger.description,
    createdAtLabel: formatWalletDate(ledger.createdAt),
    isIncome,
  };
}

export async function fetchWallet() {
  return toWalletViewModel(await walletApi.getWallet());
}

export async function fetchWalletLedgers() {
  const response = await walletApi.getWalletLedgers();
  return response.content.map(toWalletLedgerViewModel);
}

export async function chargeDealitMoney(amount: number) {
  return toWalletViewModel(await walletApi.chargeWallet({ amount }));
}

export async function withdrawDealitMoney(amount: number) {
  return toWalletViewModel(await walletApi.withdrawWallet({ amount }));
}

function getWalletLedgerTypeLabel(type: WalletLedgerType) {
  switch (type) {
    case "TEMP_CHARGE":
      return "충전";
    case "REFUND":
      return "환불";
    case "WITHDRAWAL":
      return "출금";
    case "AUCTION_RESERVE":
      return "경매 예치";
    case "AUCTION_REFUND":
      return "경매 환불";
    case "AUCTION_SETTLEMENT":
      return "판매대금 정산";
    default:
      return "내역";
  }
}

function formatWalletDate(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

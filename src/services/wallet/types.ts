export type WalletLedgerType =
  | "TEMP_CHARGE"
  | "REFUND"
  | "WITHDRAWAL"
  | "AUCTION_RESERVE"
  | "AUCTION_REFUND";

export interface WalletResponse {
  walletId: number;
  memberId: number;
  balance: number;
}

export interface WalletAmountRequest {
  amount: number;
}

export interface WalletLedgerResponse {
  ledgerId: number;
  type: WalletLedgerType;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string | null;
}

export interface WalletLedgerListResponse {
  content: WalletLedgerResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

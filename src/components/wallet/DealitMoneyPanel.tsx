"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Landmark, Plus, ReceiptText, Wallet, X } from "lucide-react";

import { getErrorMessage } from "@/services/apiError";
import {
  chargeDealitMoney,
  fetchWallet,
  fetchWalletLedgers,
  formatWon,
  parseWalletAmount,
  withdrawDealitMoney,
} from "@/services/wallet/service";
import type {
  WalletLedgerViewModel,
  WalletViewModel,
} from "@/services/wallet/service";

type WalletModal = "charge" | "history" | "withdraw" | null;

const QUICK_AMOUNTS = [10000, 30000, 50000, 100000];

export default function DealitMoneyPanel() {
  const [wallet, setWallet] = useState<WalletViewModel | null>(null);
  const [ledgers, setLedgers] = useState<WalletLedgerViewModel[]>([]);
  const [modal, setModal] = useState<WalletModal>(null);
  const [amountInput, setAmountInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchWallet()
      .then((nextWallet) => {
        if (!ignore) {
          setWallet(nextWallet);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(
            getErrorMessage(error, "딜릿머니 잔액을 불러오지 못했습니다."),
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (modal !== "history") {
      return;
    }

    let ignore = false;
    setIsHistoryLoading(true);
    fetchWalletLedgers()
      .then((nextLedgers) => {
        if (!ignore) {
          setLedgers(nextLedgers);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(
            getErrorMessage(error, "딜릿머니 내역을 불러오지 못했습니다."),
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsHistoryLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [modal]);

  const openAmountModal = (nextModal: "charge" | "withdraw") => {
    setAmountInput("");
    setErrorMessage("");
    setModal(nextModal);
  };

  const closeModal = () => {
    setModal(null);
    setAmountInput("");
    setErrorMessage("");
  };

  const handleSubmitAmount = async () => {
    const amount = parseWalletAmount(amountInput);

    if (amount <= 0) {
      setErrorMessage("금액을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const nextWallet =
        modal === "charge"
          ? await chargeDealitMoney(amount)
          : await withdrawDealitMoney(amount);
      setWallet(nextWallet);
      closeModal();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          modal === "charge"
            ? "딜릿머니 충전에 실패했습니다."
            : "출금 신청에 실패했습니다.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl bg-black px-5 py-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Wallet size={16} />
            <span>딜릿머니</span>
          </div>
          <div className="text-2xl font-bold tracking-normal">
            {isLoading ? "불러오는 중" : wallet?.balanceLabel ?? "0원"}
          </div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          DEALIT
        </div>
      </div>

      {errorMessage && !modal && (
        <div className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-xs text-red-100">
          {errorMessage}
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MoneyActionButton
          icon={<Plus size={18} />}
          label="충전"
          onClick={() => openAmountModal("charge")}
        />
        <MoneyActionButton
          icon={<ReceiptText size={18} />}
          label="내역"
          onClick={() => setModal("history")}
        />
        <MoneyActionButton
          icon={<Landmark size={18} />}
          label="내 계좌로 옮기기"
          onClick={() => openAmountModal("withdraw")}
        />
      </div>

      {modal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-6 text-black backdrop-blur-sm">
          <div className="w-full rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{getModalTitle(modal)}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            {modal === "history" ? (
              <WalletHistoryContent
                ledgers={ledgers}
                isLoading={isHistoryLoading}
              />
            ) : (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setAmountInput(String(amount))}
                      className="h-11 rounded-lg bg-gray-100 text-sm font-bold hover:bg-gray-200"
                    >
                      {formatWon(amount)}
                    </button>
                  ))}
                </div>
                <input
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                  inputMode="numeric"
                  placeholder="금액 직접 입력"
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-base font-semibold outline-none focus:border-black"
                />
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">
                    {errorMessage}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSubmitAmount}
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-lg bg-black text-sm font-bold text-white disabled:bg-gray-300"
                >
                  {isSubmitting ? "처리 중" : getSubmitLabel(modal)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function MoneyActionButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-16 flex-col items-center justify-center gap-1 rounded-xl bg-white/10 px-1 text-[11px] font-bold text-white transition-colors hover:bg-white/15"
    >
      {icon}
      <span className="leading-tight">{label}</span>
    </button>
  );
}

function WalletHistoryContent({
  ledgers,
  isLoading,
}: {
  ledgers: WalletLedgerViewModel[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div className="py-12 text-center text-sm text-gray-400">불러오는 중</div>;
  }

  if (ledgers.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        딜릿머니 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-4 max-h-80 overflow-y-auto">
      {ledgers.map((ledger) => (
        <div
          key={ledger.id}
          className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0"
        >
          <div className="min-w-0">
            <div className="font-semibold">{ledger.typeLabel}</div>
            <div className="mt-1 truncate text-xs text-gray-400">
              {ledger.createdAtLabel || ledger.description}
            </div>
          </div>
          <div className="text-right">
            <div
              className={`font-bold ${
                ledger.isIncome ? "text-green-600" : "text-gray-900"
              }`}
            >
              {ledger.amountLabel}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              잔액 {ledger.balanceAfterLabel}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getModalTitle(modal: Exclude<WalletModal, null>) {
  switch (modal) {
    case "charge":
      return "딜릿머니 충전";
    case "withdraw":
      return "내 계좌로 옮기기";
    case "history":
      return "딜릿머니 내역";
  }
}

function getSubmitLabel(modal: Exclude<WalletModal, null>) {
  return modal === "charge" ? "충전하기" : "출금 신청";
}

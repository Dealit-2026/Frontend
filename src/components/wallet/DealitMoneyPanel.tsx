"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Plus,
  ReceiptText,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
  const [historyMonth, setHistoryMonth] = useState(() => createMonthState());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

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

  const openHistory = () => {
    setErrorMessage("");
    setHistoryMonth(createMonthState());
    setModal("history");
  };

  const closeModal = () => {
    setModal(null);
    setAmountInput("");
    setErrorMessage("");
    setIsMonthPickerOpen(false);
  };

  const addQuickAmount = (amount: number) => {
    setAmountInput(String(parseWalletAmount(amountInput) + amount));
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
          onClick={openHistory}
        />
        <MoneyActionButton
          icon={<Landmark size={18} />}
          label="내 계좌로 옮기기"
          onClick={() => openAmountModal("withdraw")}
        />
      </div>

      {modal === "history" && (
        <WalletHistoryScreen
          ledgers={ledgers}
          isLoading={isHistoryLoading}
          selectedMonth={historyMonth}
          isMonthPickerOpen={isMonthPickerOpen}
          onClose={closeModal}
          onPreviousMonth={() => setHistoryMonth(shiftMonth(historyMonth, -1))}
          onNextMonth={() => setHistoryMonth(shiftMonth(historyMonth, 1))}
          onOpenMonthPicker={() => setIsMonthPickerOpen(true)}
          onCloseMonthPicker={() => setIsMonthPickerOpen(false)}
          onSelectMonth={(nextMonth) => {
            setHistoryMonth(nextMonth);
            setIsMonthPickerOpen(false);
          }}
        />
      )}

      {modal && modal !== "history" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 text-black backdrop-blur-sm">
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

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => addQuickAmount(amount)}
                    className="h-11 rounded-lg bg-gray-100 text-sm font-bold hover:bg-gray-200"
                  >
                    {formatWon(amount)}
                  </button>
                ))}
              </div>
              {modal === "withdraw" && (
                <button
                  type="button"
                  onClick={() => setAmountInput(String(wallet?.balance ?? 0))}
                  className="text-sm font-bold text-gray-700 underline underline-offset-4"
                >
                  전액 입력
                </button>
              )}
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

type MonthState = {
  year: number;
  month: number;
};

function WalletHistoryScreen({
  ledgers,
  isLoading,
  selectedMonth,
  isMonthPickerOpen,
  onClose,
  onPreviousMonth,
  onNextMonth,
  onOpenMonthPicker,
  onCloseMonthPicker,
  onSelectMonth,
}: {
  ledgers: WalletLedgerViewModel[];
  isLoading: boolean;
  selectedMonth: MonthState;
  isMonthPickerOpen: boolean;
  onClose: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onOpenMonthPicker: () => void;
  onCloseMonthPicker: () => void;
  onSelectMonth: (month: MonthState) => void;
}) {
  const filteredLedgers = ledgers.filter((ledger) =>
    isSameMonth(ledger.createdAt, selectedMonth),
  );

  return (
    <div className="fixed inset-0 z-50 bg-white text-black">
      <div className="flex h-full flex-col px-5 pb-6 pt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-normal">사용 내역</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
            aria-label="닫기"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onPreviousMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50"
            aria-label="이전 달"
          >
            <ChevronLeft size={26} strokeWidth={1.9} />
          </button>
          <button
            type="button"
            onClick={onOpenMonthPicker}
            className="flex items-center gap-1 rounded-full px-4 py-2 text-xl font-black tracking-normal hover:bg-gray-50"
          >
            {selectedMonth.month}월
            <ChevronDown size={18} fill="currentColor" strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50"
            aria-label="다음 달"
          >
            <ChevronRight size={26} strokeWidth={1.9} />
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-gray-400">
              불러오는 중
            </div>
          ) : filteredLedgers.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              사용 내역이 없습니다.
            </div>
          ) : (
            filteredLedgers.map((ledger) => (
              <div
                key={ledger.id}
                className="flex items-start justify-between border-b border-gray-100 py-4 last:border-b-0"
              >
                <div className="min-w-0 pr-4">
                  <div className="text-base font-bold leading-tight text-gray-900">
                    {ledger.typeLabel}
                  </div>
                  <div className="mt-1.5 text-sm font-semibold leading-tight text-gray-400">
                    {ledger.createdAtLabel}
                  </div>
                </div>
                <div
                  className={`whitespace-nowrap pt-0.5 text-right text-base font-black ${
                    ledger.isIncome ? "text-[#F64257]" : "text-gray-950"
                  }`}
                >
                  {ledger.amountLabel}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMonthPickerOpen && (
          <MonthPickerSheet
            selectedMonth={selectedMonth}
            onClose={onCloseMonthPicker}
            onConfirm={onSelectMonth}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MonthPickerSheet({
  selectedMonth,
  onClose,
  onConfirm,
}: {
  selectedMonth: MonthState;
  onClose: () => void;
  onConfirm: (month: MonthState) => void;
}) {
  const [draftMonth, setDraftMonth] = useState(selectedMonth);

  useEffect(() => {
    setDraftMonth(selectedMonth);
  }, [selectedMonth]);

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-end bg-black/35"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="조회 기간 설정 닫기"
        onClick={onClose}
      />
      <motion.div
        className="relative w-full rounded-t-3xl bg-white px-5 pb-6 pt-8 shadow-2xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 360, mass: 0.8 }}
      >
        <h3 className="text-xl font-black tracking-normal">
          조회 기간 설정
        </h3>
        <p className="mt-2 text-sm font-semibold text-gray-500">
          사용 내역을 월 별로 조회할 수 있어요.
        </p>

        <div className="mt-8 grid grid-cols-2 items-center gap-4 px-8 text-center">
          <MonthPickerColumn
            values={[
              draftMonth.year - 1,
              draftMonth.year,
              draftMonth.year + 1,
            ]}
            selectedValue={draftMonth.year}
            label={(value) => `${value}년`}
            onSelect={(year) => setDraftMonth((prev) => ({ ...prev, year }))}
          />
          <MonthPickerColumn
            values={[
              normalizeMonth(draftMonth.month - 1),
              draftMonth.month,
              normalizeMonth(draftMonth.month + 1),
            ]}
            selectedValue={draftMonth.month}
            label={(value) => `${value}월`}
            onSelect={(month) => setDraftMonth((prev) => ({ ...prev, month }))}
          />
        </div>

        <button
          type="button"
          onClick={() => onConfirm(draftMonth)}
          className="mt-10 h-13 w-full rounded-xl bg-[#F64257] text-base font-black text-white shadow-sm"
        >
          확인
        </button>
      </motion.div>
    </motion.div>
  );
}

function MonthPickerColumn({
  values,
  selectedValue,
  label,
  onSelect,
}: {
  values: number[];
  selectedValue: number;
  label: (value: number) => string;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={`block w-full rounded-xl py-2 text-lg font-black tracking-normal transition-colors ${
            value === selectedValue ? "text-gray-950" : "text-gray-200"
          }`}
        >
          {label(value)}
        </button>
      ))}
    </div>
  );
}

function createMonthState(date = new Date()): MonthState {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

function shiftMonth(monthState: MonthState, offset: number): MonthState {
  const date = new Date(monthState.year, monthState.month - 1 + offset, 1);
  return createMonthState(date);
}

function normalizeMonth(month: number) {
  if (month < 1) {
    return 12;
  }
  if (month > 12) {
    return 1;
  }
  return month;
}

function isSameMonth(date: Date | null, monthState: MonthState) {
  return (
    date !== null &&
    date.getFullYear() === monthState.year &&
    date.getMonth() + 1 === monthState.month
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

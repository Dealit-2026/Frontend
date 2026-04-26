"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

import ResultModal from "@/components/common/modal/ResultModal";
import { getErrorMessage } from "@/services/apiError";
import {
  checkLoginIdAvailability,
  isPasswordValid,
  isSignUpAccountFormValid,
} from "@/services/auth/service";
import {
  getSignUpDraft,
  setSignUpDraft,
} from "@/services/auth/signUpDraft";
import type { SignUpFormValues } from "@/services/auth/types";

type CheckStatus = "idle" | "available" | "duplicate";

export default function SignupScreen({
  onBack,
  onNext,
}: {
  showToast?: (msg: string) => void;
  onBack: () => void;
  onNext: () => void;
  key?: string;
}) {
  const [formData, setFormData] = useState<SignUpFormValues>(() =>
    getSignUpDraft(),
  );
  const [loginIdCheckStatus, setLoginIdCheckStatus] =
    useState<CheckStatus>("idle");
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const isFormValid = isSignUpAccountFormValid(formData);
  const canSubmit = isFormValid && loginIdCheckStatus === "available";

  const openResultModal = (title: string, message: string) => {
    setResultModal({ isOpen: true, title, message });
  };

  const updateDraft = (nextForm: Partial<SignUpFormValues>) => {
    setFormData((currentForm) => {
      const mergedForm = { ...currentForm, ...nextForm };
      setSignUpDraft(mergedForm);
      return mergedForm;
    });
  };

  const handleLoginIdCheck = async () => {
    if (!formData.loginId.trim()) {
      openResultModal("아이디 확인", "아이디를 입력해 주세요.");
      return;
    }

    try {
      const result = await checkLoginIdAvailability(formData.loginId);
      setLoginIdCheckStatus(result.available ? "available" : "duplicate");
      openResultModal(
        "아이디 중복 확인",
        result.available
          ? "사용 가능한 아이디입니다."
          : "중복된 아이디입니다.",
      );
    } catch (error) {
      setLoginIdCheckStatus("idle");
      openResultModal(
        "아이디 중복 확인",
        getErrorMessage(error, "아이디 중복 확인에 실패했습니다."),
      );
    }
  };

  const handleNext = () => {
    if (!canSubmit) {
      return;
    }

    onNext();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex-1 flex flex-col"
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center font-bold text-lg mr-10">
            회원가입
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">아이디</label>
            <div className="flex space-x-2 w-full">
              <input
                type="text"
                value={formData.loginId}
                onChange={(event) => {
                  updateDraft({ loginId: event.target.value });
                  setLoginIdCheckStatus("idle");
                }}
                placeholder="아이디 입력"
                className="flex-1 min-w-0 h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
              />
              <button
                type="button"
                onClick={handleLoginIdCheck}
                className="whitespace-nowrap px-4 h-12 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shrink-0"
              >
                중복확인
              </button>
            </div>
            {loginIdCheckStatus === "available" && (
              <p className="text-[10px] text-green-600">
                사용 가능한 아이디입니다.
              </p>
            )}
            {loginIdCheckStatus === "duplicate" && (
              <p className="text-[10px] text-red-500">중복된 아이디입니다.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">비밀번호</label>
            <input
              type="password"
              value={formData.password}
              onChange={(event) => updateDraft({ password: event.target.value })}
              placeholder="8자 이상 입력"
              className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
            />
            <p className="text-[10px] text-gray-400">
              영문, 숫자, 특수문자 조합
            </p>
            {formData.password && !isPasswordValid(formData.password) && (
              <p className="text-[10px] text-red-500">
                비밀번호는 8자 이상 30자 이하여야 합니다.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">비밀번호 확인</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(event) =>
                updateDraft({ confirmPassword: event.target.value })
              }
              placeholder="비밀번호 재입력"
              className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
            />
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-[10px] text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!canSubmit}
            className={`w-full h-14 font-bold rounded-xl transition-colors ${
              canSubmit
                ? "bg-[#98E446] hover:bg-[#87d335] text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음
          </button>
        </div>
      </motion.div>

      <ResultModal
        isOpen={resultModal.isOpen}
        title={resultModal.title}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, isOpen: false })}
      />
    </>
  );
}

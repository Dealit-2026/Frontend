"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

import ResultModal from "@/components/common/modal/ResultModal";
import { getErrorMessage } from "@/services/apiError";
import { clearMyProfileDraft } from "@/services/mypage/profileDraft";
import { fetchMyProfileForm, saveMyProfile } from "@/services/mypage/service";
import {
  fetchCurrentMember,
  isEmailValid,
  isNameValid,
  isSignUpFormValid,
  requestEmailVerificationCode,
  signUp,
  verifyEmailCode,
} from "@/services/auth/service";
import {
  clearSignUpDraft,
  getSignUpDraft,
  updateSignUpDraft,
} from "@/services/auth/signUpDraft";

function formatRemainingTime(remainingSeconds: number) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

interface EmailAuthScreenProps {
  showToast: (msg: string) => void;
  onBack: () => void;
  onComplete: () => void;
  onSkip: () => void;
  mode?: "signup" | "profile";
}

export default function EmailAuthScreen({
  showToast,
  onBack,
  onComplete,
  onSkip,
  mode = "signup",
}: EmailAuthScreenProps) {
  const isProfileMode = mode === "profile";
  const [formData, setFormData] = useState(() => getSignUpDraft());
  const [isProfileEmailLocked, setIsProfileEmailLocked] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "sent" | "verified"
  >("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isConfirmingCode, setIsConfirmingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const openResultModal = (title: string, message: string) => {
    setResultModal({ isOpen: true, title, message });
  };

  useEffect(() => {
    if (!isProfileMode) {
      return;
    }

    let ignore = false;

    Promise.all([fetchCurrentMember(), fetchMyProfileForm()])
      .then(([member, profileEditData]) => {
        if (ignore) {
          return;
        }

        const hasProfileEmail = Boolean(member.email?.trim());
        setIsProfileEmailLocked(hasProfileEmail);
        setFormData((currentForm) => ({
          ...currentForm,
          email: member.email ?? "",
          name: profileEditData.form.name || currentForm.name,
        }));
      })
      .catch((error) => {
        if (!ignore) {
          openResultModal(
            "이메일 인증",
            getErrorMessage(error, "현재 계정 정보를 불러오지 못했습니다."),
          );
        }
      });

    return () => {
      ignore = true;
    };
  }, [isProfileMode]);

  useEffect(() => {
    if (verificationStatus !== "sent" || remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((currentValue) => {
        if (currentValue <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [verificationStatus, remainingSeconds]);

  useEffect(() => {
    if (verificationStatus === "sent" && remainingSeconds === 0) {
      setVerificationStatus("idle");
      setVerificationCode("");
    }
  }, [verificationStatus, remainingSeconds]);

  const timerLabel = useMemo(
    () => formatRemainingTime(remainingSeconds),
    [remainingSeconds],
  );

  const canSubmit =
    verificationStatus === "verified" &&
    isEmailValid(formData.email) &&
    isNameValid(formData.name) &&
    (isProfileMode || isSignUpFormValid(formData));

  const updateForm = (
    nextValues: Partial<ReturnType<typeof getSignUpDraft>>,
  ) => {
    setFormData((currentForm) => {
      const nextForm = {
        ...currentForm,
        ...nextValues,
      };

      if (!isProfileMode) {
        updateSignUpDraft(nextValues);
      }

      return nextForm;
    });
  };

  const handleEmailChange = (email: string) => {
    updateForm({ email });
    setVerificationStatus("idle");
    setVerificationCode("");
    setRemainingSeconds(0);
  };

  const handleSendCode = async () => {
    if (!isEmailValid(formData.email)) {
      openResultModal("이메일 인증", "올바른 이메일 형식으로 입력해 주세요.");
      return;
    }

    setIsSendingCode(true);

    try {
      const response = await requestEmailVerificationCode(formData.email);
      setVerificationStatus("sent");
      setVerificationCode("");
      setRemainingSeconds(response.expiresInSeconds);
      showToast("인증 코드가 이메일로 전송되었습니다.");
    } catch (error) {
      openResultModal(
        "이메일 인증",
        getErrorMessage(error, "인증 코드 발송에 실패했습니다."),
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleConfirmCode = async () => {
    if (verificationCode.trim().length !== 6) {
      openResultModal("이메일 인증", "6자리 인증 코드를 입력해 주세요.");
      return;
    }

    if (remainingSeconds <= 0) {
      openResultModal(
        "이메일 인증",
        "인증 코드가 만료되었습니다. 다시 요청해 주세요.",
      );
      return;
    }

    setIsConfirmingCode(true);

    try {
      const response = await verifyEmailCode(formData.email, verificationCode);

      if (response.verified) {
        setVerificationStatus("verified");
        setRemainingSeconds(0);
        showToast("이메일 인증이 완료되었습니다.");
      }
    } catch (error) {
      openResultModal(
        "이메일 인증",
        getErrorMessage(error, "인증 코드 확인에 실패했습니다."),
      );
    } finally {
      setIsConfirmingCode(false);
    }
  };

  const handleFinish = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isProfileMode) {
        const profileEditData = await fetchMyProfileForm();
        await saveMyProfile({
          ...profileEditData.form,
          name: formData.name,
        });
        clearMyProfileDraft();
        showToast("이메일 인증과 이름 저장이 완료되었습니다.");
      } else {
        const result = await signUp(formData);
        clearSignUpDraft();
        showToast(result.message);
      }

      onComplete();
    } catch (error) {
      openResultModal(
        isProfileMode ? "이메일 인증 실패" : "회원가입 실패",
        getErrorMessage(
          error,
          isProfileMode
            ? "이메일 인증 또는 이름 저장에 실패했습니다."
            : "회원가입에 실패했습니다.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailReadonly = isProfileMode && isProfileEmailLocked;

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
          <h1 className="flex-1 text-center font-bold text-lg">이메일 인증</h1>
          {isProfileMode ? (
            <div className="w-10" />
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="text-sm font-medium text-gray-400 px-2"
            >
              건너뛰기
            </button>
          )}
        </div>

        <div className="flex-1 px-8 py-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 shadow-inner"
          >
            <Check size={40} className="text-[#141414]" strokeWidth={3} />
          </motion.div>

          <div className="mb-10 space-y-2 text-center">
            <h2 className="text-xl font-bold">이메일 인증이 필요해요</h2>
            <p className="text-sm text-gray-400">
              {isProfileMode ? (
                <>
                  현재 계정의 이메일 인증을 완료하면
                  <br />
                  이름 저장과 인증 상태가 함께 반영돼요.
                </>
              ) : (
                <>
                  안전한 가입 진행을 위해
                  <br />
                  이메일 인증을 완료해 주세요.
                </>
              )}
            </p>
          </div>

          <div className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => updateForm({ name: event.target.value })}
                placeholder="이름 입력"
                className="h-12 w-full rounded-lg bg-gray-100 px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">이메일</label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => handleEmailChange(event.target.value)}
                placeholder="example@email.com"
                className="h-12 w-full rounded-lg bg-gray-100 px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
                readOnly={isEmailReadonly}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!isEmailValid(formData.email) || isSendingCode}
                className={`mt-2 h-12 w-full rounded-lg border text-sm font-medium transition-colors ${
                  isEmailValid(formData.email) && !isSendingCode
                    ? "border-[#98E446] text-[#98E446] hover:bg-[#98E446]/5"
                    : "border-gray-200 text-gray-300"
                }`}
              >
                {isSendingCode
                  ? "전송 중"
                  : verificationStatus === "sent" ||
                      verificationStatus === "verified"
                    ? "인증코드 재전송"
                    : "인증코드 받기"}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">인증코드</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(event) =>
                    setVerificationCode(
                      event.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                    )
                  }
                  placeholder="6자리 입력"
                  className="h-12 flex-1 rounded-lg bg-gray-100 px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
                  maxLength={6}
                />
                <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-gray-100 font-bold text-[#F64257]">
                  {verificationStatus === "verified" ? "완료" : timerLabel}
                </div>
              </div>
              <button
                type="button"
                onClick={handleConfirmCode}
                disabled={
                  verificationStatus !== "sent" ||
                  verificationCode.trim().length !== 6 ||
                  isConfirmingCode
                }
                className={`h-12 w-full rounded-lg border text-sm font-medium transition-colors ${
                  verificationStatus === "sent" &&
                  verificationCode.trim().length === 6 &&
                  !isConfirmingCode
                    ? "border-[#98E446] text-[#98E446] hover:bg-[#98E446]/5"
                    : "border-gray-200 text-gray-300"
                }`}
              >
                {isConfirmingCode ? "확인 중" : "이메일 인증 확인"}
              </button>
              {verificationStatus === "verified" && (
                <p className="text-[10px] text-green-600">
                  이메일 인증이 완료되었습니다.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={handleFinish}
            disabled={!canSubmit || isSubmitting}
            className={`h-14 w-full rounded-xl font-bold transition-colors ${
              canSubmit && !isSubmitting
                ? "bg-[#98E446] text-black hover:bg-[#87d335]"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {isSubmitting ? "처리 중" : isProfileMode ? "인증 완료" : "확인"}
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

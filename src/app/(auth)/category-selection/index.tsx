"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import { updateSignUpDraft } from "@/services/auth/signUpDraft";
import {
  fetchInterestCategoryOptions,
  fetchMyInterestCategoryIds,
  saveMyInterestCategories,
} from "@/services/interest-category/service";
import type { InterestCategoryOptionViewModel } from "@/services/interest-category/types";

export default function CategorySelectionScreen({
  onBack,
  onComplete,
  mode = "signup",
  showToast,
}: {
  onBack: () => void;
  onComplete: () => void | Promise<void>;
  mode?: "signup" | "edit";
  showToast?: (message: string) => void;
  onNavigateLogin?: () => void;
  showSkip?: boolean;
  key?: string;
}) {
  const [categories, setCategories] = useState<
    InterestCategoryOptionViewModel[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setErrorMessage("");

    const loadCategories: Promise<[InterestCategoryOptionViewModel[], number[]]> =
      mode === "edit"
        ? Promise.all([
            fetchInterestCategoryOptions(),
            fetchMyInterestCategoryIds(),
          ])
        : fetchInterestCategoryOptions().then((nextCategories) => [
            nextCategories,
            [] as number[],
          ]);

    loadCategories
      .then(([nextCategories, myCategoryIds]) => {
        if (!ignore) {
          setCategories(nextCategories);
          setSelectedIds(myCategoryIds);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setCategories([]);
          setErrorMessage(
            getErrorMessage(
              error,
              "관심 카테고리를 불러오지 못했습니다.",
            ),
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
  }, [mode]);

  const selectableCategories = categories.filter((category) => category.fromApi);

  const toggleCategory = (category: InterestCategoryOptionViewModel) => {
    if (!category.fromApi) {
      return;
    }

    setSelectedIds((currentIds) =>
      currentIds.includes(category.categoryId)
        ? currentIds.filter((categoryId) => categoryId !== category.categoryId)
        : [...currentIds, category.categoryId],
    );
  };

  const handleComplete = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (mode === "edit") {
        const savedIds = await saveMyInterestCategories(selectedIds);
        setSelectedIds(savedIds);
        showToast?.("관심 카테고리 설정이 저장되었습니다.");
      } else {
        updateSignUpDraft({
          interestCategoryIds: selectedIds,
        });
      }

      await onComplete();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "관심 카테고리 저장에 실패했습니다."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-50">
        <button
          type="button"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">
          관심 카테고리 설정
        </h1>
      </div>

      <div className="flex-1 px-6 py-8 space-y-8 overflow-y-auto no-scrollbar">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            관심 카테고리 설정
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            관심 있는 카테고리를 선택해 주세요.
            <br />
            선택한 카테고리는 회원가입 정보에 함께 저장됩니다.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm font-medium text-gray-400">
            관심 카테고리를 불러오는 중입니다.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {categories.map((category) => {
              const isSelected = selectedIds.includes(category.categoryId);
              const isDisabled = !category.fromApi;

              return (
                <button
                  key={`${category.fromApi ? "api" : "mock"}-${category.categoryId}`}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  disabled={isDisabled}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-[#98E446]/10 border-[#98E446] ring-1 ring-[#98E446]"
                      : "bg-gray-50 border-transparent text-gray-500"
                  } ${isDisabled ? "opacity-45 cursor-not-allowed" : ""}`}
                >
                  <span className="text-xl mb-1">{category.icon}</span>
                  <span
                    className={`text-[9px] font-bold ${
                      isSelected ? "text-[#98E446]" : "text-gray-600"
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-50">
        <button
          type="button"
          onClick={handleComplete}
          disabled={isLoading || isSubmitting || selectableCategories.length === 0}
          className="w-full h-14 bg-[#98E446] hover:bg-[#87d335] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#98E446]/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "저장 중..."
            : selectedIds.length > 0
              ? mode === "edit"
                ? `${selectedIds.length}개 선택 저장`
                : `${selectedIds.length}개 선택 완료`
              : "선택 없이 계속하기"}
        </button>
      </div>
    </motion.div>
  );
}

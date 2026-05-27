"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  ArrowLeft,
} from "lucide-react";
import { motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import { fetchSearchCategoryOptionsByMode } from "@/services/product/search/service";
import type { SearchCategoryViewModel } from "@/services/product/search/types";

export interface SelectedSearchCategory {
  id: number;
  name: string;
}

export default function SearchScreen({
  onBack,
  onCategorySelect,
  onSearchDetailClick,
  onRecentClick,
  mode = "regular",
}: {
  onBack: () => void;
  onCategorySelect: (category: SelectedSearchCategory) => void;
  onSearchDetailClick: () => void;
  onRecentClick: () => void;
  mode?: "regular" | "auction";
  themeColor?: string;
  key?: string;
}) {
  const [categories, setCategories] = useState<SearchCategoryViewModel[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryLoadError, setCategoryLoadError] = useState("");

  useEffect(() => {
    let ignore = false;

    setIsLoadingCategories(true);
    setCategoryLoadError("");

    fetchSearchCategoryOptionsByMode(mode)
      .then((nextCategories) => {
        if (!ignore) {
          setCategories(nextCategories);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setCategories([]);
          setCategoryLoadError(
            getErrorMessage(error, "검색 카테고리를 불러오지 못했습니다."),
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoadingCategories(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [mode]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full min-h-0 flex-col bg-white"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-50 justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center space-x-1">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">탐색</h1>
        </div>
        <button
          onClick={onRecentClick}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-800 transition-colors px-2"
        >
          <span className="text-sm font-medium">최근 본 상품</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div
          className="h-12 bg-gray-50 rounded-xl flex items-center px-4 space-x-3 cursor-pointer"
          onClick={onSearchDetailClick}
        >
          <Search size={20} className="text-gray-400" />
          <span className="text-gray-400 text-sm">검색어를 입력해 주세요.</span>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">카테고리</h3>

          {isLoadingCategories ? (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[76px] rounded-2xl bg-gray-50 animate-pulse"
                />
              ))}
            </div>
          ) : categoryLoadError ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
              {categoryLoadError}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={`${category.fromApi ? "api" : "mock"}-${category.categoryId}`}
                  type="button"
                  onClick={() =>
                    onCategorySelect({
                      id: category.categoryId,
                      name: category.name,
                    })
                  }
                  disabled={!category.enabled}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all duration-200 ${
                    category.enabled
                      ? "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
                      : "bg-gray-50 border-transparent text-gray-500 opacity-45 cursor-not-allowed"
                  }`}
                >
                  <span className="text-xl mb-1">{category.icon}</span>
                  <span className="text-[9px] font-bold text-gray-600">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

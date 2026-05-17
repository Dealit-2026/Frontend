"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Clock, Search, TrendingUp, X } from "lucide-react";
import { motion } from "motion/react";

import { fetchPopularSearchKeywords } from "@/services/product/search/service";
import type {
  PopularSearchKeywordViewModel,
  UnifiedSearchResultType,
} from "@/services/product/search/types";
import type { SelectedSearchCategory } from "../index";

const RECENT_SEARCH_STORAGE_KEY = "dealit_recent_searches";
const RECENT_SEARCH_LIMIT = 10;

function readRecentSearches() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(RECENT_SEARCH_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(searches: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RECENT_SEARCH_STORAGE_KEY,
    JSON.stringify(searches),
  );
}

export default function SearchDetailScreen({
  onBack,
  onSearch,
  initialCategory,
  searchResultType = null,
}: {
  onBack: () => void;
  onSearch: (keyword: string) => void;
  themeColor: string;
  initialCategory?: SelectedSearchCategory | null;
  searchResultType?: UnifiedSearchResultType | null;
  key?: string;
}) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<
    PopularSearchKeywordViewModel[]
  >([]);
  const [isLoadingPopularSearches, setIsLoadingPopularSearches] =
    useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<SelectedSearchCategory | null>(initialCategory || null);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  useEffect(() => {
    let isMounted = true;

    setIsLoadingPopularSearches(true);
    fetchPopularSearchKeywords(10, searchResultType)
      .then((keywords) => {
        if (isMounted) {
          setPopularSearches(keywords);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch popular searches", error);
        if (isMounted) {
          setPopularSearches([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingPopularSearches(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchResultType]);

  const saveRecentSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    const nextSearches = [
      trimmedKeyword,
      ...recentSearches.filter(
        (recentKeyword) => recentKeyword !== trimmedKeyword,
      ),
    ].slice(0, RECENT_SEARCH_LIMIT);

    setRecentSearches(nextSearches);
    writeRecentSearches(nextSearches);
  };

  const runSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    saveRecentSearch(trimmedKeyword);
    onSearch(trimmedKeyword);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      runSearch(inputValue);
    }
  };

  const removeRecentSearch = (keywordToRemove: string) => {
    const nextSearches = recentSearches.filter(
      (keyword) => keyword !== keywordToRemove,
    );

    setRecentSearches(nextSearches);
    writeRecentSearches(nextSearches);
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    writeRecentSearches([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-50 space-x-3 sticky top-0 bg-white z-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 h-10 bg-gray-50 rounded-xl flex items-center px-3 space-x-2 overflow-hidden">
          <Search size={18} className="text-gray-400 shrink-0" />
          <div className="flex items-center flex-1 min-w-0 space-x-2">
            {activeCategory && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 rounded-full shrink-0">
                <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">
                  {activeCategory.name}
                </span>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="p-0.5 hover:bg-gray-100 rounded-full"
                  aria-label="카테고리 해제"
                >
                  <X size={10} className="text-gray-400" />
                </button>
              </div>
            )}
            <input
              type="text"
              placeholder="검색어를 입력해 주세요."
              className="flex-1 bg-transparent outline-none text-sm min-w-[50px]"
              value={inputValue}
              autoFocus
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center space-x-1.5">
              <Clock size={16} />
              <span>최근 검색어</span>
            </h3>
            {recentSearches.length > 0 && (
              <button
                onClick={clearAllRecentSearches}
                className="text-xs text-gray-400 font-medium"
              >
                전체 삭제
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.length > 0 ? (
              recentSearches.map((keyword) => (
                <div
                  key={keyword}
                  onClick={() => runSearch(keyword)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-gray-50 rounded-full group cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm text-gray-700">{keyword}</span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      removeRecentSearch(keyword);
                    }}
                    className="p-0.5"
                    aria-label={`${keyword} 삭제`}
                  >
                    <X
                      size={14}
                      className="text-gray-400 group-hover:text-gray-600"
                    />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">최근 검색어가 없습니다.</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center space-x-1.5">
              <TrendingUp size={16} />
              <span>인기 검색어</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {isLoadingPopularSearches ? (
              <p className="text-sm text-gray-400">
                인기 검색어를 불러오는 중입니다.
              </p>
            ) : popularSearches.length > 0 ? (
              popularSearches.map((item) => (
                <div
                  key={`${item.rank}-${item.keyword}`}
                  onClick={() => runSearch(item.keyword)}
                  className="flex items-center space-x-4 group cursor-pointer"
                >
                  <span className="font-bold text-base w-4 text-center text-orange-500">
                    {item.rank}
                  </span>
                  <span className="text-sm font-medium text-gray-800 flex-1">
                    {item.keyword}
                  </span>
                  {item.hot && <span className="text-sm">🔥</span>}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                인기 검색어가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Check,
  ChevronRight,
  User,
  Camera,
  Search,
  Home,
  PlusCircle,
  MessageCircle,
  Heart,
  Bell,
  Filter,
  Settings,
  MoreVertical,
  Send,
  Star,
  Clock,
  ArrowUpRight,
  X,
  Trash2,
  Eye,
  Image as ImageIcon,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  Menu,
  ShoppingBag,
  Store,
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Screen, Tab } from "../../../types/index";
import { ExploreIcon } from "../../../components/common/ExploreIcon";

export default function SearchScreen({
  onBack,
  onSearch,
  onSearchDetailClick,
  onRecentClick,
  themeColor,
}: {
  onBack: () => void;
  onSearch: (keyword: string) => void;
  onSearchDetailClick: () => void;
  onRecentClick: () => void;
  themeColor: string;
  key?: string;
}) {
  const categories = [
    { name: "디지털기기", icon: "💻" },
    { name: "생활가전", icon: "📺" },
    { name: "가구/인테리어", icon: "🪑" },
    { name: "유아동", icon: "👶" },
    { name: "생활/가공식품", icon: "🍎" },
    { name: "유아도서", icon: "📚" },
    { name: "스포츠/레저", icon: "⚽" },
    { name: "여성잡화", icon: "👜" },
    { name: "여성의류", icon: "👗" },
    { name: "남성패션/잡화", icon: "👔" },
    { name: "게임/취미", icon: "🎮" },
    { name: "뷰티/미용", icon: "💄" },
    { name: "반려동물용품", icon: "🐶" },
    { name: "도서/티켓/음반", icon: "💿" },
    { name: "식물", icon: "🌿" },
    { name: "기타", icon: "📦" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-full flex flex-col bg-white"
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

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div
          className="h-12 bg-gray-50 rounded-xl flex items-center px-4 space-x-3 cursor-pointer"
          onClick={onSearchDetailClick}
        >
          <Search size={20} className="text-gray-400" />
          <span className="text-gray-400 text-sm">검색어를 입력해 주세요.</span>
        </div>

        {/* Category Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">카테고리</h3>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onSearch(cat.name)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
              >
                <span className="text-2xl mb-2">{cat.icon}</span>
                <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

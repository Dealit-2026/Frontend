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

export default function ChatRoomScreen({
  chatId,
  onBack,
  onProductClick,
  themeColor,
}: {
  chatId: number | null;
  onBack: () => void;
  onProductClick: (id: number) => void;
  themeColor: string;
  key?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-full flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">이경석</h1>
      </div>

      {/* Product Info at Top */}
      <div
        className="p-4 border-b border-gray-50 flex items-center space-x-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => onProductClick(1)}
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img
            src="https://picsum.photos/seed/p1/100/100"
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">
            아이폰 14 Pro 256GB 딥퍼플
          </p>
          <p className="text-[10px] text-green-600 font-bold">거래 중</p>
        </div>
        <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold shrink-0">
          상세보기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 space-y-6">
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] text-gray-400">
            2026년 3월 22일
          </span>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-100"></div>
          <div className="space-y-1">
            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[240px]">
              <p className="text-sm">네, 직거래 가능합니다. 어디서 뵐까요?</p>
            </div>
            <span className="text-[10px] text-gray-400">오후 12:45</span>
          </div>
        </div>

        <div className="flex items-start justify-end space-x-3">
          <div className="space-y-1 text-right">
            <div className="bg-black text-white rounded-2xl rounded-tr-none p-3 max-w-[240px]">
              <p className="text-sm">강남역 10번 출구 어떠신가요?</p>
            </div>
            <span className="text-[10px] text-gray-400">오후 12:46</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center space-x-3">
        <button className="p-2 bg-gray-50 rounded-xl">
          <PlusCircle size={24} className="text-gray-400" />
        </button>
        <div className="flex-1 h-12 bg-gray-50 rounded-2xl px-4 flex items-center">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <button className="p-3 bg-black text-white rounded-xl">
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
}

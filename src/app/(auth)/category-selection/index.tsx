"use client";
import React, { useState, useEffect } from 'react';
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
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Screen, Tab } from '../../../types/index';
import { ExploreIcon } from '../../../components/common/ExploreIcon';

export default function CategorySelectionScreen({ onBack, onComplete, onNavigateLogin, showSkip = false }: { onBack: () => void; onComplete: () => void; onNavigateLogin?: () => void; showSkip?: boolean; key?: string }) {
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
    { name: "기타", icon: "📦" }
  ];
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    if (selected.includes(cat)) {
      setSelected(selected.filter(c => c !== cat));
    } else {
      setSelected([...selected, cat]);
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
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">관심 카테고리 설정</h1>
      </div>

      <div className="flex-1 px-6 py-8 space-y-8 overflow-y-auto no-scrollbar">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">관심 카테고리 설정</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            관심 있는 카테고리를 선택해 주세요.<br />
            맞춤 상품을 먼저 보여드려요.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => toggleCategory(cat.name)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all duration-200 ${
                selected.includes(cat.name) 
                  ? 'bg-[#98E446]/10 border-[#98E446] ring-1 ring-[#98E446]' 
                  : 'bg-gray-50 border-transparent text-gray-500'
              }`}
            >
              <span className="text-xl mb-1">{cat.icon}</span>
              <span className={`text-[9px] font-bold ${selected.includes(cat.name) ? 'text-[#98E446]' : 'text-gray-600'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-50 space-y-3">
        <button 
          onClick={onComplete}
          disabled={selected.length === 0}
          className={`w-full h-14 font-bold rounded-xl transition-all ${
            selected.length > 0 
              ? 'bg-[#98E446] hover:bg-[#87d335] text-black shadow-lg shadow-[#98E446]/20' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selected.length > 0 ? `${selected.length}개 선택 완료` : '카테고리를 선택해주세요'}
        </button>
        
        {showSkip && (
          <div className="flex space-x-3">
            <button 
              onClick={onComplete}
              className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-xl transition-colors"
            >
              건너뛰기 (메인으로)
            </button>
            {onNavigateLogin && (
              <button 
                onClick={onNavigateLogin}
                className="flex-1 h-12 border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium rounded-xl transition-colors"
              >
                로그인으로
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

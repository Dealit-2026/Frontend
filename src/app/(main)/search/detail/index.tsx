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

import { Screen, Tab } from '../../../../types/index';
import { ExploreIcon } from '../../../../components/common/ExploreIcon';

export default function SearchDetailScreen({ onBack, onSearch, themeColor, initialCategory }: { onBack: () => void; onSearch: (keyword: string) => void; themeColor: string; initialCategory?: string | null; key?: string }) {
  const [recentSearches, setRecentSearches] = useState(['아이폰', '노트북', '가방']);
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const keyword = inputValue.trim();
      const finalSearch = activeCategory ? `${activeCategory} ${keyword}` : keyword;
      if (!recentSearches.includes(finalSearch)) {
        setRecentSearches([finalSearch, ...recentSearches]);
      }
      onSearch(finalSearch);
    }
  };

  const removeRecentSearch = (keywordToRemove: string) => {
    setRecentSearches(recentSearches.filter(k => k !== keywordToRemove));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col bg-white"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-50 space-x-3 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 h-10 bg-gray-50 rounded-xl flex items-center px-3 space-x-2 overflow-hidden">
          <Search size={18} className="text-gray-400 shrink-0" />
          <div className="flex items-center flex-1 min-w-0 space-x-2">
            {activeCategory && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 rounded-full shrink-0">
                <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{activeCategory}</span>
                <button onClick={() => setActiveCategory(null)} className="p-0.5 hover:bg-gray-100 rounded-full">
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
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Recent Searches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center space-x-1.5">
              <Clock size={16} />
              <span>최근 검색어</span>
            </h3>
            <button onClick={clearAllRecentSearches} className="text-xs text-gray-400 font-medium">전체 삭제</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((keyword) => (
              <div 
                key={keyword} 
                onClick={() => onSearch(keyword)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gray-50 rounded-full group cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm text-gray-700">{keyword}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeRecentSearch(keyword); }}
                  className="p-0.5"
                >
                  <X size={14} className="text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center space-x-1.5">
              <TrendingUp size={16} />
              <span>인기 검색어</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {[
              { rank: 1, keyword: '에어팟', hot: true },
              { rank: 2, keyword: '갤럭시', hot: true },
              { rank: 3, keyword: '명품가방', hot: true },
              { rank: 4, keyword: '운동화', hot: false },
              { rank: 5, keyword: '카메라', hot: false },
            ].map((item) => (
              <div key={item.rank} onClick={() => onSearch(item.keyword)} className="flex items-center space-x-4 group cursor-pointer">
                <span className="font-bold text-base w-4 text-center text-orange-500">{item.rank}</span>
                <span className="text-sm font-medium text-gray-800 flex-1">{item.keyword}</span>
                {item.hot && <span className="text-sm">🔥</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

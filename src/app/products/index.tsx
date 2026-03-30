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

import { Screen, Tab } from '../../types/index';
import { ExploreIcon } from '../../components/common/ExploreIcon';
import ProductListItem from '../../components/product/ProductListItem';

export default function ProductListScreen({ listType, categoryName, onBack, onProductClick, onSearchClick, themeColor, mode }: { listType: 'all' | 'closing_soon' | 'recent'; categoryName: string | null; onBack: () => void; onProductClick: (id: number) => void; onSearchClick: () => void; themeColor: string; mode: 'regular' | 'auction'; key?: string | number }) {
  const title = categoryName || (listType === 'all' ? '전체 목록' : (listType === 'recent' ? '최근 본 상품' : (mode === 'regular' ? '핫한 상품' : '마감 임박 상품')));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-14 flex items-center px-4 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-50 justify-between">
        <div className="flex items-center space-x-1">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">
            {title}
          </h1>
        </div>
        <button onClick={onSearchClick} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Search size={22} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductListItem key={i} i={i} mode={mode} themeColor={themeColor} onProductClick={onProductClick} />
        ))}
      </div>
    </motion.div>
  );
}

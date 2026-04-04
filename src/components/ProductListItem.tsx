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

import { Screen, Tab } from '../types';
import { ExploreIcon } from '../components/ExploreIcon';
import ConfirmModal from './ConfirmModal';

export default function ProductListItem({ 
  i, 
  mode, 
  themeColor, 
  onProductClick, 
  initialLiked = false,
  onUnlike
}: { 
  i: number; 
  mode: 'regular' | 'auction'; 
  themeColor: string; 
  onProductClick: (id: number) => void; 
  initialLiked?: boolean;
  onUnlike?: () => void;
  key?: string | number 
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked && onUnlike) {
      setShowConfirm(true);
    } else {
      setIsLiked(!isLiked);
    }
  };

  return (
    <>
      <div onClick={() => onProductClick(i + 10)} className="flex items-center space-x-4 p-3 bg-white border border-gray-50 rounded-2xl hover:shadow-md transition-all cursor-pointer group">
        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative">
          <img src={`https://picsum.photos/seed/hot${i}${mode}/200/200`} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-sm truncate text-gray-800">맥북 에어 M2</h4>
            <button 
              onClick={handleLikeClick}
              className="p-1"
            >
              <Heart 
                size={16} 
                fill={isLiked ? "#FF3B30" : "none"} 
                color={isLiked ? "#FF3B30" : "#D1D5DB"} 
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 font-medium">{mode === 'auction' ? '현재가' : '판매가'} <span className="text-sm font-bold text-black ml-1">₩1,200,000</span></p>
          <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-medium">
            <div className="flex items-center space-x-1">
              <Heart size={10} />
              <span>132</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={10} />
              <span>12</span>
            </div>
            {mode === 'auction' && (
              <div className="flex items-center space-x-1 font-bold" style={{ color: themeColor }}>
                <Clock size={10} />
                <span>2시간 35분 남음</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          if (onUnlike) onUnlike();
          setIsLiked(false);
        }}
        message="해당 상품을 찜 목록에서 제외하시겠습니까?"
        themeColor={themeColor}
      />
    </>
  );
}

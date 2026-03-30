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

export default function ProductCard({ i, mode, themeColor, onProductClick }: { i: number; mode: 'regular' | 'auction'; themeColor: string; onProductClick: (id: number) => void; key?: string | number }) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div onClick={() => onProductClick(i)} className="w-[140px] shrink-0 space-y-3 cursor-pointer group">
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative">
        <img src={`https://picsum.photos/seed/pop${i}${mode}/300/300`} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
        >
          <Heart size={14} className={isLiked ? "text-[#FF3B30] fill-[#FF3B30]" : "text-gray-400"} />
        </button>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold truncate text-gray-800">아이폰 14 Pro</h4>
        <p className="font-bold text-base text-black">₩850,000</p>
        <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-medium">
          {mode === 'auction' ? (
            <div className="flex items-center space-x-1">
              <User size={10} />
              <span>입찰 23</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Heart size={10} />
                <span>132</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={10} />
                <span>12</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

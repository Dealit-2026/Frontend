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

import { Screen, Tab } from '../../../../../types/index';
import { ExploreIcon } from '../../../../../components/common/ExploreIcon';

export default function WriteReviewScreen({ onBack, onComplete, themeColor }: { onBack: () => void; onComplete: () => void; themeColor: string; key?: string }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white h-full relative"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">리뷰 작성</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
            <img src="https://picsum.photos/seed/p1/200/200" alt="Product" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">비드마스터님과의 거래</p>
            <p className="font-bold">아이폰 14 Pro 256GB</p>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h2 className="font-bold text-lg">거래는 어떠셨나요?</h2>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-2 transition-transform active:scale-90"
              >
                <Star
                  size={40}
                  className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold">상세한 후기를 남겨주세요</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품의 상태, 판매자의 매너 등 거래에 대한 솔직한 평가를 남겨주세요. (최소 10자 이상)"
            className="w-full h-40 p-4 bg-gray-50 border border-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onComplete}
          disabled={content.length < 10}
          className={`w-full h-14 font-bold rounded-2xl transition-colors ${
            content.length >= 10 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
          }`}
        >
          리뷰 등록하기
        </button>
      </div>
    </motion.div>
  );
}

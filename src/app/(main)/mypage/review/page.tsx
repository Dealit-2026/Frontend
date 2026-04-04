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

export default function ReviewScreen({ onBack, themeColor }: { onBack: () => void; themeColor: string; key?: string }) {
  const [mode, setMode] = useState<'written' | 'received'>('written');

  const reviews = [
    { 
      id: 1, 
      name: '아이폰 14 Pro', 
      type: 'regular', 
      category: 'written', 
      status: '거래 완료', 
      img: 'https://picsum.photos/seed/p1/200/200',
      content: '상태가 아주 좋아요! 포장도 꼼꼼하게 해주셔서 안전하게 잘 받았습니다. 감사합니다.',
      rating: 5,
      date: '2024.03.20'
    },
    { 
      id: 2, 
      name: '맥북 에어 M2', 
      type: 'auction', 
      category: 'received', 
      status: '거래 완료', 
      img: 'https://picsum.photos/seed/p2/200/200',
      content: '매너가 아주 좋으신 분입니다. 기분 좋은 거래였어요!',
      rating: 5,
      date: '2024.03.18',
      author: '낙찰자A'
    },
    { 
      id: 3, 
      name: '에어팟 프로', 
      type: 'regular', 
      category: 'written', 
      status: '거래 완료', 
      img: 'https://picsum.photos/seed/p3/200/200',
      content: '배송이 조금 늦었지만 상품은 만족합니다.',
      rating: 4,
      date: '2024.03.15'
    },
    { 
      id: 4, 
      name: '갤럭시 워치 6', 
      type: 'auction', 
      category: 'received', 
      status: '거래 완료', 
      img: 'https://picsum.photos/seed/p4/200/200',
      content: '빠른 입금 감사합니다. 잘 사용하세요!',
      rating: 5,
      date: '2024.03.10',
      author: '입찰자B'
    },
  ].filter(r => r.category === mode);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">리뷰 관리</h1>
      </div>

      <div className="flex p-4 space-x-2">
        <button 
          onClick={() => setMode('written')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'written' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}
        >
          구매한 항목
        </button>
        <button 
          onClick={() => setMode('received')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'received' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}
        >
          판매한 항목
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 space-y-4">
        {reviews.length > 0 ? (
          reviews.map((item) => (
            <div key={item.id} className="p-5 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                    {item.type === 'regular' ? '일반' : '경매'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-50 text-green-600 rounded">
                    {item.status}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">{item.date}</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate mb-1">{item.name}</h4>
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.content}
                </p>
                {item.author && (
                  <p className="text-[11px] text-gray-400 mt-2 text-right">- {item.author}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageCircle size={48} className="mb-4 opacity-20" />
            <p className="text-sm">작성된 리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

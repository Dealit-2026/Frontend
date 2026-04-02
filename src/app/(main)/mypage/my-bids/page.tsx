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

export default function MyBidsScreen({ onBack, onProductClick, themeColor }: { onBack: () => void; onProductClick: (id: number) => void; themeColor: string; key?: string }) {
  const [bids, setBids] = useState([
    { 
      id: 101, 
      name: '빈티지 필름 카메라', 
      seller: '카메라덕후', 
      currentBid: '45,000원', 
      myBid: '45,000원', 
      timeLeft: '2시간 15분', 
      img: 'https://picsum.photos/seed/cam1/200/200',
      status: 'highest' // 내가 최고 입찰자
    },
    { 
      id: 102, 
      name: '나이키 조던 1 하이', 
      seller: '슈즈컬렉터', 
      currentBid: '280,000원', 
      myBid: '250,000원', 
      timeLeft: '45분', 
      img: 'https://picsum.photos/seed/shoe1/200/200',
      status: 'outbid' // 상위 입찰자 발생
    },
    { 
      id: 103, 
      name: '레트로 게임기', 
      seller: '레트로매니아', 
      currentBid: '12,000원', 
      myBid: '12,000원', 
      timeLeft: '1일 전', 
      img: 'https://picsum.photos/seed/game1/200/200',
      status: 'highest'
    }
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col relative bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">입찰 중인 상품</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
        {bids.length > 0 ? (
          bids.map((bid) => (
            <button 
              key={bid.id} 
              onClick={() => onProductClick(bid.id)}
              className="w-full p-4 bg-white border border-gray-100 rounded-2xl flex items-center space-x-4 hover:border-gray-200 transition-all text-left"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                <img src={bid.img} alt={bid.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">{bid.seller}</span>
                  <div className="flex items-center space-x-1 text-[10px] font-bold">
                    <Clock size={10} className="text-gray-400" />
                    <span className={bid.timeLeft.includes('분') ? 'text-red-500' : 'text-gray-400'}>
                      {bid.timeLeft}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-sm truncate">{bid.name}</h4>
                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400">현재가</p>
                    <p className="font-black text-sm">{bid.currentBid}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-[10px] text-gray-400">내 입찰가</p>
                    <p className={`font-black text-sm ${bid.status === 'highest' ? 'text-blue-600' : 'text-red-500'}`}>
                      {bid.myBid}
                    </p>
                  </div>
                </div>
                <div className={`mt-2 py-1.5 rounded-lg text-[10px] font-bold text-center ${
                  bid.status === 'highest' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-red-50 text-red-500'
                }`}>
                  {bid.status === 'highest' ? '최고 입찰자입니다' : '상위 입찰자가 있습니다'}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
            <TrendingUp size={48} className="opacity-20" />
            <p className="text-sm font-medium">입찰 중인 상품이 없습니다</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

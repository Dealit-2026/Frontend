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
import ProductCard from '../../../components/product/ProductCard';
import ProductListItem from '../../../components/product/ProductListItem';

export default function HomeScreen({ 
  onProductClick, 
  onProductListClick,
  onNotificationClick,
  onCategoryResetClick,
  onSearchClick,
  onWishlistClick,
  mode,
  onModeChange,
  onTabChange
}: { 
  onProductClick: (id: number) => void; 
  onProductListClick: (type: 'all' | 'closing_soon' | 'recent', category?: string) => void;
  onNotificationClick: () => void;
  onCategoryResetClick: () => void;
  onSearchClick: () => void;
  onWishlistClick: () => void;
  mode: 'regular' | 'auction';
  onModeChange: (mode: 'regular' | 'auction') => void;
  onTabChange: (tab: Tab) => void;
}) {
  const themeColor = mode === 'regular' ? '#98E446' : '#F64257';
  const logoUrl = mode === 'regular' 
    ? 'https://i.ibb.co/FLydFL1L/2026-03-22-201249.png' 
    : 'https://i.ibb.co/6RrSfG14/image.png';

  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = mode === 'regular' ? [
    {
      title: '봄맞이 일반 판매',
      subtitle: '최대 70% 할인 기회',
      image: 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?q=80&w=2061&auto=format&fit=crop',
    },
    {
      title: '새로운 상품 업데이트',
      subtitle: '매일 만나는 새로운 보물들',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    },
    {
      title: '안전한 직거래',
      subtitle: '우리 동네에서 만나는 믿을 수 있는 이웃',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop',
    }
  ] : [
    {
      title: '프리미엄 옥션',
      subtitle: '희귀템을 내 손에',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop',
    },
    {
      title: '실시간 인기경매',
      subtitle: '지금 핫한 경매상품',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
    },
    {
      title: '마감 임박 경매',
      subtitle: '놓치면 후회하는 마지막 기회',
      image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=2070&auto=format&fit=crop',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-16 flex items-center px-4 justify-between bg-white z-30 shrink-0 border-b border-gray-50">
        <div className="flex items-center space-x-2">
          <img src={logoUrl} alt="Deal it" className="h-6 object-contain" referrerPolicy="no-referrer" />
          
          {/* Toggle Switch */}
          <div 
            onClick={() => onModeChange(mode === 'regular' ? 'auction' : 'regular')}
            className="h-7 bg-gray-100 rounded-full relative cursor-pointer p-1 transition-colors flex items-center"
            style={{ width: '110px' }}
          >
            <motion.div 
              animate={{ x: mode === 'regular' ? 0 : 48 }}
              className="h-5 rounded-full shadow-sm flex items-center justify-center px-2"
              style={{ backgroundColor: themeColor, width: '54px' }}
            >
              <span 
                className="text-[9px] font-black whitespace-nowrap transition-colors duration-300"
                style={{ color: mode === 'regular' ? '#000000' : '#FFFFFF' }}
              >
                {mode === 'regular' ? '판매상품' : 'Dealit'}
              </span>
            </motion.div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button onClick={onSearchClick} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"><Search size={22} /></button>
          <button onClick={onNotificationClick} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button onClick={onWishlistClick} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
            <Heart size={22} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Banner Section */}
        <div className="relative h-48 overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div 
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${banners[currentBanner].image})` }}
              >
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/20"></div>
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{ backgroundColor: themeColor }}
                ></div>
                
                {/* Banner Text */}
                <div className="absolute inset-0 px-6 flex flex-col justify-center text-white z-10">
                  <motion.h2 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold leading-tight drop-shadow-md"
                  >
                    {banners[currentBanner].title}
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-medium opacity-90 drop-shadow-sm"
                  >
                    {banners[currentBanner].subtitle}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Pagination Indicator */}
          <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold flex items-center space-x-1 z-20">
            <span>{currentBanner + 1} / {banners.length}</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white p-6 space-y-10 relative z-20">
          {/* Section 1: Real-time Popular */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center space-x-1.5">
                <span className="text-xl">🔥</span>
                <span>{mode === 'regular' ? '실시간 인기' : '실시간 인기 경매'}</span>
              </h3>
              <button 
                onClick={() => onProductListClick('all')}
                className="text-xs text-gray-400 flex items-center hover:text-gray-600 transition-colors"
              >
                전체목록보기 <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
              {[1, 2, 3, 4].map((i) => (
                <ProductCard key={i} i={i} mode={mode} themeColor={themeColor} onProductClick={onProductClick} />
              ))}
            </div>
          </div>

          {/* Section 2: Hot Items / Closing Soon */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center space-x-1.5">
                <span className="text-xl">{mode === 'regular' ? '⏰' : '⌛'}</span>
                <span>{mode === 'regular' ? '핫한 상품' : '마감 임박'}</span>
              </h3>
              <button 
                onClick={() => onProductListClick('closing_soon')}
                className="text-xs text-gray-400 flex items-center hover:text-gray-600 transition-colors"
              >
                더보기 <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <ProductListItem key={i} i={i} mode={mode} themeColor={themeColor} onProductClick={onProductClick} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

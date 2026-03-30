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
import ProductListItem from '../../../components/product/ProductListItem';

export default function WishlistScreen({ onBack, onProductClick, themeColor }: { onBack: () => void; onProductClick: (id: number) => void; themeColor: string; key?: string }) {
  const [wishlistItems, setWishlistItems] = useState([1, 2, 3]);

  const handleUnlike = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-50 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">찜목록</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((i) => (
            <ProductListItem 
              key={i} 
              i={i} 
              mode="regular" 
              themeColor={themeColor} 
              onProductClick={onProductClick} 
              initialLiked={true}
              onUnlike={() => handleUnlike(i)}
            />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4 h-[400px]">
            <Heart size={48} className="opacity-20" />
            <p>찜한 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

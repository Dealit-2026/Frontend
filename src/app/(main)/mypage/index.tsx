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

export default function MyPageScreen({ 
  themeColor, 
  onReviewClick, 
  onSalesManagementClick,
  onNotificationSettingsClick,
  onProfileEditClick,
  onLocationEditClick,
  onWishlistClick,
  onCategoryResetClick,
  onAccountManagementClick,
  onPurchaseHistoryClick,
  onSalesHistoryClick,
  onBiddingClick,
  userLocation,
  onLogout
}: { 
  themeColor: string;
  onReviewClick: () => void;
  onSalesManagementClick: () => void;
  onNotificationSettingsClick: () => void;
  onProfileEditClick: () => void;
  onLocationEditClick: () => void;
  onWishlistClick: () => void;
  onCategoryResetClick: () => void;
  onAccountManagementClick: () => void;
  onPurchaseHistoryClick: () => void;
  onSalesHistoryClick: () => void;
  onBiddingClick: () => void;
  userLocation: string;
  onLogout: () => void;
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="flex flex-col h-full relative">
      <div className="h-16 flex items-center px-6 justify-between">
        <h1 className="text-xl font-bold">마이페이지</h1>
        <button 
          onClick={onNotificationSettingsClick}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          <Settings size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-8">
        {/* Profile */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
            <img src="https://picsum.photos/seed/me/200/200" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">비드마스터</span>
              <button 
                onClick={onProfileEditClick}
                className="px-2.5 py-1 bg-gray-100 rounded text-[11px] text-black font-medium hover:bg-gray-200 transition-colors"
              >
                수정
              </button>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-600">평점 4.8</span>
              </div>
              <span className="w-px h-2 bg-gray-300"></span>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="font-medium text-gray-600">경고 0회</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">
              {userLocation}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-2xl p-6 flex justify-around items-center">
          <button onClick={onBiddingClick} className="flex flex-col items-center space-y-1">
            <span className="text-xs text-gray-400">입찰 중</span>
            <span className="font-bold text-lg">3</span>
          </button>
          <div className="w-px h-8 bg-gray-200"></div>
          <button onClick={onSalesManagementClick} className="flex flex-col items-center space-y-1">
            <span className="text-xs text-gray-400">판매 중</span>
            <span className="font-bold text-lg">1</span>
          </button>
          <div className="w-px h-8 bg-gray-200"></div>
          <button onClick={onWishlistClick} className="flex flex-col items-center space-y-1">
            <span className="text-xs text-gray-400">찜목록</span>
            <span className="font-bold text-lg">12</span>
          </button>
        </div>

        {/* Menus */}
        <div className="space-y-2">
          {[
            { icon: <ShoppingBag size={20} />, label: '구매 내역', onClick: onPurchaseHistoryClick },
            { icon: <Store size={20} />, label: '판매 내역', onClick: onSalesHistoryClick },
            { icon: <Check size={20} />, label: '계좌 관리', onClick: onAccountManagementClick },
            { icon: <Home size={20} />, label: '배송지 관리', onClick: onLocationEditClick },
            { icon: <Filter size={20} />, label: '관심 카테고리 설정', onClick: onCategoryResetClick },
            { icon: <Bell size={20} />, label: '알림 설정', onClick: onNotificationSettingsClick },
            { icon: <Star size={20} />, label: '리뷰 관리', onClick: onReviewClick },
          ].map((menu, idx) => (
            <button key={idx} onClick={menu.onClick} className="w-full h-14 flex items-center justify-between px-2 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-4">
                <div className="text-gray-400">{menu.icon}</div>
                <span className="font-medium">{menu.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="text-xs text-gray-300 px-2"
        >
          로그아웃
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full bg-white rounded-[32px] p-8 shadow-2xl space-y-6"
            >
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-bold">로그아웃</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  정말 로그아웃하시겠습니까?
                </p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  아니오
                </button>
                <button 
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                  className="flex-1 py-4 bg-black rounded-2xl font-bold text-white hover:bg-gray-900 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

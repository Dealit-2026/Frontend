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
import HomeScreen from './home/page';
import SearchScreen from './search/page';
import RegisterScreen from '../products/register/page';
import ChatListScreen from '../chats/page';
import MyPageScreen from './mypage/page';
import TabButton from '../../components/common/bottom-navigation/TabButton';

export default function MainLayout({ 
  activeTab, 
  onTabChange, 
  onProductClick,
  onProductListClick,
  onNotificationClick,
  onReviewClick,
  onSalesManagementClick,
  onNotificationSettingsClick,
  onChatClick,
  onCategoryResetClick,
  onSearchClick,
  onProfileEditClick,
  onLocationEditClick,
  onWishlistClick,
  onAccountManagementClick,
  onPurchaseHistoryClick,
  onSalesHistoryClick,
  onBiddingClick,
  themeMode,
  onThemeChange,
  themeColor,
  userLocation,
  onLogout
}: { 
  activeTab: Tab; 
  onTabChange: (tab: Tab) => void;
  onProductClick: (id: number) => void;
  onProductListClick: (type: 'all' | 'closing_soon' | 'recent', category?: string) => void;
  onNotificationClick: () => void;
  onReviewClick: () => void;
  onSalesManagementClick: () => void;
  onNotificationSettingsClick: () => void;
  onChatClick: (id: number) => void;
  onCategoryResetClick: () => void;
  onSearchClick: () => void;
  onProfileEditClick: () => void;
  onLocationEditClick: () => void;
  onWishlistClick: () => void;
  onAccountManagementClick: () => void;
  onPurchaseHistoryClick: () => void;
  onSalesHistoryClick: () => void;
  onBiddingClick: () => void;
  themeMode: 'regular' | 'auction';
  onThemeChange: (mode: 'regular' | 'auction') => void;
  themeColor: string;
  userLocation: string;
  onLogout: () => void;
  key?: string;
}) {
  const [lastTab, setLastTab] = useState<Tab>(activeTab === 'register' ? 'home' : activeTab);
  
  useEffect(() => {
    if (activeTab !== 'register') {
      setLastTab(activeTab);
    }
  }, [activeTab]);

  const displayTab = activeTab === 'register' ? lastTab : activeTab;

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {displayTab === 'home' && (
          <HomeScreen 
            onProductClick={onProductClick} 
            onProductListClick={onProductListClick}
            onNotificationClick={onNotificationClick} 
            onCategoryResetClick={onCategoryResetClick}
            onSearchClick={onSearchClick}
            onWishlistClick={onWishlistClick}
            mode={themeMode}
            onModeChange={onThemeChange}
            onTabChange={onTabChange}
          />
        )}
        {displayTab === 'search' && (
          <SearchScreen 
            onBack={() => onTabChange('home')} 
            onSearch={(keyword) => {
              onProductListClick('all', keyword);
            }}
            onSearchDetailClick={onSearchClick}
            onRecentClick={() => onProductListClick('recent')}
            themeColor={themeColor} 
          />
        )}
        <AnimatePresence>
          {activeTab === 'register' && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.5 }}
              className="absolute inset-0 z-50"
            >
              <RegisterScreen 
                onBack={() => onTabChange(lastTab)} 
                onComplete={() => onTabChange('home')} 
                themeColor={themeColor} 
                mode={themeMode} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        {displayTab === 'chat' && <ChatListScreen themeColor={themeColor} onChatClick={onChatClick} />}
        {displayTab === 'mypage' && (
          <MyPageScreen 
            themeColor={themeColor} 
            onReviewClick={onReviewClick} 
            onSalesManagementClick={onSalesManagementClick}
            onNotificationSettingsClick={onNotificationSettingsClick}
            onProfileEditClick={onProfileEditClick}
            onLocationEditClick={onLocationEditClick}
            onWishlistClick={onWishlistClick}
            onCategoryResetClick={onCategoryResetClick}
            onAccountManagementClick={onAccountManagementClick}
            onPurchaseHistoryClick={onPurchaseHistoryClick}
            onSalesHistoryClick={onSalesHistoryClick}
            onBiddingClick={onBiddingClick}
            userLocation={userLocation}
            onLogout={onLogout}
          />
        )}
      </div>

      {/* Bottom Tab Bar */}
      {activeTab !== 'register' && (
        <div className="h-16 bg-white border-t border-gray-100 flex items-center justify-around px-4 shrink-0">
          <TabButton active={activeTab === 'home'} icon={<Home size={24} />} label="홈" onClick={() => onTabChange('home')} activeColor={themeColor} />
          <TabButton active={activeTab === 'search'} icon={<ExploreIcon size={30} />} label="탐색" onClick={() => onTabChange('search')} activeColor={themeColor} />
          <TabButton active={(activeTab as any) === 'register'} icon={<PlusCircle size={24} />} label="등록" onClick={() => onTabChange('register')} activeColor={themeColor} />
          <TabButton active={activeTab === 'chat'} icon={<MessageCircle size={24} />} label="채팅" onClick={() => onTabChange('chat')} activeColor={themeColor} />
          <TabButton active={activeTab === 'mypage'} icon={<User size={24} />} label="MY" onClick={() => onTabChange('mypage')} activeColor={themeColor} />
        </div>
      )}
    </div>
  );
}

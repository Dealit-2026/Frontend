"use client";
import React, { useState, useEffect, useRef } from 'react';
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
import AuctionRegisterScreen from '../products/register/AuctionRegisterScreen';
import HomeScreen from './home';
import SearchScreen, { type SelectedSearchCategory } from './search';
import RegularRegisterScreen from '../products/register/RegularRegisterScreen';
import ChatListScreen from '../chats';
import MyPageScreen from './mypage';
import TabButton from '../../components/common/bottom-navigation/TabButton';
import { useEventStream } from '../../services/events/EventStreamProvider';

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
  onLogout,
  profileRefreshKey = 0,
}: { 
  activeTab: Tab; 
  onTabChange: (tab: Tab) => void;
  onProductClick: (id: number) => void;
  onProductListClick: (type: 'all' | 'closing_soon' | 'recent', category?: SelectedSearchCategory | string) => void;
  onNotificationClick: () => void;
  onReviewClick: () => void;
  onSalesManagementClick: () => void;
  onNotificationSettingsClick: () => void;
  onChatClick: (id: number) => void;
  onCategoryResetClick: () => void;
  onSearchClick: (scope?: 'home' | 'explore') => void;
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
  profileRefreshKey?: number;
  key?: string;
}) {
  const { chatUnreadCount } = useEventStream();
  const [lastTab, setLastTab] = useState<Tab>(activeTab === 'register' ? 'home' : activeTab);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const lastScrollTopRef = useRef(0);
  const RegisterComponent =
    themeMode === 'auction' ? AuctionRegisterScreen : RegularRegisterScreen;
  const displayTab = activeTab === 'register' ? lastTab : activeTab;
  
  useEffect(() => {
    if (activeTab !== 'register') {
      setLastTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    setIsBottomNavVisible(true);
    lastScrollTopRef.current = 0;

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement | Document | null;
      const scrollElement =
        target instanceof Document
          ? target.scrollingElement
          : target instanceof HTMLElement
            ? target
            : null;

      if (!scrollElement) {
        return;
      }

      const nextScrollTop = scrollElement.scrollTop;
      const previousScrollTop = lastScrollTopRef.current;
      const delta = nextScrollTop - previousScrollTop;

      if (nextScrollTop <= 12 || delta < -8) {
        setIsBottomNavVisible(true);
      } else if (delta > 8) {
        setIsBottomNavVisible(false);
      }

      lastScrollTopRef.current = Math.max(0, nextScrollTop);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [displayTab]);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden relative pb-16">
        {displayTab === 'home' && (
          <HomeScreen 
            onProductClick={onProductClick} 
            onProductListClick={onProductListClick}
            onNotificationClick={onNotificationClick} 
            onCategoryResetClick={onCategoryResetClick}
            onSearchClick={() => onSearchClick('home')}
            onWishlistClick={onWishlistClick}
            mode={themeMode}
            onModeChange={onThemeChange}
            onTabChange={onTabChange}
          />
        )}
        {displayTab === 'search' && (
          <SearchScreen 
            onBack={() => onTabChange('home')} 
            onCategorySelect={(category) => {
              onProductListClick('all', category);
            }}
            onSearchDetailClick={() => onSearchClick('explore')}
            onRecentClick={() => onProductListClick('recent')}
            mode={themeMode}
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
              <RegisterComponent 
                onBack={() => onTabChange(lastTab)} 
                onComplete={() => onTabChange('home')} 
                themeColor={themeColor} 
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
            refreshKey={profileRefreshKey}
          />
        )}
      </div>

      {/* Bottom Tab Bar */}
      {activeTab !== 'register' && (
        <motion.div
          animate={{ y: isBottomNavVisible ? 0 : 76 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-4 shadow-[0_-8px_20px_rgba(0,0,0,0.03)]"
        >
          <TabButton active={activeTab === 'home'} icon={<Home size={24} />} label="홈" onClick={() => onTabChange('home')} activeColor={themeColor} />
          <TabButton active={activeTab === 'search'} icon={<ExploreIcon size={30} />} label="탐색" onClick={() => onTabChange('search')} activeColor={themeColor} />
          <TabButton active={(activeTab as any) === 'register'} icon={<PlusCircle size={24} />} label="등록" onClick={() => onTabChange('register')} activeColor={themeColor} />
          <TabButton active={activeTab === 'chat'} icon={<MessageCircle size={24} />} label="채팅" onClick={() => onTabChange('chat')} activeColor={themeColor} badgeCount={chatUnreadCount} />
          <TabButton active={activeTab === 'mypage'} icon={<User size={24} />} label="MY" onClick={() => onTabChange('mypage')} activeColor={themeColor} />
        </motion.div>
      )}
    </div>
  );
}

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
import { ExploreIcon } from '../ExploreIcon';

export default function TabButton({
  active,
  icon,
  label,
  onClick,
  activeColor,
  badgeCount = 0,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  activeColor: string;
  badgeCount?: number;
}) {
  const displayBadge = badgeCount > 99 ? "99+" : String(badgeCount);

  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center space-y-1 transition-colors relative min-w-10"
      style={{ color: active ? activeColor : '#D1D5DB' }}
    >
      <span className="relative">
        {icon}
        {badgeCount > 0 && (
          <span className="absolute -right-2 -top-2 min-w-4 h-4 px-1 rounded-full bg-[#F64257] text-white text-[9px] leading-4 font-bold text-center">
            {displayBadge}
          </span>
        )}
      </span>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

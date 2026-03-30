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

export default function TabButton({ active, icon, label, onClick, activeColor }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; activeColor: string }) {
  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center space-y-1 transition-colors"
      style={{ color: active ? activeColor : '#D1D5DB' }}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

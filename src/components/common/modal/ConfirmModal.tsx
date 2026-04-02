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

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "확인", 
  cancelText = "취소",
  themeColor
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title?: string; 
  message: string; 
  confirmText?: string; 
  cancelText?: string;
  themeColor: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-[320px] bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6"
      >
        <div className="space-y-2 text-center">
          {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: themeColor }}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

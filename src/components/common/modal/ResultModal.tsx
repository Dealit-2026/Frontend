"use client";

import { motion } from "motion/react";

interface ResultModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  themeColor?: string;
}

export default function ResultModal({
  isOpen,
  title,
  message,
  onClose,
  confirmText = "확인",
  themeColor = "#98E446",
}: ResultModalProps) {
  if (!isOpen) {
    return null;
  }

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
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl text-black font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: themeColor }}
        >
          {confirmText}
        </button>
      </motion.div>
    </div>
  );
}

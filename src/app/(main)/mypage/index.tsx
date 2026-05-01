"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Filter,
  Home,
  Settings,
  ShoppingBag,
  Star,
  Store,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import {
  fetchMyPageProfile,
  fetchMySellingAuctionCount,
} from "@/services/mypage/service";
import type { MyPageProfileViewModel } from "@/services/mypage/types";

interface MyPageScreenProps {
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
  onLogout: () => void;
  userLocation?: string;
  refreshKey?: number;
}

export default function MyPageScreen({
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
  onLogout,
  refreshKey = 0,
}: MyPageScreenProps) {
  const [profile, setProfile] = useState<MyPageProfileViewModel | null>(null);
  const [sellingAuctionCount, setSellingAuctionCount] = useState<number | null>(
    null,
  );
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchMyPageProfile()
      .then((nextProfile) => {
        if (!ignore) {
          setProfile(nextProfile);
          setProfileErrorMessage("");
        }
      })
      .catch((error) => {
        if (!ignore) {
          setProfile(null);
          setProfileErrorMessage(
            getErrorMessage(error, "마이페이지 정보를 불러오지 못했습니다."),
          );
        }
      });

    fetchMySellingAuctionCount()
      .then((nextCount) => {
        if (!ignore) {
          setSellingAuctionCount(nextCount);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch selling auction count", error);
        if (!ignore) {
          setSellingAuctionCount(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const sellingCount = sellingAuctionCount ?? profile?.sellingCount ?? 0;

  const menus = [
    { icon: <ShoppingBag size={20} />, label: "구매 내역", onClick: onPurchaseHistoryClick },
    { icon: <Store size={20} />, label: "판매 내역", onClick: onSalesHistoryClick },
    { icon: <Check size={20} />, label: "계좌 관리", onClick: onAccountManagementClick },
    { icon: <Home size={20} />, label: "배송지 관리", onClick: onLocationEditClick },
    { icon: <Filter size={20} />, label: "관심 카테고리 설정", onClick: onCategoryResetClick },
    { icon: <Bell size={20} />, label: "알림 설정", onClick: onNotificationSettingsClick },
    { icon: <Star size={20} />, label: "리뷰 관리", onClick: onReviewClick },
  ];

  return (
    <div className="flex flex-col h-full relative">
      <div className="h-16 flex items-center px-6 justify-between">
        <h1 className="text-xl font-bold">마이페이지</h1>
        <button
          onClick={onNotificationSettingsClick}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="알림 설정"
        >
          <Settings size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-8">
        {profileErrorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
            {profileErrorMessage}
          </div>
        )}

        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
            {profile?.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={`${profile.nickname} 프로필`}
                className="w-full h-full object-cover"
                onError={() =>
                  setProfile((prevProfile) =>
                    prevProfile
                      ? { ...prevProfile, profileImageUrl: "" }
                      : prevProfile,
                  )
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <User size={32} />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">
                {profile?.nickname ?? "프로필 불러오는 중"}
              </span>
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
                <span className="font-medium text-gray-600">
                  {profile?.ratingLabel ?? "평점 -"}
                </span>
              </div>
              <span className="w-px h-2 bg-gray-300" />
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="font-medium text-gray-600">
                  {profile?.warningLabel ?? "경고 -"}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">
              {profile?.location ?? "지역 정보를 불러오는 중"}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 flex justify-around items-center">
          <button onClick={onBiddingClick} className="flex flex-col items-center space-y-1">
            <span className="text-xs text-gray-400">입찰 중</span>
            <span className="font-bold text-lg">{profile?.biddingCount ?? 0}</span>
          </button>
          <div className="w-px h-8 bg-gray-200" />
          <button
            onClick={onSalesManagementClick}
            className="flex flex-col items-center space-y-1"
          >
            <span className="text-xs text-gray-400">판매 중</span>
            <span className="font-bold text-lg">{sellingCount}</span>
          </button>
          <div className="w-px h-8 bg-gray-200" />
          <button onClick={onWishlistClick} className="flex flex-col items-center space-y-1">
            <span className="text-xs text-gray-400">찜목록</span>
            <span className="font-bold text-lg">{profile?.wishlistCount ?? 0}</span>
          </button>
        </div>

        <div className="space-y-2">
          {menus.map((menu) => (
            <button
              key={menu.label}
              onClick={menu.onClick}
              className="w-full h-14 flex items-center justify-between px-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
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
                  정말 로그아웃하시겠어요?
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  아니요
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

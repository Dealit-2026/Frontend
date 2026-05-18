"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "../index";
import {
  readStoredThemeMode,
  writeStoredThemeMode,
  type ThemeMode,
} from "@/services/themeMode";
import type { Tab } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<ThemeMode>("regular");

  useEffect(() => {
    setMode(readStoredThemeMode());
  }, []);

  const handleModeChange = (nextMode: ThemeMode) => {
    setMode(nextMode);
    writeStoredThemeMode(nextMode);
  };

  const themeColor = mode === "regular" ? "#98E446" : "#F64257";

  const handleTabChange = (tab: Tab) => {
    switch (tab) {
      case "home":
        router.push("/home");
        return;
      case "search":
        router.push("/search");
        return;
      case "register":
        router.push("/products/register");
        return;
      case "chat":
        router.push("/chats");
        return;
      case "mypage":
        router.push("/mypage");
        return;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-white font-sans text-[#141414]">
      <MainLayout
        activeTab="home"
        onTabChange={handleTabChange}
        onProductClick={(id) =>
          router.push(mode === "auction" ? `/auctions/${id}` : `/products/${id}`)
        }
        onProductListClick={(type, category) => {
          const params = new URLSearchParams();
          params.set("type", type);
          if (category) {
            params.set(
              "category",
              typeof category === "object" ? category.name : category,
            );
          }

          router.push(
            `${mode === "auction" ? "/auctions" : "/products"}?${params.toString()}`,
          );
        }}
        onNotificationClick={() => router.push("/notifications")}
        onReviewClick={() => router.push("/mypage/review")}
        onSalesManagementClick={() => router.push("/mypage/sales-management")}
        onNotificationSettingsClick={() => router.push("/notifications/settings")}
        onChatClick={(id) => router.push(`/chats/${id}`)}
        onCategoryResetClick={() => router.push("/category-selection?mode=edit")}
        onSearchClick={() => router.push("/search/detail")}
        onProfileEditClick={() => router.push("/mypage/edit-profile")}
        onLocationEditClick={() => router.push("/mypage/edit-profile/location")}
        onWishlistClick={() => router.push("/wishlist")}
        onAccountManagementClick={() => router.push("/mypage/account-management")}
        onPurchaseHistoryClick={() => router.push("/mypage/purchase-history")}
        onSalesHistoryClick={() => router.push("/mypage/sales-history")}
        onBiddingClick={() => router.push("/mypage/my-bids")}
        themeMode={mode}
        onThemeChange={handleModeChange}
        themeColor={themeColor}
        userLocation="지역 정보 없음"
        onLogout={() => router.push("/login")}
      />
    </div>
  );
}

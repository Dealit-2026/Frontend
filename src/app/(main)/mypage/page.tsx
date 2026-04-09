"use client";

import { useRouter } from "next/navigation";

import MyPageScreen from "./index";

export default function MyPage() {
  const router = useRouter();

  return (
    <MyPageScreen
      themeColor="#98E446"
      onReviewClick={() => router.push("/mypage/review")}
      onSalesManagementClick={() => router.push("/mypage/sales-management")}
      onNotificationSettingsClick={() => router.push("/notifications/settings")}
      onProfileEditClick={() => router.push("/profile-setup")}
      onLocationEditClick={() => router.push("/region-setup")}
      onWishlistClick={() => router.push("/wishlist")}
      onCategoryResetClick={() => router.push("/category-selection")}
      onAccountManagementClick={() => router.push("/mypage/account-management")}
      onPurchaseHistoryClick={() => router.push("/mypage/purchase-history")}
      onSalesHistoryClick={() => router.push("/mypage/sales-history")}
      onBiddingClick={() => router.push("/mypage/my-bids")}
      userLocation="서울특별시 강남구 역삼동"
      onLogout={() => router.push("/")}
    />
  );
}

"use client";

import { useRouter } from "next/navigation";

import MyPageScreen from "./index";
import { clearAuthToken } from "@/services/auth/service";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function MyPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <MyPageScreen
        themeColor="#98E446"
        onReviewClick={() => router.push("/mypage/review")}
        onSalesManagementClick={() => router.push("/mypage/sales-management")}
        onNotificationSettingsClick={() => router.push("/notifications/settings")}
        onProfileEditClick={() => router.push("/mypage/edit-profile")}
        onLocationEditClick={() => router.push("/region-setup")}
        onWishlistClick={() => router.push("/wishlist")}
        onCategoryResetClick={() => router.push("/category-selection")}
        onAccountManagementClick={() => router.push("/mypage/account-management")}
        onPurchaseHistoryClick={() => router.push("/mypage/purchase-history")}
        onSalesHistoryClick={() => router.push("/mypage/sales-history")}
        onBiddingClick={() => router.push("/mypage/my-bids")}
        onLogout={() => {
          clearAuthToken();
          router.push("/login");
        }}
      />
    </RouteTabShell>
  );
}

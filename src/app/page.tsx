"use client";

import React, { useState, useEffect } from "react";
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
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Screen, Tab } from "../types/index";
import { ExploreIcon } from "../components/common/ExploreIcon";
import LoginScreen from "./(auth)/login";
import FindIdScreen from "./(auth)/find-id";
import FindPasswordScreen from "./(auth)/find-password";
import SignupScreen from "./(auth)/signup";
import RegionSetupScreen from "./(auth)/region-setup";
import FindLocationScreen from "./(auth)/find-location";
import PhoneAuthScreen from "./(auth)/phone-auth";
import TermsAgreementScreen from "./(auth)/terms";
import ProfileSetupScreen from "./(auth)/profile-setup";
import CategorySelectionScreen from "./(auth)/category-selection";
import MainLayout from "./(main)";
import TabButton from "../components/common/bottom-navigation/TabButton";
import ProductCard from "../components/product/ProductCard";
import ConfirmModal from "../components/common/modal/ConfirmModal";
import ProductListItem from "../components/product/ProductListItem";
import ProductListScreen from "./products";
import HomeScreen from "./(main)/home";
import WishlistScreen from "./(main)/wishlist";
import SearchScreen from "./(main)/search";
import SearchDetailScreen from "./(main)/search/detail";
import RegisterScreen from "./products/register";
import ChatListScreen from "./chats";
import MyPageScreen from "./(main)/mypage";
import ProductDetailScreen from "./products/[productId]";
import ReportScreen from "./products/[productId]/report";
import BiddingStatusScreen from "./auctions/[auctionId]/bidding-status";
import NotificationScreen from "./(main)/notifications";
import ReviewScreen from "./(main)/mypage/review";
import ReceiptScreen from "./products/[productId]/receipt";
import WriteReviewScreen from "./(main)/mypage/review/write";
import RegularPurchaseScreen from "./products/[productId]/regular-purchase";
import PaymentScreen from "./products/[productId]/payment";
import PurchaseHistoryScreen from "./(main)/mypage/purchase-history";
import SalesHistoryScreen from "./(main)/mypage/sales-history";
import AccountManagementScreen from "./(main)/mypage/account-management";
import NotificationSettingsScreen from "./(main)/notifications/settings";
import ChatRoomScreen from "./chats/[roomId]";
import BidPlacementCompleteScreen from "./auctions/[auctionId]/bid-complete";
import WinningBidCompletionScreen from "./auctions/[auctionId]/winning-complete";
import OutbidNotificationScreen from "./auctions/[auctionId]/outbid";
import MyBidsScreen from "./(main)/mypage/my-bids";
import SalesManagementScreen from "./(main)/mypage/sales-management";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [themeMode, setThemeMode] = useState<"regular" | "auction">("regular");
  const [productListType, setProductListType] = useState<
    "all" | "closing_soon" | "recent"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userLocation, setUserLocation] = useState("서울특별시 강남구 역삼동");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const [bidData, setBidData] = useState<{
    productId: number;
    productName: string;
    sellerName: string;
    bidAmount: number;
    remainingTime: string;
  } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const themeColor = themeMode === "regular" ? "#98E446" : "#F64257";

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const navigateToProduct = (id: number) => {
    setSelectedProductId(id);
    setCurrentScreen("product_detail");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 font-sans text-[#141414]">
      <div className="w-full max-w-[720px] mx-auto bg-white overflow-hidden relative flex flex-col shrink-0">
        <AnimatePresence mode="wait">
          {currentScreen === "login" && (
            <LoginScreen
              key="login"
              showToast={showToast}
              onNavigateSignup={() => navigateTo("signup")}
              onNavigateFindId={() => navigateTo("find_id")}
              onNavigateFindPassword={() => navigateTo("find_password")}
              onLogin={() => navigateTo("main")}
            />
          )}
          {currentScreen === "find_id" && (
            <FindIdScreen
              key="find_id"
              showToast={showToast}
              onBack={() => navigateTo("login")}
            />
          )}
          {currentScreen === "find_password" && (
            <FindPasswordScreen
              key="find_password"
              showToast={showToast}
              onBack={() => navigateTo("login")}
            />
          )}
          {currentScreen === "signup" && (
            <SignupScreen
              key="signup"
              showToast={showToast}
              onBack={() => navigateTo("login")}
              onNext={() => navigateTo("region_setup")}
            />
          )}
          {currentScreen === "region_setup" && (
            <RegionSetupScreen
              key="region_setup"
              onBack={() => {
                if (isEditingLocation) {
                  navigateTo("main");
                  setIsEditingLocation(false);
                } else {
                  navigateTo("signup");
                }
              }}
              onNext={() => {
                if (isEditingLocation) {
                  navigateTo("main");
                  setIsEditingLocation(false);
                } else {
                  navigateTo("phone_auth");
                }
              }}
              onFindLocation={() => navigateTo("find_location")}
              currentLocation={userLocation}
            />
          )}
          {currentScreen === "find_location" && (
            <FindLocationScreen
              key="find_location"
              onBack={() => navigateTo("region_setup")}
              onComplete={(newLocation) => {
                setUserLocation(newLocation);
                if (isEditingLocation) {
                  navigateTo("main");
                  setIsEditingLocation(false);
                } else {
                  navigateTo("phone_auth");
                }
              }}
            />
          )}
          {currentScreen === "phone_auth" && (
            <PhoneAuthScreen
              key="phone_auth"
              showToast={showToast}
              onBack={() => navigateTo("region_setup")}
              onComplete={() => navigateTo("terms")}
            />
          )}
          {currentScreen === "terms" && (
            <TermsAgreementScreen
              key="terms"
              onBack={() => navigateTo("phone_auth")}
              onNext={() => navigateTo("profile_setup")}
            />
          )}
          {currentScreen === "profile_setup" && (
            <ProfileSetupScreen
              key="profile_setup"
              showToast={showToast}
              onBack={() => {
                if (isEditingProfile) {
                  navigateTo("main");
                  setIsEditingProfile(false);
                } else {
                  navigateTo("terms");
                }
              }}
              onComplete={() => {
                if (isEditingProfile) {
                  navigateTo("main");
                  setIsEditingProfile(false);
                } else {
                  navigateTo("category_selection");
                }
              }}
            />
          )}
          {currentScreen === "category_selection" && (
            <CategorySelectionScreen
              key="category_selection"
              onBack={() => navigateTo("profile_setup")}
              onComplete={() => navigateTo("main")}
              onNavigateLogin={() => navigateTo("login")}
              showSkip={true}
            />
          )}
          {currentScreen === "category_reset" && (
            <CategorySelectionScreen
              key="category_reset"
              onBack={() => navigateTo("main")}
              onComplete={() => navigateTo("main")}
              onNavigateLogin={() => navigateTo("login")}
              showSkip={false}
            />
          )}
          {currentScreen === "main" && (
            <MainLayout
              key="main"
              activeTab={currentTab}
              onTabChange={setCurrentTab}
              onProductClick={navigateToProduct}
              onProductListClick={(type, category) => {
                setProductListType(type);
                setSelectedCategory(category || null);
                navigateTo("product_list");
              }}
              onNotificationClick={() => navigateTo("notifications")}
              onReviewClick={() => navigateTo("review")}
              onSalesManagementClick={() => navigateTo("sales_management")}
              onNotificationSettingsClick={() =>
                navigateTo("notification_settings")
              }
              onAccountManagementClick={() => navigateTo("account_management")}
              onPurchaseHistoryClick={() => navigateTo("purchase_history")}
              onSalesHistoryClick={() => navigateTo("sales_history")}
              onBiddingClick={() => navigateTo("my_bids")}
              onChatClick={(id) => {
                setSelectedChatId(id);
                navigateTo("chat_room");
              }}
              onCategoryResetClick={() => navigateTo("category_reset")}
              onSearchClick={() => {
                setSelectedCategory(null);
                navigateTo("search_detail");
              }}
              onProfileEditClick={() => {
                setIsEditingProfile(true);
                navigateTo("profile_setup");
              }}
              onLocationEditClick={() => {
                setIsEditingLocation(true);
                navigateTo("region_setup");
              }}
              onWishlistClick={() => navigateTo("wishlist")}
              themeMode={themeMode}
              onThemeChange={setThemeMode}
              themeColor={themeColor}
              userLocation={userLocation}
              onLogout={() => {
                setCurrentTab("home");
                navigateTo("login");
              }}
            />
          )}
          {currentScreen === "bid_placement_complete" && bidData && (
            <BidPlacementCompleteScreen
              key="bid_placement_complete"
              productName={bidData.productName}
              sellerName={bidData.sellerName}
              bidAmount={bidData.bidAmount}
              remainingTime={bidData.remainingTime}
              productId={bidData.productId}
              onBrowseOther={() => {
                setCurrentTab("home");
                navigateTo("main");
              }}
              onProductDetail={() => {
                setSelectedProductId(bidData.productId);
                navigateTo("product_detail");
              }}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "wishlist" && (
            <WishlistScreen
              key="wishlist"
              onBack={() => navigateTo("main")}
              onProductClick={navigateToProduct}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "search_detail" && (
            <SearchDetailScreen
              key="search_detail"
              onBack={() => navigateTo("main")}
              onSearch={(keyword) => {
                setProductListType("all");
                setSelectedCategory(keyword);
                navigateTo("product_list");
              }}
              themeColor={themeColor}
              initialCategory={selectedCategory}
            />
          )}
          {currentScreen === "product_list" && (
            <ProductListScreen
              key="product_list"
              listType={productListType}
              categoryName={selectedCategory}
              onBack={() => {
                setSelectedCategory(null);
                navigateTo("main");
              }}
              onProductClick={navigateToProduct}
              onSearchClick={() => navigateTo("search_detail")}
              themeColor={themeColor}
              mode={themeMode}
            />
          )}
          {currentScreen === "product_detail" && (
            <ProductDetailScreen
              key="product_detail"
              productId={selectedProductId}
              onBack={() => navigateTo("main")}
              onBidStatusClick={() => navigateTo("bidding_status")}
              onReportClick={() => navigateTo("report")}
              onBidComplete={(data) => {
                setBidData(data);
                navigateTo("bid_placement_complete");
              }}
              onPurchaseClick={() => navigateTo("regular_purchase")}
              onChatClick={() => {
                setSelectedChatId(1);
                navigateTo("chat_room");
              }}
              themeColor={themeColor}
              mode={themeMode}
              showToast={showToast}
            />
          )}
          {currentScreen === "regular_purchase" && (
            <RegularPurchaseScreen
              key="regular_purchase"
              productId={selectedProductId}
              onBack={() => navigateTo("product_detail")}
              onComplete={() => navigateTo("receipt")}
              themeColor={themeColor}
              showToast={showToast}
            />
          )}
          {currentScreen === "bidding_status" && (
            <BiddingStatusScreen
              key="bidding_status"
              onBack={() => navigateTo("product_detail")}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "report" && (
            <ReportScreen
              key="report"
              productId={selectedProductId}
              onBack={() => navigateTo("product_detail")}
              themeColor={themeColor}
              showToast={showToast}
            />
          )}
          {currentScreen === "notifications" && (
            <NotificationScreen
              key="notifications"
              onBack={() => navigateTo("main")}
              onChatClick={(id) => {
                setSelectedChatId(id);
                navigateTo("chat_room");
              }}
              onReviewClick={() => navigateTo("review")}
              onReceiptClick={() => navigateTo("receipt")}
              onProductClick={navigateToProduct}
              onWinningBidClick={() => navigateTo("winning_bid_completion")}
              onOutbidClick={() => navigateTo("outbid_notification")}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "winning_bid_completion" && (
            <WinningBidCompletionScreen
              key="winning_bid_completion"
              onBack={() => navigateTo("notifications")}
              onPaymentClick={() => navigateTo("payment")}
              themeColor="#F64257"
            />
          )}
          {currentScreen === "outbid_notification" && (
            <OutbidNotificationScreen
              key="outbid_notification"
              onBack={() => navigateTo("notifications")}
              onProductClick={navigateToProduct}
              themeColor="#F64257"
            />
          )}
          {currentScreen === "notification_settings" && (
            <NotificationSettingsScreen
              key="notification_settings"
              onBack={() => navigateTo("main")}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "account_management" && (
            <AccountManagementScreen
              key="account_management"
              onBack={() => navigateTo("main")}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "purchase_history" && (
            <PurchaseHistoryScreen
              key="purchase_history"
              onBack={() => navigateTo("main")}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "sales_history" && (
            <SalesHistoryScreen
              key="sales_history"
              onBack={() => navigateTo("main")}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "sales_management" && (
            <SalesManagementScreen
              key="sales_management"
              onBack={() => navigateTo("main")}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "my_bids" && (
            <MyBidsScreen
              key="my_bids"
              onBack={() => navigateTo("main")}
              onProductClick={navigateToProduct}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "review" && (
            <ReviewScreen
              key="review"
              onBack={() => navigateTo("main")}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "chat_room" && (
            <ChatRoomScreen
              key="chat_room"
              chatId={selectedChatId}
              onBack={() => navigateTo("main")}
              onProductClick={(id) => {
                setSelectedProductId(id);
                navigateTo("product_detail");
              }}
              themeColor={themeColor}
            />
          )}
          {currentScreen === "receipt" && (
            <ReceiptScreen
              key="receipt"
              onBack={() => navigateTo("main")}
              onWriteReview={() => navigateTo("write_review")}
              themeColor="#F64257"
            />
          )}
          {currentScreen === "write_review" && (
            <WriteReviewScreen
              key="write_review"
              onBack={() => navigateTo("receipt")}
              onComplete={() => {
                showToast("리뷰가 등록되었습니다.");
                navigateTo("main");
              }}
              themeColor="#F64257"
            />
          )}
          {currentScreen === "payment" && (
            <PaymentScreen
              key="payment"
              showToast={showToast}
              onBack={() => navigateTo("product_detail")}
              onComplete={() => navigateTo("receipt")}
              themeColor="#F64257"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

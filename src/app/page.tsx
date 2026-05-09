"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import EmailAuthScreen from "./(auth)/email-auth";
import TermsAgreementScreen from "./(auth)/terms";
import ProfileSetupScreen from "./(auth)/profile-setup";
import ProfileEditScreen from "./(main)/mypage/edit-profile";
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
import PaymentScreen from "./products/[productId]/regular-payment";
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
import { getErrorMessage } from "@/services/apiError";
import {
  applyLocationDetailAddress,
  createDefaultLocationForm,
  getLocationDisplayName,
  openDaumPostcodeSearch,
  resolveCurrentLocation,
} from "@/services/location/service";
import type { LocationFormValues } from "@/services/location/types";
import {
  fetchMyLocationForm,
  saveMyLocation,
  saveMyProfile,
  uploadMyProfileImage,
} from "@/services/mypage/service";
import type { MyProfileFormValues } from "@/services/mypage/types";
import {
  clearMyProfileDraft,
  updateMyProfileDraft,
} from "@/services/mypage/profileDraft";
import { clearSignUpDraft, getSignUpDraft } from "@/services/auth/signUpDraft";
import {
  clearAuthToken,
  fetchCurrentMember,
  getAuthToken,
  signUp,
} from "@/services/auth/service";
import { EventStreamProvider } from "@/services/events/EventStreamProvider";

export default function App() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [emailAuthMode, setEmailAuthMode] = useState<"signup" | "profile">(
    "signup",
  );
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
  const [userLocationForm, setUserLocationForm] = useState<LocationFormValues>(
    createDefaultLocationForm(),
  );
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);
  const [signupProfileForm, setSignupProfileForm] =
    useState<MyProfileFormValues | null>(null);
  const [signupProfileImageFile, setSignupProfileImageFile] =
    useState<File | null>(null);
  const [isResolvingCurrentLocation, setIsResolvingCurrentLocation] =
    useState(false);
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
    productImageUrl?: string | null;
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
    router.push(`/products/${id}`);
  };

  const navigateToCatalogItem = (id: number) => {
    router.push(themeMode === "auction" ? `/auction/${id}` : `/products/${id}`);
  };

  const handleLocationPostcodeSearch = async () => {
    try {
      const nextLocationForm = await openDaumPostcodeSearch(
        userLocationForm.detailAddress,
      );
      setUserLocationForm(nextLocationForm);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "주소 검색을 불러오지 못했습니다.",
      );

      if (message !== "주소 검색이 취소되었습니다.") {
        showToast(message);
      }
    }
  };

  const handleCurrentLocationResolve = async () => {
    setIsResolvingCurrentLocation(true);

    try {
      const nextLocationForm = await resolveCurrentLocation();
      setUserLocationForm(
        applyLocationDetailAddress(
          nextLocationForm,
          userLocationForm.detailAddress,
        ),
      );
    } catch (error) {
      showToast(getErrorMessage(error, "현재 위치를 불러오지 못했습니다."));
    } finally {
      setIsResolvingCurrentLocation(false);
    }
  };

  useEffect(() => {
    const accessToken = getAuthToken();

    if (!accessToken) {
      setCurrentScreen("login");
      return;
    }

    let ignore = false;

    fetchCurrentMember()
      .then(() => {
        if (!ignore) {
          setCurrentScreen("main");
        }
      })
      .catch(() => {
        if (!ignore) {
          setCurrentTab("home");
          setCurrentScreen("login");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <EventStreamProvider enabled={currentScreen !== "login"}>
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
                onNext={() => {
                  setUserLocationForm(createDefaultLocationForm());
                  setEmailAuthMode("signup");
                  navigateTo("email_auth");
                }}
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
                    navigateTo("terms");
                  }
                }}
                onNext={async () => {
                  try {
                    if (isEditingLocation || getAuthToken()) {
                      await saveMyLocation(userLocationForm);
                    }

                    if (isEditingLocation) {
                      navigateTo("main");
                      setIsEditingLocation(false);
                    } else {
                      navigateTo("profile_setup");
                    }
                  } catch (error) {
                    showToast(
                      getErrorMessage(error, "지역 저장에 실패했습니다."),
                    );
                  }
                }}
                onOpenPostcode={handleLocationPostcodeSearch}
                onUseCurrentLocation={handleCurrentLocationResolve}
                locationForm={userLocationForm}
                onLocationChange={setUserLocationForm}
                isResolvingCurrentLocation={isResolvingCurrentLocation}
                confirmLabel={isEditingLocation ? "확인" : "다음"}
              />
            )}
            {currentScreen === "email_auth" && (
              <EmailAuthScreen
                key="email_auth"
                showToast={showToast}
                onBack={() =>
                  navigateTo(
                    emailAuthMode === "profile" ? "edit_profile" : "signup",
                  )
                }
                onComplete={() => {
                  if (emailAuthMode === "profile") {
                    navigateTo("edit_profile");
                    return;
                  }

                  navigateTo("terms");
                }}
                onSkip={() => navigateTo("terms")}
                mode={emailAuthMode}
              />
            )}
            {currentScreen === "terms" && (
              <TermsAgreementScreen
                key="terms"
                onBack={() => navigateTo("email_auth")}
                onNext={() => navigateTo("region_setup")}
              />
            )}
            {currentScreen === "profile_setup" && (
              <ProfileSetupScreen
                key="profile_setup"
                showToast={showToast}
                deferSave={!isEditingProfile && !getAuthToken()}
                onCompleteDraft={(form, imageFile) => {
                  setSignupProfileForm(form);
                  setSignupProfileImageFile(imageFile ?? null);
                }}
                onBack={() => {
                  if (isEditingProfile) {
                    navigateTo("main");
                    setIsEditingProfile(false);
                  } else {
                    navigateTo("region_setup");
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
            {currentScreen === "edit_profile" && (
              <ProfileEditScreen
                key="edit_profile"
                onLocationEdit={() => {
                  fetchMyLocationForm()
                    .then((locationForm) => {
                      setUserLocationForm(locationForm);
                    })
                    .catch((error) => {
                      showToast(
                        getErrorMessage(
                          error,
                          "지역 정보를 불러오지 못했습니다.",
                        ),
                      );
                    });
                  navigateTo("edit_profile_region");
                }}
                onBack={() => {
                  navigateTo("main");
                  setIsEditingProfile(false);
                }}
                onEmailVerify={() => {
                  setEmailAuthMode("profile");
                  navigateTo("email_auth");
                }}
                onComplete={() => {
                  setProfileRefreshKey((prevKey) => prevKey + 1);
                  setCurrentTab("mypage");
                  navigateTo("main");
                  setIsEditingProfile(false);
                }}
              />
            )}
            {currentScreen === "edit_profile_region" && (
              <RegionSetupScreen
                key="edit_profile_region"
                onBack={() => navigateTo("edit_profile")}
                onNext={async () => {
                  try {
                    await saveMyLocation(userLocationForm);
                    updateMyProfileDraft({
                      location: getLocationDisplayName(userLocationForm),
                      locationDetails: userLocationForm,
                    });
                    navigateTo("edit_profile");
                  } catch (error) {
                    showToast(
                      getErrorMessage(error, "지역 저장에 실패했습니다."),
                    );
                  }
                }}
                onOpenPostcode={handleLocationPostcodeSearch}
                onUseCurrentLocation={handleCurrentLocationResolve}
                locationForm={userLocationForm}
                onLocationChange={setUserLocationForm}
                isResolvingCurrentLocation={isResolvingCurrentLocation}
                confirmLabel="확인"
              />
            )}
            {currentScreen === "category_selection" && (
              <CategorySelectionScreen
                key="category_selection"
                onBack={() => navigateTo("profile_setup")}
                onComplete={async () => {
                  try {
                    if (!getAuthToken()) {
                      const signUpResult = await signUp(getSignUpDraft());
                      showToast(signUpResult.message);

                      try {
                        await saveMyLocation(userLocationForm);
                      } catch (locationError) {
                        showToast(
                          getErrorMessage(
                            locationError,
                            "지역 저장에 실패했습니다.",
                          ),
                        );
                      }

                      if (signupProfileForm) {
                        try {
                          let profileImageUrl =
                            signupProfileForm.profileImageUrl;

                          if (signupProfileImageFile) {
                            const uploadedImage = await uploadMyProfileImage(
                              signupProfileImageFile,
                            );
                            profileImageUrl = uploadedImage.profileImageUrl;
                          }

                          await saveMyProfile({
                            ...signupProfileForm,
                            profileImageUrl,
                          });
                        } catch (profileError) {
                          showToast(
                            getErrorMessage(
                              profileError,
                              "프로필 저장에 실패했습니다.",
                            ),
                          );
                        }
                      }

                      clearSignUpDraft();
                      setSignupProfileForm(null);
                      setSignupProfileImageFile(null);
                    }

                    navigateTo("main");
                  } catch (error) {
                    showToast(
                      getErrorMessage(error, "회원가입 완료에 실패했습니다."),
                    );
                  }
                }}
              />
            )}
            {currentScreen === "category_reset" && (
              <CategorySelectionScreen
                key="category_reset"
                mode="edit"
                showToast={showToast}
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
                onAccountManagementClick={() =>
                  navigateTo("account_management")
                }
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
                  navigateTo("edit_profile");
                }}
                onLocationEditClick={() => {
                  setIsEditingLocation(true);
                  fetchMyLocationForm()
                    .then((locationForm) => {
                      setUserLocationForm(locationForm);
                    })
                    .catch(() => {
                      setUserLocationForm(createDefaultLocationForm());
                    });
                  navigateTo("region_setup");
                }}
                onWishlistClick={() => navigateTo("wishlist")}
                themeMode={themeMode}
                onThemeChange={setThemeMode}
                themeColor={themeColor}
                userLocation={getLocationDisplayName(userLocationForm)}
                profileRefreshKey={profileRefreshKey}
                onLogout={() => {
                  clearAuthToken();
                  clearSignUpDraft();
                  clearMyProfileDraft();
                  setSignupProfileForm(null);
                  setSignupProfileImageFile(null);
                  setUserLocationForm(createDefaultLocationForm());
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
                productImageUrl={bidData.productImageUrl ?? undefined}
                onBack={() => {
                  setSelectedProductId(bidData.productId);
                  navigateTo("product_detail");
                }}
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
                onPurchaseClick={() => navigateTo("payment")}
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
                auctionId={selectedProductId}
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

            {currentScreen === "write_review" && (
              <WriteReviewScreen
                key="write_review"
                onBack={() => router.back()}
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
                themeColor="#F64257"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </EventStreamProvider>
  );
}

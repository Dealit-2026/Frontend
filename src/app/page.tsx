"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { findExistingChatRoomByProductId } from "@/services/chats/service";
import { fetchAuctionDetail } from "@/services/auction/detail/service";
import {
  readStoredThemeMode,
  writeStoredThemeMode,
  type ThemeMode,
} from "@/services/themeMode";

type RouteState = {
  screen: Screen;
  tab?: Tab;
  productId?: number;
  chatId?: number | null;
  chatDraftProductId?: number | null;
  themeMode?: ThemeMode;
  productListType?: "all" | "closing_soon" | "recent";
  category?: string | null;
  categoryId?: number | null;
  searchKeyword?: string | null;
};

const getFiniteId = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;

const buildUrl = (
  screen: Screen,
  {
    tab,
    productId,
    chatId,
    chatDraftProductId,
    themeMode,
    productListType,
    category,
    categoryId,
    searchKeyword,
    bidAmount,
  }: {
    tab: Tab;
    productId: number | null;
    chatId: number | null;
    chatDraftProductId: number | null;
    themeMode: ThemeMode;
    productListType: "all" | "closing_soon" | "recent";
    category: string | null;
    categoryId: number | null;
    searchKeyword: string | null;
    bidAmount?: number;
  },
) => {
  const safeProductId = getFiniteId(productId);
  const safeChatId = getFiniteId(chatId);
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }
  if (categoryId) {
    params.set("categoryId", String(categoryId));
  }
  if (searchKeyword) {
    params.set("keyword", searchKeyword);
  }

  switch (screen) {
    case "login":
      return "/login";
    case "signup":
      return "/signup";
    case "find_id":
      return "/find-id";
    case "find_password":
      return "/find-password";
    case "email_auth":
      return "/email-auth";
    case "terms":
      return "/terms";
    case "region_setup":
      return "/region-setup";
    case "profile_setup":
      return "/profile-setup";
    case "edit_profile":
      return "/mypage/edit-profile";
    case "edit_profile_region":
      return "/mypage/edit-profile/location";
    case "category_selection":
      return "/category-selection";
    case "category_reset":
      return "/category-selection?mode=edit";
    case "main":
      if (tab === "search") return "/search";
      if (tab === "register") return "/products/register";
      if (tab === "chat") return "/chats";
      if (tab === "mypage") return "/mypage";
      return "/home";
    case "product_list": {
      params.set("type", productListType);
      const query = params.toString();
      const path = themeMode === "auction" ? "/auctions" : "/products";
      return query ? `${path}?${query}` : path;
    }
    case "product_detail":
      return safeProductId
        ? `${themeMode === "auction" ? "/auctions" : "/products"}/${safeProductId}`
        : themeMode === "auction"
          ? "/auctions"
          : "/products";
    case "bidding_status":
      return safeProductId
        ? `/auctions/${safeProductId}/bidding-status`
        : "/auctions";
    case "payment":
      return safeProductId
        ? `/products/${safeProductId}/regular-payment`
        : "/products";
    case "receipt":
      return safeProductId ? `/products/${safeProductId}/receipt` : "/products";
    case "winning_bid_completion":
      return safeProductId
        ? `/auctions/${safeProductId}/winning-complete`
        : "/notifications";
    case "outbid_notification":
      return safeProductId ? `/auctions/${safeProductId}/outbid` : "/notifications";
    case "search_detail":
      return "/search/detail";
    case "wishlist":
      return "/wishlist";
    case "report":
      return safeProductId ? `/products/${safeProductId}/report` : "/products";
    case "regular_purchase":
      return safeProductId
        ? `/products/${safeProductId}/regular-purchase`
        : "/products";
    case "purchase_history":
      return "/mypage/purchase-history";
    case "sales_history":
      return "/mypage/sales-history";
    case "account_management":
      return "/mypage/account-management";
    case "notification_settings":
      return "/notifications/settings";
    case "notifications":
      return "/notifications";
    case "sales_management":
      return "/mypage/sales-management";
    case "my_bids":
      return "/mypage/my-bids";
    case "review":
      return "/mypage/review";
    case "write_review":
      return "/mypage/review/write";
    case "chat_room":
      if (safeChatId) return `/chats/${safeChatId}`;
      if (chatDraftProductId) return `/chats/new?productId=${chatDraftProductId}`;
      return "/chats";
    case "bid_placement_complete": {
      const query =
        typeof bidAmount === "number" && Number.isFinite(bidAmount)
          ? `?bidPrice=${bidAmount}`
          : "";
      return safeProductId ? `/auctions/${safeProductId}/bid-complete${query}` : "/auctions";
    }
    default:
      return "/";
  }
};

const routeStateFromUrl = (url: URL): RouteState | null => {
  const { pathname, searchParams } = url;
  const readId = (index: number) => {
    const value = Number(pathname.split("/")[index]);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  };

  if (pathname === "/" || pathname === "/home") {
    return { screen: "main", tab: "home" };
  }
  if (pathname === "/login") return { screen: "login" };
  if (pathname === "/signup") return { screen: "signup" };
  if (pathname === "/find-id") return { screen: "find_id" };
  if (pathname === "/find-password") return { screen: "find_password" };
  if (pathname === "/email-auth") return { screen: "email_auth" };
  if (pathname === "/terms") return { screen: "terms" };
  if (pathname === "/region-setup") return { screen: "region_setup" };
  if (pathname === "/profile-setup") return { screen: "profile_setup" };
  if (pathname === "/category-selection") {
    return {
      screen: searchParams.get("mode") === "edit" ? "category_reset" : "category_selection",
    };
  }
  if (pathname === "/search") return { screen: "main", tab: "search" };
  if (pathname === "/search/detail") return { screen: "search_detail" };
  if (pathname === "/wishlist") return { screen: "wishlist" };
  if (pathname === "/chats") return { screen: "main", tab: "chat" };
  if (pathname === "/chats/new") {
    const productId = Number(searchParams.get("productId"));
    return {
      screen: "chat_room",
      chatId: null,
      chatDraftProductId: Number.isFinite(productId) ? productId : null,
    };
  }
  if (/^\/chats\/\d+$/.test(pathname)) {
    return { screen: "chat_room", chatId: readId(2) };
  }
  if (pathname === "/notifications") return { screen: "notifications" };
  if (pathname === "/notifications/settings") {
    return { screen: "notification_settings" };
  }
  if (pathname === "/mypage") return { screen: "main", tab: "mypage" };
  if (pathname === "/mypage/edit-profile") return { screen: "edit_profile" };
  if (pathname === "/mypage/edit-profile/location") {
    return { screen: "edit_profile_region" };
  }
  if (pathname === "/mypage/account-management") {
    return { screen: "account_management" };
  }
  if (pathname === "/mypage/purchase-history") {
    return { screen: "purchase_history" };
  }
  if (pathname === "/mypage/sales-history") return { screen: "sales_history" };
  if (pathname === "/mypage/sales-management") {
    return { screen: "sales_management" };
  }
  if (pathname === "/mypage/my-bids") return { screen: "my_bids" };
  if (pathname === "/mypage/review") return { screen: "review" };
  if (pathname === "/mypage/review/write") return { screen: "write_review" };
  if (pathname === "/products/register") return { screen: "main", tab: "register" };
  if (pathname === "/products") {
    return {
      screen: "product_list",
      themeMode: "regular",
      productListType:
        searchParams.get("type") === "closing_soon" ||
        searchParams.get("type") === "recent"
          ? (searchParams.get("type") as "closing_soon" | "recent")
          : "all",
      category: searchParams.get("category"),
      categoryId: getFiniteId(Number(searchParams.get("categoryId"))),
      searchKeyword: searchParams.get("keyword"),
    };
  }
  if (/^\/products\/\d+\/report$/.test(pathname)) {
    return { screen: "report", productId: readId(2), themeMode: "regular" };
  }
  if (/^\/products\/\d+\/regular-payment$/.test(pathname)) {
    return { screen: "payment", productId: readId(2), themeMode: "regular" };
  }
  if (/^\/products\/\d+\/payment$/.test(pathname)) {
    return { screen: "payment", productId: readId(2), themeMode: "regular" };
  }
  if (/^\/products\/\d+\/receipt$/.test(pathname)) {
    return { screen: "receipt", productId: readId(2), themeMode: "regular" };
  }
  if (/^\/products\/\d+\/regular-purchase$/.test(pathname)) {
    return { screen: "regular_purchase", productId: readId(2), themeMode: "regular" };
  }
  if (/^\/products\/\d+$/.test(pathname)) {
    return { screen: "product_detail", productId: readId(2), themeMode: "regular" };
  }
  if (pathname === "/auctions") {
    return {
      screen: "product_list",
      themeMode: "auction",
      productListType:
        searchParams.get("type") === "closing_soon" ||
        searchParams.get("type") === "recent"
          ? (searchParams.get("type") as "closing_soon" | "recent")
          : "all",
      category: searchParams.get("category"),
      categoryId: getFiniteId(Number(searchParams.get("categoryId"))),
      searchKeyword: searchParams.get("keyword"),
    };
  }
  if (/^\/auctions\/\d+\/bidding-status$/.test(pathname)) {
    return { screen: "bidding_status", productId: readId(2), themeMode: "auction" };
  }
  if (/^\/auctions\/\d+\/bid-complete$/.test(pathname)) {
    return {
      screen: "bid_placement_complete",
      productId: readId(2),
      themeMode: "auction",
    };
  }
  if (/^\/auctions\/\d+\/winning-complete$/.test(pathname)) {
    return {
      screen: "winning_bid_completion",
      productId: readId(2),
      themeMode: "auction",
    };
  }
  if (/^\/auctions\/\d+\/outbid$/.test(pathname)) {
    return { screen: "outbid_notification", productId: readId(2), themeMode: "auction" };
  }
  if (/^\/auctions\/\d+$/.test(pathname)) {
    return { screen: "product_detail", productId: readId(2), themeMode: "auction" };
  }

  return null;
};

export default function App() {
  const router = useRouter();
  const isApplyingPopState = useRef(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [emailAuthMode, setEmailAuthMode] = useState<"signup" | "profile">(
    "signup",
  );
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedChatDraftProductId, setSelectedChatDraftProductId] = useState<
    number | null
  >(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredThemeMode);
  const [productListType, setProductListType] = useState<
    "all" | "closing_soon" | "recent"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedSearchKeyword, setSelectedSearchKeyword] = useState<
    string | null
  >(null);
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

  const applyRouteState = useCallback((routeState: RouteState) => {
    setCurrentScreen(routeState.screen);

    if (routeState.tab) {
      setCurrentTab(routeState.tab);
    }
    if (routeState.productId !== undefined) {
      setSelectedProductId(routeState.productId);
    }
    if (routeState.chatId !== undefined) {
      setSelectedChatId(routeState.chatId);
    }
    if (routeState.chatDraftProductId !== undefined) {
      setSelectedChatDraftProductId(routeState.chatDraftProductId);
    }
    if (routeState.themeMode) {
      setThemeMode(routeState.themeMode);
    }
    if (routeState.productListType) {
      setProductListType(routeState.productListType);
    }
    if (routeState.category !== undefined) {
      setSelectedCategory(routeState.category);
    }
    if (routeState.categoryId !== undefined) {
      setSelectedCategoryId(routeState.categoryId);
    }
    if (routeState.searchKeyword !== undefined) {
      setSelectedSearchKeyword(routeState.searchKeyword);
    }
  }, []);

  useEffect(() => {
    const routeState = routeStateFromUrl(new URL(window.location.href));

    if (routeState) {
      isApplyingPopState.current = true;
      applyRouteState(routeState);
    }

    const handlePopState = () => {
      const routeState = routeStateFromUrl(new URL(window.location.href));

      if (!routeState) {
        return;
      }

      isApplyingPopState.current = true;
      applyRouteState(routeState);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [applyRouteState]);

  useEffect(() => {
    writeStoredThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    const nextUrl = buildUrl(currentScreen, {
      tab: currentTab,
      productId:
        currentScreen === "bid_placement_complete"
          ? bidData?.productId ?? selectedProductId
          : selectedProductId,
      chatId: selectedChatId,
      chatDraftProductId: selectedChatDraftProductId,
      themeMode,
      productListType,
      category: selectedCategory,
      categoryId: selectedCategoryId,
      searchKeyword: selectedSearchKeyword,
      bidAmount: bidData?.bidAmount,
    });
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (nextUrl === currentUrl) {
      isApplyingPopState.current = false;
      return;
    }

    if (isApplyingPopState.current) {
      isApplyingPopState.current = false;
      return;
    }

    window.history.pushState(null, "", nextUrl);
  }, [
    bidData,
    currentScreen,
    currentTab,
    productListType,
    selectedCategory,
    selectedCategoryId,
    selectedSearchKeyword,
    selectedChatDraftProductId,
    selectedChatId,
    selectedProductId,
    themeMode,
  ]);

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    navigateTo("main");
  };

  const navigateToProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  const navigateToCatalogItem = (id: number) => {
    router.push(themeMode === "auction" ? `/auctions/${id}` : `/products/${id}`);
  };

  const openProductChat = async () => {
    if (selectedProductId == null) {
      return;
    }

    try {
      const chatProductId =
        themeMode === "auction"
          ? (await fetchAuctionDetail(selectedProductId)).productId
          : selectedProductId;
      const existingRoom = await findExistingChatRoomByProductId(chatProductId);

      setSelectedChatId(existingRoom?.roomId ?? null);
      setSelectedChatDraftProductId(existingRoom ? null : chatProductId);
      navigateTo("chat_room");
    } catch (error) {
      showToast(getErrorMessage(error, "채팅방을 열지 못했습니다."));
    }
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
        <div className="w-full max-w-180 mx-auto bg-white overflow-hidden relative flex flex-col shrink-0">
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
                onTabChange={handleTabChange}
                onProductClick={navigateToCatalogItem}
                onProductListClick={(type, category) => {
                  setProductListType(type);
                  setSelectedSearchKeyword(null);
                  if (typeof category === "object" && category !== null) {
                    setSelectedCategory(category.name);
                    setSelectedCategoryId(category.id);
                  } else {
                    setSelectedCategory(category || null);
                    setSelectedCategoryId(null);
                  }
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
                  setSelectedCategoryId(null);
                  setSelectedSearchKeyword(null);
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
                onAuctionClick={(id) => router.push(`/auctions/${id}`)}
                themeColor={themeColor}
              />
            )}
            {currentScreen === "search_detail" && (
              <SearchDetailScreen
                key="search_detail"
                onBack={() => navigateTo("main")}
                onSearch={(keyword) => {
                  setProductListType("all");
                  setSelectedSearchKeyword(keyword);
                  setSelectedCategory(null);
                  setSelectedCategoryId(null);
                  navigateTo("product_list");
                }}
                themeColor={themeColor}
                initialCategory={
                  selectedCategory && selectedCategoryId
                    ? { id: selectedCategoryId, name: selectedCategory }
                    : null
                }
              />
            )}
            {currentScreen === "product_list" && (
              <ProductListScreen
                key="product_list"
                listType={productListType}
                categoryId={selectedCategoryId}
                categoryName={selectedCategory}
                searchKeyword={selectedSearchKeyword}
                onBack={() => {
                  setSelectedCategory(null);
                  setSelectedCategoryId(null);
                  setSelectedSearchKeyword(null);
                  navigateTo("main");
                }}
                onProductClick={navigateToProduct}
                onAuctionClick={(id) => router.push(`/auctions/${id}`)}
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
                onProductClick={(auctionId) => {
                  setThemeMode("auction");
                  setSelectedProductId(auctionId);
                  navigateTo("product_detail");
                }}
                themeColor={themeColor}
                showToast={showToast}
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
                purchaseId={null}
                onBack={() => navigateTo("main")}
                themeColor="#F64257"
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
                productId={selectedProductId}
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
    </EventStreamProvider>
  );
}

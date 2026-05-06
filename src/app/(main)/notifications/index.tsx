"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import {
  Bell,
  ChevronLeft,
  Loader2,
  Package,
  ShieldCheck,
  Trash2,
  Trophy,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notifications/api";
import type {
  NotificationResponse,
  NotificationType,
} from "@/services/notifications/types";

type NotificationFilter = "ALL" | NotificationType;

const FILTERS: Array<{ label: string; value: NotificationFilter }> = [
  { label: "전체", value: "ALL" },
  { label: "상품", value: "PRODUCT" },
  { label: "거래", value: "TRADE" },
  { label: "경매", value: "AUCTION" },
  { label: "지갑", value: "WALLET" },
  { label: "공지", value: "SYSTEM" },
];

function toTimeLabel(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minute = Math.floor(diffMs / (1000 * 60));
  const hour = Math.floor(diffMs / (1000 * 60 * 60));
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minute < 1) return "방금 전";
  if (minute < 60) return `${minute}분 전`;
  if (hour < 24) return `${hour}시간 전`;
  if (day < 7) return `${day}일 전`;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getTypeIcon(type: NotificationType) {
  switch (type) {
    case "PRODUCT":
      return Package;
    case "TRADE":
      return ShieldCheck;
    case "AUCTION":
      return Trophy;
    case "WALLET":
      return Wallet;
    case "SYSTEM":
    default:
      return Bell;
  }
}

export default function NotificationScreen({
  onBack,
  onProductClick,
  onAuctionClick,
  onTargetUrl,
  themeColor,
}: {
  onBack: () => void;
  onProductClick: (id: number) => void;
  onAuctionClick?: (id: number) => void;
  onTargetUrl?: (url: string) => void;
  themeColor: string;
  key?: string;
}) {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("ALL");
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const touchStartYRef = useRef<number | null>(null);

  const loadNotifications = useCallback(
    async ({ nextPage = 0, append = false, refreshing = false } = {}) => {
      try {
        if (refreshing) {
          setIsRefreshing(true);
        } else if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setErrorMessage("");

        const [listResponse, unreadResponse] = await Promise.all([
          getNotifications(nextPage, 20),
          getUnreadNotificationCount(),
        ]);

        setNotifications((prev) =>
          append ? [...prev, ...listResponse.content] : listResponse.content,
        );
        setUnreadCount(unreadResponse.count);
        setPage(listResponse.page);
        setHasNext(listResponse.hasNext);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "알림을 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "ALL") return notifications;
    return notifications.filter((notification) => notification.type === activeFilter);
  }, [activeFilter, notifications]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.currentTarget.scrollTop > 0) {
      touchStartYRef.current = null;
      return;
    }
    touchStartYRef.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;

    const distance = event.changedTouches[0].clientY - touchStartYRef.current;
    touchStartYRef.current = null;

    if (distance > 70 && !isRefreshing && !isLoading) {
      loadNotifications({ refreshing: true });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "전체 읽음 처리에 실패했습니다."));
    }
  };

  const handleNotificationClick = async (notification: NotificationResponse) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.notificationId);
        setNotifications((prev) =>
          prev.map((item) =>
            item.notificationId === notification.notificationId
              ? { ...item, read: true, readAt: new Date().toISOString() }
              : item,
          ),
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "알림 읽음 처리에 실패했습니다."));
        return;
      }
    }

    const targetUrl = notification.targetUrl?.trim();
    if (targetUrl) {
      if (onTargetUrl) {
        onTargetUrl(targetUrl);
      } else {
        window.location.assign(targetUrl);
      }
      return;
    }

    if (!notification.targetId) return;

    const targetType = notification.targetType?.trim().toUpperCase();
    if (targetType === "AUCTION") {
      if (onAuctionClick) {
        onAuctionClick(notification.targetId);
        return;
      }
      onProductClick(notification.targetId);
      return;
    }

    if (targetType === "PRODUCT" || notification.type === "PRODUCT") {
      onProductClick(notification.targetId);
    }
  };

  const handleDelete = async (
    event: MouseEvent<HTMLButtonElement>,
    notification: NotificationResponse,
  ) => {
    event.stopPropagation();

    try {
      await deleteNotification(notification.notificationId);
      setNotifications((prev) =>
        prev.filter((item) => item.notificationId !== notification.notificationId),
      );
      if (!notification.read) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "알림 삭제에 실패했습니다."));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100 shrink-0">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 text-center">
          <h1 className="font-bold text-lg">알림</h1>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors px-2 disabled:text-gray-200"
        >
          모두 읽음
        </button>
      </div>

      <div className="flex space-x-2 px-6 py-4 border-b border-gray-50 overflow-x-auto no-scrollbar shrink-0">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className="px-4 py-2 rounded-full text-xs font-bold transition-colors shrink-0"
            style={{
              backgroundColor: activeFilter === filter.value ? themeColor : "#F3F4F6",
              color: activeFilter === filter.value ? "black" : "#9CA3AF",
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
          {errorMessage}
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isRefreshing && (
          <div className="flex items-center justify-center py-3 text-[11px] font-medium text-gray-400">
            업데이트 중
          </div>
        )}

        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm font-medium">알림을 불러오는 중입니다.</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <Bell size={30} />
            </div>
            <p className="text-sm font-medium">표시할 알림이 없습니다.</p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => {
              const Icon = getTypeIcon(notification.type);
              return (
                <div
                  key={notification.notificationId}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-6 py-5 border-b border-gray-50 flex space-x-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    notification.read ? "bg-white" : "bg-red-50/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      notification.read
                        ? "bg-gray-100 text-gray-400"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-bold leading-snug">
                        {notification.title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notification.read && (
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        )}
                        <button
                          onClick={(event) => handleDelete(event, notification)}
                          className="p-1 rounded-full text-gray-300 hover:bg-gray-100 hover:text-gray-500"
                          aria-label="알림 삭제"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed break-words">
                      {notification.content}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {toTimeLabel(notification.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}

            {hasNext && activeFilter === "ALL" && (
              <div className="px-6 py-4">
                <button
                  onClick={() =>
                    loadNotifications({ nextPage: page + 1, append: true })
                  }
                  disabled={isLoadingMore}
                  className="w-full h-11 rounded-lg bg-gray-50 text-sm font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-60"
                >
                  {isLoadingMore ? "불러오는 중" : "더보기"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

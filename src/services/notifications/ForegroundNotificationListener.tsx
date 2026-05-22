"use client";

import { useEffect } from "react";

import { getAuthorizationHeaders, getAuthToken } from "@/services/auth/service";
import { registerFcmToken } from "./api";
import { listenForegroundFcmMessages } from "./firebase";
import { requestFcmToken } from "./firebase";

const FCM_TOKEN_STORAGE_KEY = "dealit:fcm-token";
const AUTH_TOKEN_CHANGED_EVENT = "dealit:auth-token-changed";

function appendReauctionPrompt(targetUrl: string) {
  const url = new URL(targetUrl, window.location.origin);
  url.searchParams.set("reauctionPrompt", "1");
  return `${url.pathname}${url.search}${url.hash}`;
}

function resolvePayloadTargetUrl(payload: { data?: Record<string, string>; fcmOptions?: { link?: string } }) {
  const data = payload.data || {};
  const isNoBidAuctionNotification = data.type === "AUCTION_NO_BID";

  if (data.targetUrl) {
    return isNoBidAuctionNotification
      ? appendReauctionPrompt(data.targetUrl)
      : data.targetUrl;
  }
  if (payload.fcmOptions?.link) {
    return isNoBidAuctionNotification
      ? appendReauctionPrompt(payload.fcmOptions.link)
      : payload.fcmOptions.link;
  }
  if (data.roomId) return `/chats/${data.roomId}`;
  if (data.productId) return `/products/${data.productId}`;
  if (data.auctionId) {
    const targetUrl = `/auctions/${data.auctionId}`;
    return isNoBidAuctionNotification
      ? appendReauctionPrompt(targetUrl)
      : targetUrl;
  }

  return "/";
}

function openNotificationTarget(targetUrl: string) {
  window.location.assign(new URL(targetUrl, window.location.origin).href);
}

function shouldSuppressForegroundNotification(payload: {
  data?: Record<string, string>;
}) {
  const data = payload.data || {};
  if (data.type !== "CHAT_MESSAGE") {
    return false;
  }

  const pathname = window.location.pathname;
  if (pathname === "/chats") {
    return true;
  }

  return Boolean(data.roomId && pathname === `/chats/${data.roomId}`);
}

export function ForegroundNotificationListener() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const syncGrantedFcmToken = async () => {
      if (
        typeof window === "undefined" ||
        !("Notification" in window) ||
        Notification.permission !== "granted" ||
        !getAuthToken()
      ) {
        return;
      }

      const token = await requestFcmToken();
      if (!token || cancelled) {
        return;
      }

      await registerFcmToken(
        {
          token,
          platform: "web",
        },
        getAuthorizationHeaders(),
      );
      window.localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
    };

    syncGrantedFcmToken().catch((error) => {
      console.warn("FCM token sync failed:", error);
    });
    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, syncGrantedFcmToken);

    listenForegroundFcmMessages((payload) => {
      console.log("foreground FCM message received:", payload);

      if (shouldSuppressForegroundNotification(payload)) {
        return;
      }

      if (Notification.permission !== "granted") {
        return;
      }

      const title = payload.notification?.title || "Dealit";
      const body = payload.notification?.body || "";
      const options: NotificationOptions = {
        body,
        icon: "/dealit-logo.svg",
        badge: "/dealit-logo.svg",
        data: payload.data || {},
      };

      navigator.serviceWorker.ready
        .then((registration) => {
          registration.showNotification(title, options);
        })
        .catch(() => {
          const notification = new Notification(title, options);
          notification.onclick = () => {
            notification.close();
            openNotificationTarget(resolvePayloadTargetUrl(payload));
          };
        });
    })
      .then((nextUnsubscribe) => {
        if (cancelled) {
          nextUnsubscribe();
          return;
        }

        unsubscribe = nextUnsubscribe;
      })
      .catch((error) => {
        console.warn("foreground FCM listener failed:", error);
      });

    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, syncGrantedFcmToken);
      unsubscribe?.();
    };
  }, []);

  return null;
}

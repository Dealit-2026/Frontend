"use client";

import { useEffect } from "react";

import { getAuthorizationHeaders, getAuthToken } from "@/services/auth/service";
import { registerFcmToken } from "./api";
import { listenForegroundFcmMessages } from "./firebase";
import { requestFcmToken } from "./firebase";

const FCM_TOKEN_STORAGE_KEY = "dealit:fcm-token";
const AUTH_TOKEN_CHANGED_EVENT = "dealit:auth-token-changed";

function resolveNotificationUrl(data: Record<string, string> = {}) {
  if (data.targetUrl) return data.targetUrl;
  if (data.type === "CHAT_MESSAGE" && data.roomId) return `/chats/${data.roomId}`;
  if (data.type === "WISHLIST_ADDED" && data.productId) {
    return `/products/${data.productId}`;
  }
  if (data.productId) return `/products/${data.productId}`;
  if (data.auctionId) return `/auctions/${data.auctionId}`;
  return "/";
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

      if (Notification.permission !== "granted") {
        return;
      }

      const title = payload.notification?.title || "Dealit";
      const body = payload.notification?.body || "";
      const data = payload.data || {};
      const options: NotificationOptions = {
        body,
        icon: "/dealit-logo.svg",
        badge: "/dealit-logo.svg",
        data: {
          ...data,
          targetUrl: resolveNotificationUrl(data),
        },
      };

      navigator.serviceWorker.ready
        .then((registration) => {
          registration.showNotification(title, options);
        })
        .catch(() => {
          new Notification(title, options);
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

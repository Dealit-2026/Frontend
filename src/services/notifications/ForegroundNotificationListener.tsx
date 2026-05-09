"use client";

import { useEffect } from "react";

import { listenForegroundFcmMessages } from "./firebase";

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
      unsubscribe?.();
    };
  }, []);

  return null;
}

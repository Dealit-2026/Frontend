"use client";

import { useEffect } from "react";

import { listenForegroundFcmMessages } from "./firebase";

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
      const options: NotificationOptions = {
        body,
        icon: "/favicon.ico",
        data: payload.data || {},
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

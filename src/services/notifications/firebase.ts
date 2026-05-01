"use client";

import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function getFirebaseApp() {
  return getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
}

export async function requestFcmToken() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return null;
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!vapidKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_VAPID_KEY is not configured.");
  }

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  const messaging = getMessaging(getFirebaseApp());

  return getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
}

export async function listenForegroundFcmMessages(
  onReceive: (payload: MessagePayload) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const supported = await isSupported();

  if (!supported) {
    return () => {};
  }

  const messaging = getMessaging(getFirebaseApp());

  return onMessage(messaging, onReceive);
}

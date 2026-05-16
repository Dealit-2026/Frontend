importScripts("https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCnWnouiCeUCwgkFaTHxnEGbeJdF_fUlk4",
  authDomain: "dealit-f6b55.firebaseapp.com",
  projectId: "dealit-f6b55",
  storageBucket: "dealit-f6b55.firebasestorage.app",
  messagingSenderId: "1086754502691",
  appId: "1:1086754502691:web:0b183683b6a83cba789996",
  measurementId: "G-ZFQ62JGYVM",
});

const messaging = firebase.messaging();

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function resolveNotificationTargetUrl(notification) {
  const data = notification.data || {};
  const fcmMessage = data.FCM_MSG || {};
  const fcmData = fcmMessage.data || {};
  const fcmOptions = fcmMessage.fcmOptions || fcmMessage.webpush?.fcmOptions || {};
  const pushType = data.type || fcmData.type;
  const isNoBidAuctionNotification = pushType === "AUCTION_NO_BID";

  const appendReauctionPrompt = (targetUrl) => {
    const url = new URL(targetUrl, self.location.origin);
    url.searchParams.set("reauctionPrompt", "1");
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const targetUrl =
    data.targetUrl ||
    fcmData.targetUrl ||
    fcmOptions.link ||
    data.click_action ||
    fcmData.click_action;

  if (targetUrl) {
    return isNoBidAuctionNotification
      ? appendReauctionPrompt(targetUrl)
      : targetUrl;
  }

  const roomId = data.roomId || fcmData.roomId;
  if (roomId) {
    return `/chats/${roomId}`;
  }

  const productId = data.productId || fcmData.productId;
  if (productId) {
    return `/products/${productId}`;
  }

  const auctionId = data.auctionId || fcmData.auctionId;
  if (auctionId) {
    const auctionTargetUrl = `/auctions/${auctionId}`;
    return isNoBidAuctionNotification
      ? appendReauctionPrompt(auctionTargetUrl)
      : auctionTargetUrl;
  }

  return "/";
}

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const title = notification.title || "Dealit";
  const options = {
    body: notification.body || "",
    icon: "/dealit-logo.svg",
    badge: "/dealit-logo.svg",
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = resolveNotificationTargetUrl(event.notification);
  const url = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            if ("navigate" in client) {
              return client.navigate(url).then((navigatedClient) => {
                return navigatedClient ? navigatedClient.focus() : client.focus();
              });
            }

            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }

        return undefined;
      })
  );
});

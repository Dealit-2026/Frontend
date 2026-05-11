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

function resolveNotificationUrl(data = {}) {
  if (data.targetUrl) return data.targetUrl;
  if (data.type === "CHAT_MESSAGE" && data.roomId) return `/chats/${data.roomId}`;
  if (data.type === "WISHLIST_ADDED" && data.productId) {
    return `/products/${data.productId}`;
  }
  if (data.productId) return `/products/${data.productId}`;
  if (data.auctionId) return `/auctions/${data.auctionId}`;
  return "/";
}

function toSameOriginUrl(url) {
  try {
    return new URL(url, self.location.origin).href;
  } catch {
    return self.location.origin;
  }
}

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};
  const title = notification.title || "Dealit";
  const options = {
    body: notification.body || "",
    icon: "/dealit-logo.svg",
    badge: "/dealit-logo.svg",
    data: {
      ...data,
      targetUrl: resolveNotificationUrl(data),
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = toSameOriginUrl(event.notification.data?.targetUrl || "/");

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const targetPath = new URL(targetUrl).pathname;
        const focusedClient = clientList.find(
          (client) => new URL(client.url).pathname === targetPath,
        );

        if (focusedClient) {
          return focusedClient.focus();
        }

        return clients.openWindow(targetUrl);
      }),
  );
});

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

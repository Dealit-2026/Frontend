/*
"use client";

import { useRouter } from "next/navigation";

import ChatListScreen from "./index";

export default function ChatsPage() {
  const router = useRouter();

  return (
    <ChatListScreen
      themeColor="#98E446"
      onChatClick={(id) => router.push(`/chats/${id}`)}
    />
  );
}
*/
"use client";

import { useRouter } from "next/navigation";
import ChatListScreen from "./index";

export default function ChatsPage() {
  const router = useRouter();

  return (
    <ChatListScreen
      themeColor="#98E446"
      onChatClick={(id) => router.push(`/chats/${id}`)}
    />
  );
}

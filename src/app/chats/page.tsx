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
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function ChatsPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="chat" activeColor="#98E446">
      <ChatListScreen
        themeColor="#98E446"
        onChatClick={(id) => router.push(`/chats/${id}`)}
      />
    </RouteTabShell>
  );
}

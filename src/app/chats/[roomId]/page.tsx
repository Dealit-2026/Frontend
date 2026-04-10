/*
"use client";

import { useParams, useRouter } from "next/navigation";

import ChatRoomScreen from "./index";

export default function ChatRoomPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const roomId = Number(params.roomId) || 1;

  return (
    <ChatRoomScreen
      chatId={roomId}
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      themeColor="#98E446"
    />
  );
}
*/

"use client";

import { useParams, useRouter } from "next/navigation";
import ChatRoomScreen from "./index";

export default function ChatRoomPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const roomId = Number(params.roomId) || 1;

  return (
    <ChatRoomScreen
      chatId={roomId}
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      themeColor="#98E446"
    />
  );
}

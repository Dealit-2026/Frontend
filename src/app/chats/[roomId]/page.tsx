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

import { notFound } from "next/navigation";
import ChatRoomScreen from "./index";

interface ChatRoomPageProps {
  params: {
    roomId: string;
  };
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const parsedRoomId = Number(params.roomId);

  if (!Number.isInteger(parsedRoomId) || parsedRoomId <= 0) {
    notFound();
  }

  return (
    <ChatRoomScreen
      chatId={parsedRoomId}
      themeColor="#98E446"
    />
  );
}

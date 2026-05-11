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
  params: Promise<{
    roomId: string;
  }>;
  searchParams?: Promise<{
    purchaseId?: string;
  }>;
}

export default async function ChatRoomPage({
  params,
  searchParams,
}: ChatRoomPageProps) {
  const { roomId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parsedRoomId = Number(roomId);
  const parsedPurchaseId = resolvedSearchParams?.purchaseId
    ? Number(resolvedSearchParams.purchaseId)
    : null;

  if (!Number.isInteger(parsedRoomId) || parsedRoomId <= 0) {
    notFound();
  }

  return (
    <ChatRoomScreen
      chatId={parsedRoomId}
      purchaseId={
        parsedPurchaseId &&
        Number.isInteger(parsedPurchaseId) &&
        parsedPurchaseId > 0
          ? parsedPurchaseId
          : null
      }
      themeColor="#98E446"
    />
  );
}

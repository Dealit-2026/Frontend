"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ChatRoomScreen from "../[roomId]/index";

function NewChatRoomPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("productId"));
  const parsedProductId =
    Number.isInteger(productId) && productId > 0 ? productId : null;

  return (
    <ChatRoomScreen
      chatId={null}
      draftProductId={parsedProductId}
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      themeColor="#98E446"
    />
  );
}

export default function NewChatRoomPage() {
  return (
    <Suspense fallback={null}>
      <NewChatRoomPageContent />
    </Suspense>
  );
}

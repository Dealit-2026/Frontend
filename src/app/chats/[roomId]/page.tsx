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

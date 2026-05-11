"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, PlusCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import {
  createChatRoom,
  fetchChatMessages,
  markChatRoomAsRead,
  sendChatMessage,
  fetchChatRoomTradeInfo,
} from "../../../services/chats/service";
import type {
  ChatMessageVM,
  ActionButton,
} from "../../../services/chats/types";
import { ApiRequestError } from "@/services/apiError";
import {
  markPurchaseReceived,
  markPurchaseShipped,
} from "@/services/product/purchase/service";

interface ChatRoomScreenProps {
  chatId: number | null;
  draftProductId?: number | null;
  purchaseId?: number | null;
  onBack?: () => void;
  onProductClick?: (id: number) => void;
  themeColor: string;
}

export default function ChatRoomScreen({
  chatId,
  draftProductId = null,
  purchaseId: _purchaseId = null,
  onBack,
  onProductClick,
  themeColor,
}: ChatRoomScreenProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [productId, setProductId] = useState<number>(0);
  const [productName, setProductName] = useState("");
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessageVM[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [roomPurchaseId, setRoomPurchaseId] = useState<number | null>(null);
  const [actionButton, setActionButton] = useState<ActionButton | null>(null);
  const [tradeActionLoading, setTradeActionLoading] = useState(false);
  const [tradeActionMessage, setTradeActionMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const roomId = chatId;
    if (roomId == null) {
      setIsLoading(false);
      setIsError(false);
      setRoomName("채팅방");
      setProductId(draftProductId ?? 0);
      setProductName(draftProductId ? `상품 #${draftProductId}` : "상품 정보");
      setProductImageUrl(null);
      setMessages([]);
      return;
    }

    let mounted = true;

    async function loadDetail() {
      try {
        setIsLoading(true);
        setIsError(false);

        const detail = await fetchChatMessages({
          roomId: roomId as number,
          page: 0,
          size: 30,
        });

        if (!mounted) return;

        setRoomName(detail.room.opponentName);
        setProductId(detail.room.productId);
        setProductName(detail.room.productName);
        setProductImageUrl(detail.room.productImageUrl);
        setMessages(detail.messages);

        // 읽음 처리 (실패해도 상세 렌더링은 유지)
        markChatRoomAsRead(roomId as number).catch((err: unknown) => {
          console.warn("markChatRoomAsRead failed:", err);
        });
      } catch (error) {
        console.error("Failed to load chat room detail:", error);
        if (!mounted) return;
        setIsError(true);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    }

    loadDetail();

    return () => {
      mounted = false;
    };
  }, [chatId, draftProductId]);

  useEffect(() => {
    const roomId = chatId;
    if (roomId == null) {
      setRoomPurchaseId(null);
      setActionButton(null);
      return;
    }

    let mounted = true;

    async function loadTradeInfo() {
      try {
        const data = await fetchChatRoomTradeInfo(roomId as number);
        if (!mounted) return;
        setRoomPurchaseId(data.purchaseId ?? null);
        setActionButton(data.actionButton);
      } catch (error) {
        console.warn("Failed to load chat room trade info:", error);
        if (!mounted) return;
        setRoomPurchaseId(null);
        setActionButton(null);
      }
    }

    void loadTradeInfo();

    return () => {
      mounted = false;
    };
  }, [chatId]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
    );
  }, [messages]);

  const messageTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    [],
  );

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handleProductClick = (id: number) => {
    if (onProductClick) {
      onProductClick(id);
      return;
    }
    router.push(`/products/${id}`);
  };

  const getTradeActionErrorMessage = (code: string | null) => {
    if (code === "PURCHASE_NOT_COMPLETABLE") {
      return "현재 상태에서 처리할 수 없습니다.";
    }
    if (code === "PURCHASE_FORBIDDEN") {
      return "본인만 처리할 수 있습니다.";
    }
    if (code === "PURCHASE_NOT_FOUND") {
      return "구매 내역이 존재하지 않습니다.";
    }
    if (code === "TOKEN_EXPIRED" || code === "INVALID_TOKEN") {
      return "로그인이 만료되었습니다. 다시 로그인해 주세요.";
    }
    if (code === "INVALID_REQUEST" || code === "VALIDATION_ERROR") {
      return "요청 값이 올바르지 않습니다.";
    }

    return null;
  };

  const handleTradeAction = async () => {
    if (
      !roomPurchaseId ||
      !actionButton ||
      !actionButton.enabled ||
      tradeActionLoading
    )
      return;

    try {
      setTradeActionLoading(true);
      setTradeActionMessage(null);

      if (actionButton.actionType === "SELLER_CONFIRM") {
        await markPurchaseShipped(roomPurchaseId);
      } else if (actionButton.actionType === "BUYER_CONFIRM") {
        await markPurchaseReceived(roomPurchaseId);
      }

      // 거래 정보 새로고침
      const roomId = chatId;
      if (roomId) {
        const data = await fetchChatRoomTradeInfo(roomId as number);
        setActionButton(data.actionButton);
      }

      const successMsg =
        actionButton.actionType === "SELLER_CONFIRM"
          ? "발송 처리가 완료되었습니다."
          : "수령 확정이 완료되었습니다.";
      setTradeActionMessage(successMsg);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof ApiRequestError) {
        setTradeActionMessage(
          getTradeActionErrorMessage(error.code) ?? error.message,
        );
      } else {
        setTradeActionMessage(
          error instanceof Error ? error.message : "거래 처리에 실패했습니다.",
        );
      }
    } finally {
      setTradeActionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    let roomId = chatId;
    const content = draftMessage.trim();

    if (!content || isSending) return;
    if (roomId == null && !draftProductId) return;

    try {
      setIsSending(true);
      setSendError(null);

      if (roomId == null && draftProductId) {
        const room = await createChatRoom({ productId: draftProductId });
        roomId = room.roomId;
        setRoomName(
          room.participants.find((participant) => participant.role === "SELLER")
            ?.nickname ?? "채팅방",
        );
        setProductId(room.product.productId);
        setProductName(room.product.name ?? `상품 #${room.product.productId}`);
        setProductImageUrl(room.product.thumbnailUrl ?? null);
      }

      if (roomId == null) return;

      const response = await sendChatMessage(roomId, {
        messageType: "TEXT",
        content,
      });

      const nextMessage: ChatMessageVM = {
        messageId: response.messageId,
        senderId: response.senderId,
        senderNickname: "나",
        senderType: "ME",
        messageType: response.messageType,
        content: response.content,
        isRead: response.isRead,
        sentAt: response.sentAt,
      };

      setMessages((prev) => [...prev, nextMessage]);
      setDraftMessage("");

      if (chatId == null) {
        router.replace(`/chats/${roomId}`);
      }
    } catch (error) {
      console.error("Failed to send chat message:", error);
      setSendError("메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={handleBack} className="p-2" aria-label="뒤로가기">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">
          {roomName || "채팅방"}
        </h1>
      </div>

      <div
        className="p-4 border-b border-gray-50 flex items-center space-x-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => productId && handleProductClick(productId)}
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {productImageUrl ? (
            <img
              src={productImageUrl}
              alt={productName || "Product"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
              이미지
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">
            {productName || "상품 정보"}
          </p>
          <p className="text-[10px] font-bold" style={{ color: themeColor }}>
            거래 중
          </p>
        </div>
        <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold shrink-0">
          상세보기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
        {actionButton && (
          <div className="sticky top-0 z-10 -mx-6 px-6 pt-0 pb-3 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
            {tradeActionMessage && (
              <p className="mb-2 px-1 text-xs text-gray-500">
                {tradeActionMessage}
              </p>
            )}
            <button
              onClick={() => void handleTradeAction()}
              disabled={
                tradeActionLoading || !actionButton.enabled || !roomPurchaseId
              }
              className="w-full h-12 rounded-xl font-bold text-sm border border-gray-200 bg-black text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
            >
              {tradeActionLoading ? "처리 중..." : actionButton.label}
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            채팅방 정보를 불러오는 중...
          </div>
        ) : isError ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-sm text-gray-400">
            <p>채팅방 정보를 불러오지 못했습니다.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              다시 시도
            </button>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            아직 메시지가 없습니다.
          </div>
        ) : (
          sortedMessages.map((msg) => {
            const isMine = msg.senderType === "ME";

            return (
              <div
                key={msg.messageId}
                className={`flex items-end ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-60 p-3 rounded-2xl text-sm ${
                    isMine
                      ? "bg-black text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-900 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap wrap-break-word">
                    {msg.content}
                  </p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMine ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {messageTimeFormatter.format(new Date(msg.sentAt))}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center space-x-3">
        <button className="p-2 bg-gray-50 rounded-xl">
          <PlusCircle size={24} className="text-gray-400" />
        </button>
        <div className="flex-1 h-12 bg-gray-50 rounded-2xl px-4 flex items-center">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-transparent outline-none text-sm"
            value={draftMessage}
            onChange={(e) => {
              setDraftMessage(e.target.value);
              if (sendError) setSendError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleSendMessage();
              }
            }}
            disabled={isSending || (chatId == null && !draftProductId)}
          />
        </div>
        <button
          className="p-3 bg-black text-white rounded-xl disabled:opacity-50"
          disabled={
            isSending ||
            (chatId == null && !draftProductId) ||
            draftMessage.trim().length === 0
          }
          onClick={() => void handleSendMessage()}
          aria-label="메시지 전송"
        >
          <Send size={20} />
        </button>
      </div>
      {sendError && (
        <div className="px-4 pb-3 text-xs text-red-500">{sendError}</div>
      )}
    </motion.div>
  );
}

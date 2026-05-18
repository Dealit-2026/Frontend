"use client";

import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import Toast from "@/components/common/Toast";
import AuctionDetailScreen from "./index";
import { findExistingChatRoomByProductId } from "@/services/chats/service";
import { fetchAuctionDetail } from "@/services/auction/detail/service";
import { EventStreamProvider } from "@/services/events/EventStreamProvider";

type BidCompleteData = {
  bidAmount: number;
};

export default function AuctionDetailPage() {
  const params = useParams<{ auctionId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionId = Number(params.auctionId) || 1;
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [showReauctionPrompt, setShowReauctionPrompt] = useState(
    () => searchParams.get("reauctionPrompt") === "1",
  );
  const [toast, setToast] = useState({ message: "", visible: false });

  useEffect(() => {
    if (searchParams.get("reauctionPrompt") === "1") {
      setShowReauctionPrompt(true);
    }
  }, [searchParams]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const handleChatClick = async () => {
    if (isOpeningChat) {
      return;
    }

    try {
      setIsOpeningChat(true);
      const auction = await fetchAuctionDetail(auctionId);
      const productId = auction.productId;
      const existingRoom = await findExistingChatRoomByProductId(productId);

      if (existingRoom) {
        router.push(`/chats/${existingRoom.roomId}`);
        return;
      }

      router.push(`/chats/new?productId=${productId}`);
    } catch (err) {
      console.error("Failed to open auction chat:", err);
    } finally {
      setIsOpeningChat(false);
    }
  };

  return (
    <>
      <EventStreamProvider enabled>
        <AuctionDetailScreen
          productId={auctionId}
          onBack={() => router.back()}
          onBidStatusClick={() =>
            router.push(`/auctions/${auctionId}/bidding-status`)
          }
          onChatClick={handleChatClick}
          onReportClick={() => router.push(`/products/${auctionId}/report`)}
          onPurchaseClick={() => router.push(`/products/${auctionId}/payment`)}
          onBidComplete={(data: BidCompleteData) => {
            router.replace(
              `/auctions/${auctionId}/bid-complete?bidPrice=${data.bidAmount}`,
            );
          }}
          themeColor="#F64257"
          mode="auction"
          showToast={showToast}
        />
        {showReauctionPrompt && (
          <div className="fixed inset-0 z-[100] flex justify-center bg-white text-[#17181d]">
            <div className="flex h-full w-full max-w-[430px] flex-col px-7 pb-8 pt-5">
              <div className="flex h-14 items-center justify-between">
                <button
                  onClick={() => {
                    router.back();
                  }}
                  className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-[#17181d]"
                  aria-label="뒤로가기"
                >
                  <ChevronLeft size={34} strokeWidth={2.4} />
                </button>
                <div className="h-11 w-11" />
              </div>

              <div className="mt-7 space-y-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h2 className="whitespace-nowrap text-[clamp(22px,6vw,28px)] font-black leading-tight tracking-[-0.02em] text-[#17181d]">
                      유찰된 경매를 다시 올려볼까요?
                    </h2>
                    <p className="text-base font-bold leading-relaxed text-gray-500">
                      지금 선택하면 게시글을 수정하거나 그대로 다시 준비할 수 있어요.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full rounded-2xl bg-gray-100 p-4 text-left transition-colors hover:bg-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-xs font-bold text-gray-500">
                      유찰
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold text-[#17181d]">
                        유찰된 경매 #{auctionId}
                      </p>
                      <p className="mt-1 text-xl font-black text-[#17181d]">
                        재경매 대기
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => {}}
                    className="h-14 rounded-2xl bg-gray-100 text-sm font-black text-[#17181d] transition-colors hover:bg-gray-200"
                  >
                    그대로 올리기
                  </button>
                  <button
                    onClick={() => {}}
                    className="h-14 rounded-2xl bg-[#F64257] text-sm font-black text-white transition-opacity hover:opacity-90"
                  >
                    게시글 수정하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </EventStreamProvider>
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}

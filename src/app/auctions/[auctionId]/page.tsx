"use client";

import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import Toast from "@/components/common/Toast";
import AuctionDetailScreen from "./index";
import { formatApiDate } from "@/services/dateTime";
import {
  createChatRoom,
  findExistingChatRoomByProductId,
} from "@/services/chats/service";
import { fetchAuctionDetail } from "@/services/auction/detail/service";
import { EventStreamProvider } from "@/services/events/EventStreamProvider";
import {
  createDraftFromReauctionPreview,
  declineReauction,
  getReauctionPreview,
  reauctionAuction,
} from "@/services/auction/register/service";
import type { ReauctionPreviewResponse } from "@/services/auction/register/types";

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
  const [reauctionPreview, setReauctionPreview] =
    useState<ReauctionPreviewResponse | null>(null);
  const [reauctionError, setReauctionError] = useState("");
  const [isReauctionLoading, setIsReauctionLoading] = useState(false);
  const [reauctionAction, setReauctionAction] = useState<
    "same" | "decline" | null
  >(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const isFromReauction = searchParams.get("fromReauction") === "1";

  useEffect(() => {
    if (searchParams.get("reauctionPrompt") === "1") {
      setShowReauctionPrompt(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!showReauctionPrompt) {
      return;
    }

    let isMounted = true;
    setIsReauctionLoading(true);
    setReauctionError("");
    getReauctionPreview(auctionId)
      .then((preview) => {
        if (isMounted) {
          setReauctionPreview(preview);
        }
      })
      .catch(() => {
        if (isMounted) {
          setReauctionError("재경매 가능 기간이 지났거나 정보를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsReauctionLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [auctionId, showReauctionPrompt]);

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

      const createdRoom = await createChatRoom({ productId });
      router.push(`/chats/${createdRoom.roomId}`);
    } catch (err) {
      console.error("Failed to open auction chat:", err);
      showToast("채팅방을 열지 못했습니다.");
    } finally {
      setIsOpeningChat(false);
    }
  };

  const handleReauctionSame = async () => {
    if (!reauctionPreview || reauctionAction) {
      return;
    }

    try {
      setReauctionAction("same");
      const draft = createDraftFromReauctionPreview(reauctionPreview);
      const result = await reauctionAuction(auctionId, draft, {
        preserveSourceAuctionPeriod: true,
      });
      router.replace(`/auctions/${result.auctionId}?fromReauction=1`);
    } catch (error) {
      console.error("Failed to reauction:", error);
      setReauctionError("재경매 등록에 실패했습니다.");
      setReauctionAction(null);
    }
  };

  const handleDeclineReauction = async () => {
    if (reauctionAction) {
      return;
    }
    if (!window.confirm("재등록하지 않으면 이 경매는 종료 처리돼요.")) {
      return;
    }

    try {
      setReauctionAction("decline");
      await declineReauction(auctionId);
      setShowReauctionPrompt(false);
      showToast("재경매 대기를 종료했어요.");
      router.replace("/");
    } catch (error) {
      console.error("Failed to decline reauction:", error);
      setReauctionError("재등록 안 하기에 실패했습니다.");
      setReauctionAction(null);
    }
  };

  return (
    <>
      <EventStreamProvider enabled>
        <div className="relative h-screen overflow-hidden bg-white">
          <AuctionDetailScreen
            productId={auctionId}
            onBack={() => {
              if (isFromReauction) {
                router.replace("/");
                return;
              }
              router.back();
            }}
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
                        3일 안에 선택하지 않으면 재경매 대기가 자동 종료돼요.
                      </p>
                    </div>
                  </div>

                  {reauctionError && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                      {reauctionError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {}}
                    className="w-full rounded-2xl bg-gray-100 p-4 text-left transition-colors hover:bg-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-xs font-bold text-gray-500">
                        {reauctionPreview?.images?.[0]?.imageUrl ? (
                          <img
                            src={reauctionPreview.images[0].imageUrl}
                            alt={reauctionPreview.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          "유찰"
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold text-[#17181d]">
                          {isReauctionLoading
                            ? "재경매 정보 확인 중"
                            : reauctionPreview?.name ?? `유찰된 경매 #${auctionId}`}
                        </p>
                        <p className="mt-1 text-xl font-black text-[#17181d]">
                          재경매 대기
                        </p>
                        {reauctionPreview?.reauctionExpiresAt && (
                          <p className="mt-1 text-xs font-bold text-gray-400">
                            {formatApiDate(reauctionPreview.reauctionExpiresAt, {
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            까지 가능
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={handleReauctionSame}
                      disabled={!reauctionPreview || reauctionAction !== null}
                      className="h-14 rounded-2xl bg-gray-100 text-sm font-black text-[#17181d] transition-colors hover:bg-gray-200"
                    >
                      {reauctionAction === "same" ? "등록 중" : "그대로 올리기"}
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/auctions/register?reauctionSourceId=${auctionId}`)
                      }
                      disabled={!reauctionPreview || reauctionAction !== null}
                      className="h-14 rounded-2xl bg-[#F64257] text-sm font-black text-white transition-opacity hover:opacity-90"
                    >
                      게시글 수정하기
                    </button>
                    <button
                      onClick={handleDeclineReauction}
                      disabled={reauctionAction !== null}
                      className="h-14 rounded-2xl bg-gray-100 text-sm font-black text-gray-500 transition-colors hover:bg-gray-200"
                    >
                      {reauctionAction === "decline" ? "처리 중" : "재등록 안 하기"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </EventStreamProvider>
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}

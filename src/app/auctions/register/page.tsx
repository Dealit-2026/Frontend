"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuctionRegisterScreen from "../../products/register/AuctionRegisterScreen";
import {
  createDraftFromReauctionPreview,
  getReauctionPreview,
} from "@/services/auction/register/service";
import type { AuctionRegisterDraft } from "@/services/auction/register/types";

function AuctionRegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reauctionSourceAuctionId = Number(searchParams.get("reauctionSourceId"));
  const [initialData, setInitialData] = useState<AuctionRegisterDraft | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reauctionSourceAuctionId) {
      return;
    }

    let isMounted = true;
    getReauctionPreview(reauctionSourceAuctionId)
      .then((preview) => {
        if (isMounted) {
          setInitialData(createDraftFromReauctionPreview(preview));
        }
      })
      .catch(() => {
        if (isMounted) {
          setErrorMessage("재경매 정보를 불러오지 못했습니다.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [reauctionSourceAuctionId]);

  if (reauctionSourceAuctionId && errorMessage) {
    return (
      <AuctionRegisterRouteShell>
        <div className="flex h-full items-center justify-center bg-white px-6 text-center text-sm font-bold text-gray-500">
          {errorMessage}
        </div>
      </AuctionRegisterRouteShell>
    );
  }

  if (reauctionSourceAuctionId && !initialData) {
    return (
      <AuctionRegisterRouteShell>
        <div className="flex h-full items-center justify-center bg-white text-sm font-bold text-gray-400">
          재경매 정보를 불러오는 중입니다
        </div>
      </AuctionRegisterRouteShell>
    );
  }

  return (
    <AuctionRegisterRouteShell>
      <AuctionRegisterScreen
        initialData={initialData ?? undefined}
        submitMode={reauctionSourceAuctionId ? "create" : undefined}
        reauctionSourceAuctionId={
          reauctionSourceAuctionId || undefined
        }
        onComplete={(result) => {
          const auctionId =
            typeof result === "object" && result !== null && "auctionId" in result
              ? Number(result.auctionId)
              : 0;
          router.replace(
            auctionId
              ? `/auctions/${auctionId}?fromReauction=1`
              : "/mypage/sales-management",
          );
        }}
      />
    </AuctionRegisterRouteShell>
  );
}

function AuctionRegisterRouteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center bg-white font-sans text-[#141414]">
      <div className="h-screen w-full max-w-[430px] overflow-hidden bg-white">
        {children}
      </div>
    </div>
  );
}

export default function AuctionRegisterPage() {
  return (
    <Suspense
      fallback={
        <AuctionRegisterRouteShell>
          <div className="flex h-full items-center justify-center bg-white text-sm font-bold text-gray-400">
            경매 등록 화면을 불러오는 중입니다
          </div>
        </AuctionRegisterRouteShell>
      }
    >
      <AuctionRegisterPageContent />
    </Suspense>
  );
}

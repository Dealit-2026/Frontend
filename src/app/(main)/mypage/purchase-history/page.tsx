"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { fetchMyPurchases } from "@/services/mypage/purchase-history/service";

const THEME_COLOR = "#98E446";

const statusOptions = [
  { code: "PAID", label: "결제완료" },
  { code: "SHIPPED", label: "배송중" },
  { code: "COMPLETED", label: "거래완료" },
  { code: "CANCELED", label: "취소" },
];

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "PAID",
    "SHIPPED",
    "COMPLETED",
  ]);
  const nextPageRef = React.useRef<number>(0);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const isLoadingRef = React.useRef<boolean>(false);
  const errorRef = React.useRef<string | null>(null);
  const hasNextRef = React.useRef<boolean>(true);
  const selectedStatusesRef = React.useRef<string[]>([
    "PAID",
    "SHIPPED",
    "COMPLETED",
  ]);

  const getStatusLabel = (code: string) => {
    const option = statusOptions.find((opt) => opt.code === code);
    return option ? option.label : code;
  };

  function handleFilterToggle(statusCode: string) {
    setSelectedStatuses((prev) => {
      const newStatuses = prev.includes(statusCode)
        ? prev.filter((s) => s !== statusCode)
        : [...prev, statusCode];

      setPurchases([]);
      setHasNext(true);
      setError(null);
      nextPageRef.current = 0;

      if (typeof window !== "undefined") {
        setTimeout(() => {
          loadPageWithFilters(0, newStatuses);
        }, 0);
      }

      return newStatuses;
    });
  }

  async function loadPageWithFilters(page: number, statuses: string[]) {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetchMyPurchases(page, 20, statuses);
      if (!mounted) return;
      setPurchases((prev) =>
        page === 0 ? resp.content || [] : [...prev, ...(resp.content || [])],
      );
      setHasNext(Boolean(resp.hasNext));
      nextPageRef.current = page + 1;
    } catch (e: any) {
      if (!mounted) return;
      const message =
        e?.message ?? "구매내역을 불러오는 중 오류가 발생했습니다.";
      setError(message);
      classifyAndLogError(e);
    } finally {
      if (mounted) setIsLoading(false);
    }
  }

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  useEffect(() => {
    errorRef.current = error;
  }, [error]);
  useEffect(() => {
    hasNextRef.current = hasNext;
  }, [hasNext]);

  function classifyAndLogError(e: unknown) {
    try {
      const msg = e instanceof Error ? e.message : String(e);
      const status =
        e && typeof (e as any).status === "number" ? (e as any).status : null;
      let category = "UNKNOWN";
      if (status === 401) category = "AUTH";
      else if (status && status >= 500) category = "SERVER";
      else if (status && status >= 400) category = "CLIENT";
      else if (msg.includes("Failed to fetch") || msg.includes("NetworkError"))
        category = "NETWORK";

      const payload = {
        category,
        status,
        message: msg,
        time: new Date().toISOString(),
      };
      console.error("ClientLog", payload);

      try {
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.sendBeacon === "function"
        ) {
          const url = "/api/v1/client-errors";
          const blob = new Blob([JSON.stringify(payload)], {
            type: "application/json",
          });
          navigator.sendBeacon(url, blob);
        }
      } catch (_) {}
    } catch (_) {}
  }

  useEffect(() => {
    let mounted = true;

    async function loadPage(page: number) {
      if (!mounted) return;
      setIsLoading(true);
      setError(null);
      try {
        const resp = await fetchMyPurchases(
          page,
          20,
          selectedStatusesRef.current,
        );
        if (!mounted) return;
        setPurchases((prev) => [...prev, ...(resp.content || [])]);
        setHasNext(Boolean(resp.hasNext));
        nextPageRef.current = page + 1;
      } catch (e: any) {
        if (!mounted) return;
        const message =
          e?.message ?? "구매내역을 불러오는 중 오류가 발생했습니다.";
        setError(message);
        classifyAndLogError(e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadPage(0);

    const observer = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (
          ent.isIntersecting &&
          !isLoadingRef.current &&
          hasNextRef.current &&
          !errorRef.current
        ) {
          loadPage(nextPageRef.current);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    selectedStatusesRef.current = selectedStatuses;
  }, [selectedStatuses]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      <div className="h-14 flex items-center px-4 bg-white border-b border-gray-100 shrink-0">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">구매 내역</h1>
      </div>

      <div className="px-4 py-3 bg-white border-b border-gray-100 shrink-0 flex gap-2 overflow-x-auto">
        {statusOptions.map((status) => (
          <button
            key={status.code}
            onClick={() => handleFilterToggle(status.code)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedStatuses.includes(status.code)
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && (
          <div className="text-center text-sm text-gray-500">
            불러오는 중...
          </div>
        )}
        {error && (
          <div className="text-center text-sm text-red-500">{error}</div>
        )}
        {!isLoading && purchases.length === 0 && !error && (
          <div className="text-center text-sm text-gray-500">
            구매중인 상품이 없습니다.
          </div>
        )}

        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
              <span className="text-xs text-gray-400 font-mono">
                {purchase.purchasedAtDisplay}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: THEME_COLOR }}
              >
                {getStatusLabel(purchase.status)}
              </span>
            </div>
            <div className="flex space-x-4">
              <img
                src={purchase.imageUrl ?? undefined}
                alt={purchase.title}
                className="w-16 h-16 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1 flex flex-col justify-center">
                <span className="font-medium text-gray-800 line-clamp-1">
                  {purchase.title}
                </span>
                <span className="font-bold mt-1">
                  {purchase.amountFormatted}
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                router.push(`/mypage/purchase-history/${purchase.id}`)
              }
              className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <span>자세히 보기</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
        <div ref={sentinelRef} />
      </div>
    </div>
  );
}

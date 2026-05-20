"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Check,
  ChevronRight,
  User,
  Camera,
  Search,
  Home,
  PlusCircle,
  MessageCircle,
  Heart,
  Bell,
  Filter,
  Settings,
  MoreVertical,
  Send,
  Star,
  Clock,
  ArrowUpRight,
  X,
  Trash2,
  Eye,
  Image as ImageIcon,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  Menu,
  ShoppingBag,
  Store,
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Screen, Tab } from "../../../../types/index";
import { ExploreIcon } from "../../../../components/common/ExploreIcon";
import { fetchMySales } from "@/services/mypage/sales-history/service";

export default function SalesHistoryScreen({
  onBack,
  themeColor,
}: {
  onBack: () => void;
  themeColor: string;
  key?: string;
}) {
  console.log("[SH index] render");
  const router = useRouter();
  const dedupeById = (items: any[]) =>
    Array.from(new Map(items.map((item) => [item.id, item])).values());
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "PAID",
    "SHIPPED",
    "COMPLETED",
  ]);
  const nextPageRef = React.useRef<number>(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef<boolean>(false);
  const errorRef = useRef<string | null>(null);
  const hasNextRef = useRef<boolean>(true);
  const selectedStatusesRef = useRef<string[]>([
    "PAID",
    "SHIPPED",
    "COMPLETED",
  ]);

  const statusOptions = [
    { code: "PAID", label: "결제완료" },
    { code: "SHIPPED", label: "배송중" },
    { code: "COMPLETED", label: "거래완료" },
    { code: "CANCELED", label: "취소" },
  ];

  const getStatusLabel = (code: string) => {
    const option = statusOptions.find((opt) => opt.code === code);
    return option ? option.label : code;
  };

  const getSaleStatusGuide = (status: string) => {
    if (status === "PAID") {
      return "결제가 완료되었습니다. 상품 전달 후 보냈어요를 눌러주세요.";
    }
    if (status === "SHIPPED") {
      return "상품을 보냈어요. 구매자의 수령확정을 기다리고 있습니다.";
    }
    if (status === "COMPLETED") {
      return "거래가 완료되었습니다.";
    }
    if (status === "CANCELED") {
      return "취소된 거래입니다.";
    }
    return "";
  };

  function handleFilterToggle(statusCode: string) {
    setSelectedStatuses((prev) => {
      const newStatuses = prev.includes(statusCode)
        ? prev.filter((s) => s !== statusCode)
        : [...prev, statusCode];

      setSales([]);
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
      const resp = await fetchMySales(page, 20, statuses);
      if (!mounted) return;
      setSales((prev) => {
        const nextItems =
          page === 0 ? resp.content || [] : [...prev, ...(resp.content || [])];
        return dedupeById(nextItems);
      });
      setHasNext(Boolean(resp.hasNext));
      nextPageRef.current = page + 1;
    } catch (e: any) {
      if (!mounted) return;
      const message =
        e?.message ?? "판매내역을 불러오는 중 오류가 발생했습니다.";
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
        const resp = await fetchMySales(page, 20, selectedStatusesRef.current);
        if (!mounted) return;
        setSales((prev) => dedupeById([...prev, ...(resp.content || [])]));
        setHasNext(Boolean(resp.hasNext));
        nextPageRef.current = page + 1;
      } catch (e: any) {
        if (!mounted) return;
        const message =
          e?.message ?? "판매내역을 불러오는 중 오류가 발생했습니다.";
        setError(message);
        classifyAndLogError(e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    // load first page
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

  if (selectedItem) {
    return (
      <div className="flex-1 flex flex-col bg-gray-100 h-full">
        <div className="h-14 flex items-center px-4 bg-white border-b border-gray-100 shrink-0">
          <button onClick={() => setSelectedItem(null)} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold ml-2">거래 상세 내역</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
          <div className="w-full max-w-md bg-white shadow-sm relative overflow-hidden">
            {/* Jagged top edge effect */}
            <div
              className="w-full h-3 bg-repeat-x"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 6px 0, transparent 6px, white 7px)",
                backgroundSize: "12px 12px",
              }}
            ></div>

            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold tracking-widest text-gray-800">
                  RECEIPT
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  TRANSACTION DETAILS
                </p>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 mb-6"></div>

              <div className="flex flex-col items-center mb-6">
                <img
                  src={selectedItem.imageUrl ?? undefined}
                  alt={selectedItem.title}
                  className="w-20 h-20 object-cover rounded-lg mb-4"
                />
                <span className="font-medium text-gray-800 text-lg text-center">
                  {selectedItem.title}
                </span>
                <span className="font-bold text-xl mt-1">
                  {selectedItem.amountFormatted}
                </span>
                <span
                  className="text-xs font-medium mt-2 px-2 py-1 bg-gray-100 rounded-md"
                  style={{ color: themeColor }}
                >
                  {selectedItem.status}
                </span>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 mb-6"></div>

              <div className="mb-2 text-xs font-bold text-gray-400 tracking-wider">
                HISTORY
              </div>
              <div className="space-y-4">
                {selectedItem.history.map((hist: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-mono">
                        {hist.time}
                      </span>
                      <span className="font-medium text-sm text-gray-800">
                        {hist.action}
                      </span>
                    </div>
                    <span className="text-sm font-bold">{hist.detail}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-gray-200 mt-6 mb-6"></div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-mono">ORDER ID</span>
                <span className="font-mono">{selectedItem.id}</span>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 mt-6 mb-6"></div>

              <div className="text-center flex flex-col items-center space-y-3">
                <p className="text-[10px] text-gray-400 font-mono tracking-widest">
                  THANK YOU
                </p>
                {/* Barcode mock */}
                <div className="h-12 w-full flex justify-center space-x-0.5 opacity-60">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{ width: `${Math.random() * 3 + 1}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Jagged bottom edge effect */}
            <div
              className="w-full h-3 bg-repeat-x rotate-180"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 6px 0, transparent 6px, white 7px)",
                backgroundSize: "12px 12px",
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      <div className="h-14 flex items-center px-4 bg-white border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">판매 내역</h1>
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
        {!isLoading && sales.length === 0 && !error && (
          <div className="text-center text-sm text-gray-500">
            판매중인 상품이 없습니다.
          </div>
        )}

        {dedupeById(sales).map((sale) => (
          <div
            key={sale.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
              <span className="text-xs text-gray-400 font-mono">
                {sale.purchasedAtDisplay}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: themeColor }}
              >
                {getStatusLabel(sale.status)}
              </span>
            </div>
            <div className="flex space-x-4">
              <img
                src={sale.imageUrl ?? undefined}
                alt={sale.title}
                className="w-16 h-16 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1 flex flex-col justify-center">
                <span className="font-medium text-gray-800 line-clamp-1">
                  {sale.title}
                </span>
                <span className="font-bold mt-1">{sale.amountFormatted}</span>
              </div>
            </div>
            <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-500">
              {getSaleStatusGuide(sale.status)}
            </p>
            <button
              onClick={() => {
                setSelectedItem(null);
                router.push(`/mypage/sales-history/${sale.id}/receipt`);
              }}
              className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <span>자세히 보기</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
        {/* sentinel for IntersectionObserver */}
        <div ref={sentinelRef} />
      </div>
    </div>
  );
}

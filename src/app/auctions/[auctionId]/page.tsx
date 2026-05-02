"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import AuctionDetailScreen from "./index";
import * as productDetailService from "@/services/product/productDetail/service";
import type { ProductDetailResponse } from "@/services/product/productDetail/types";

export default function AuctionDetailPage() {
  const params = useParams<{ auctionId: string }>();
  const router = useRouter();
  // auctionId 파라미터는 실제로는 productId입니다
  const productId = Number(params.auctionId) || 1;
  const [productData, setProductData] = useState<ProductDetailResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAuctionDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        // productId로 상품 상세 정보 로드
        const data = await productDetailService.fetchProductDetail(productId);
        setProductData(data);
      } catch (err) {
        console.error("Failed to fetch auction detail:", err);
        setError(
          err instanceof Error
            ? err.message
            : "경매 상품 정보를 불러올 수 없습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAuctionDetail();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">경매 상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">경매 상품 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <AuctionDetailScreen
      productId={productId}
      productData={productData}
      onBack={() => router.back()}
      onBidStatusClick={() =>
        router.push(`/auctions/${productId}/bidding-status`)
      }
      onChatClick={() => router.push("/chats/1")}
      onReportClick={() => router.push(`/products/${productId}/report`)}
      onPurchaseClick={() => router.push(`/products/${productId}/payment`)}
      onBidComplete={() => router.push(`/auctions/${productId}/bid-complete`)}
      themeColor="#F64257"
      mode="auction"
      showToast={() => {}}
    />
  );
}

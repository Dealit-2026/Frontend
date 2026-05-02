"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductDetailScreen from "./index";
import { findExistingChatRoomByProductId } from "@/services/chats/service";
import * as productDetailService from "@/services/product/productDetail/service";
import type { ProductDetailResponse } from "@/services/product/productDetail/types";

export default function ProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const productId = Number(params.productId) || 1;
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [productData, setProductData] = useState<ProductDetailResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productDetailService.fetchProductDetail(productId);
        setProductData(data);
      } catch (err) {
        console.error("Failed to fetch product detail:", err);
        setError(
          err instanceof Error
            ? err.message
            : "상품 정보를 불러올 수 없습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [productId]);

  const handleChatClick = async () => {
    if (isOpeningChat) return;

    try {
      setIsOpeningChat(true);
      const existingRoom = await findExistingChatRoomByProductId(productId);

      if (existingRoom) {
        router.push(`/chats/${existingRoom.roomId}`);
        return;
      }

      router.push(`/chats/new?productId=${productId}`);
    } catch (error) {
      console.error("Failed to open chat:", error);
      router.push(`/chats/new?productId=${productId}`);
    } finally {
      setIsOpeningChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">상품 정보를 불러오는 중...</p>
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
        <p className="text-gray-600">상품 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <ProductDetailScreen
      productId={productId}
      productData={productData}
      onBack={() => router.back()}
      onChatClick={handleChatClick}
      onReportClick={() => router.push(`/products/${productId}/report`)}
      onPurchaseClick={() =>
        router.push(`/products/${productId}/regular-purchase`)
      }
      themeColor="#98E446"
      showToast={() => {}}
    />
  );
}

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import WriteReviewScreen from "./index";

function WriteReviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdParam = Number(searchParams.get("productId"));
  const auctionIdParam = Number(searchParams.get("auctionId"));

  return (
    <WriteReviewScreen
      onBack={() => router.back()}
      onComplete={() => router.push("/mypage/review")}
      themeColor="#98E446"
      productId={
        Number.isFinite(productIdParam) && productIdParam > 0
          ? productIdParam
          : null
      }
      auctionId={
        Number.isFinite(auctionIdParam) && auctionIdParam > 0
          ? auctionIdParam
          : null
      }
    />
  );
}

export default function WriteReviewPage() {
  return (
    <Suspense fallback={null}>
      <WriteReviewPageContent />
    </Suspense>
  );
}

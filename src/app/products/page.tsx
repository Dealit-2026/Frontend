"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductListScreen from "./index";

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = Number(searchParams.get("categoryId"));
  const categoryId =
    Number.isFinite(categoryIdParam) && categoryIdParam > 0
      ? categoryIdParam
      : null;
  const categoryName = searchParams.get("category");

  return (
    <ProductListScreen
      listType="all"
      categoryId={categoryId}
      categoryName={categoryName}
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      onSearchClick={() => router.push("/search")}
      themeColor="#98E446"
      mode="regular"
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}

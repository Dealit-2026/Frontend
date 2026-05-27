"use client";

import { useRouter } from "next/navigation";

import SearchScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function SearchPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="search" activeColor="#98E446">
      <SearchScreen
        onBack={() => router.push("/home")}
        onCategorySelect={(category) =>
          router.push(
            `/products?categoryId=${category.id}&category=${encodeURIComponent(category.name)}`,
          )
        }
        onSearchDetailClick={() => router.push("/search/detail")}
        onRecentClick={() => router.push("/products?type=recent")}
        themeColor="#98E446"
      />
    </RouteTabShell>
  );
}

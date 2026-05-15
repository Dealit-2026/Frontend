"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import HomeScreen from "./index";
import {
  readStoredThemeMode,
  writeStoredThemeMode,
  type ThemeMode,
} from "@/services/themeMode";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<ThemeMode>(readStoredThemeMode);

  const handleModeChange = (nextMode: ThemeMode) => {
    setMode(nextMode);
    writeStoredThemeMode(nextMode);
  };

  return (
    <HomeScreen
      onProductClick={(id) =>
        router.push(mode === "auction" ? `/auctions/${id}` : `/products/${id}`)
      }
      onProductListClick={(type, category) => {
        const params = new URLSearchParams();
        params.set("type", type);
        if (category) {
          params.set("category", category);
        }

        router.push(
          `${mode === "auction" ? "/auctions" : "/products"}?${params.toString()}`,
        );
      }}
      onNotificationClick={() => router.push("/notifications")}
      onCategoryResetClick={() => {}}
      onSearchClick={() => router.push("/search")}
      onWishlistClick={() => router.push("/wishlist")}
      mode={mode}
      onModeChange={handleModeChange}
      onTabChange={() => {}}
    />
  );
}

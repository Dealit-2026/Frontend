"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Home, PlusCircle, MessageCircle, User } from "lucide-react";

import TabButton from "./TabButton";
import { ExploreIcon } from "../ExploreIcon";
import { useEventStream } from "@/services/events/EventStreamProvider";
import { readStoredThemeMode } from "@/services/themeMode";

export default function RouteTabShell({
  children,
  activeTab = "mypage",
  activeColor = "#98E446",
}: {
  children: ReactNode;
  activeTab?: "home" | "search" | "register" | "chat" | "mypage";
  activeColor?: string;
}) {
  const router = useRouter();
  const { chatUnreadCount } = useEventStream();
  const themeMode = readStoredThemeMode();

  const goToRegister = () => {
    router.push(
      themeMode === "auction" ? "/auctions/register" : "/products/register",
    );
  };

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-white">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      <div className="h-16 bg-white border-t border-gray-100 flex items-center justify-around px-4 shrink-0">
        <TabButton
          active={activeTab === "home"}
          icon={<Home size={24} />}
          label="홈"
          onClick={() => router.push("/home")}
          activeColor={activeColor}
        />
        <TabButton
          active={activeTab === "search"}
          icon={<ExploreIcon size={30} />}
          label="탐색"
          onClick={() => router.push("/search")}
          activeColor={activeColor}
        />
        <TabButton
          active={activeTab === "register"}
          icon={<PlusCircle size={24} />}
          label="등록"
          onClick={goToRegister}
          activeColor={activeColor}
        />
        <TabButton
          active={activeTab === "chat"}
          icon={<MessageCircle size={24} />}
          label="채팅"
          onClick={() => router.push("/chats")}
          activeColor={activeColor}
          badgeCount={chatUnreadCount}
        />
        <TabButton
          active={activeTab === "mypage"}
          icon={<User size={24} />}
          label="MY"
          onClick={() => router.push("/mypage")}
          activeColor={activeColor}
        />
      </div>
    </div>
  );
}

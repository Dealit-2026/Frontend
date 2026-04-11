"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import RegionSetupScreen from "@/app/(auth)/region-setup";
import { fetchMyProfileForm, saveMyLocation } from "@/services/mypage/service";

const DEFAULT_LOCATION = "\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c";

export default function ProfileLocationEditPage() {
  const router = useRouter();
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    let ignore = false;

    fetchMyProfileForm().then((form) => {
      if (!ignore && form.location) {
        setLocation(form.location);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const handleComplete = async () => {
    await saveMyLocation(location);
    router.push("/mypage/edit-profile");
  };

  return (
    <RegionSetupScreen
      onBack={() => router.back()}
      onNext={handleComplete}
      onFindLocation={() => router.push("/mypage/edit-profile/location/find")}
      currentLocation={location}
    />
  );
}

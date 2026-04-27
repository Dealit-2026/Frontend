import ProfileEditPageClient from "./page-client";

interface ProfileEditPageProps {
  searchParams?: Promise<{
    verifiedRefresh?: string;
  }>;
}

export default async function ProfileEditPage({
  searchParams,
}: ProfileEditPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const refreshToken = resolvedSearchParams?.verifiedRefresh || "";

  return <ProfileEditPageClient refreshToken={refreshToken} />;
}

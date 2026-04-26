import EmailAuthPageClient from "./page-client";

interface EmailAuthPageProps {
  searchParams?: Promise<{
    mode?: string;
    returnTo?: string;
  }>;
}

export default async function EmailAuthPage({
  searchParams,
}: EmailAuthPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const mode =
    resolvedSearchParams?.mode === "profile" ? "profile" : "signup";
  const returnTo = resolvedSearchParams?.returnTo || "/terms";

  return <EmailAuthPageClient mode={mode} returnTo={returnTo} />;
}

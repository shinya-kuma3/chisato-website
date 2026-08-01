import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidAdminPath } from "@/lib/auth";
import "./admin.css";

export const metadata: Metadata = {
  title: "Console",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ConsoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;

  // 秘密URLが一致しない場合は「存在しないページ」として404を返す
  if (!isValidAdminPath(key)) {
    notFound();
  }

  return <>{children}</>;
}

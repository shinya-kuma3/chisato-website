import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

/** 公開サイト側のレイアウト (ヘッダー・フッター付き) */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CursorGlow />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

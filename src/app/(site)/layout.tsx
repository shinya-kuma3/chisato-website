import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** 公開サイト側のレイアウト (ヘッダー・フッター付き) */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

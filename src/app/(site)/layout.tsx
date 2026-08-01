import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

/** 公開サイト側のレイアウト (ヘッダー・フッター付き)
 *  パーティクルは各ページ側で配置する
 *  (TOPはヒーロー内だけ / 下層ページは画面全体) */
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

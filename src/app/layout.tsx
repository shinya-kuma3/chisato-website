import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "チサト -CHISATO- Official Site",
    template: "%s | チサト -CHISATO-",
  },
  description:
    "歌い手・チサトのオフィシャルサイト。歌ってみたリクエスト、作詞作曲・ミキシング・マスタリング・イラスト・MV制作・コラボのご依頼、グッズ情報はこちらから。",
  robots: { index: false, follow: false }, // 公開前のためインデックス拒否 (公開時に削除)
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

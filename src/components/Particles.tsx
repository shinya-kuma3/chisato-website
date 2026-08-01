/**
 * 浮かぶ光の粒。位置・アニメーションは globals.css の .particles で定義。
 * variant="fixed" … 画面全体の固定レイヤー (下層ページ用)
 * variant="hero"  … 親要素(ヒーロー)の中だけに収める (TOPのファーストビュー用)
 * どちらもカード・イラスト(z-index:46)より背面に置く。
 */
export default function Particles({
  variant = "fixed",
}: {
  variant?: "fixed" | "hero";
}) {
  return (
    <div
      className={`particles ${variant === "hero" ? "particles-hero" : "particles-fixed"}`}
      aria-hidden="true"
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

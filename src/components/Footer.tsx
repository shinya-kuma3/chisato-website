import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>
          <strong>チサト -CHISATO-</strong> Official Site
          <div style={{ opacity: 0.6, marginTop: 6 }}>
            深夜、部屋の明かりはモニターだけ。
            <br />© {new Date().getFullYear()} Chisato. All rights reserved.
          </div>
        </div>
        <div className="links">
          <Link href="/request">歌ってみたリクエスト</Link>
          <Link href="/commission">ご依頼</Link>
          <Link href="/goods">グッズ</Link>
        </div>
      </div>
    </footer>
  );
}

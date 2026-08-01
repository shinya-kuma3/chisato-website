"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "ホーム" },
  { href: "/about", label: "プロフィール" },
  { href: "/request", label: "歌ってみたリクエスト" },
  { href: "/commission", label: "ご依頼" },
  { href: "/goods", label: "グッズ" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/" className="brand">
          チサト <span className="en">CHISATO&apos;S ROOM</span>
        </Link>
        <nav className="nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

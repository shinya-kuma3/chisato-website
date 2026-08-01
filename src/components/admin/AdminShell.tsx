import Link from "next/link";

type NavItem = {
  href?: string;
  label: string;
  icon: string;
  active?: boolean;
  soon?: boolean;
};

/**
 * 管理ダッシュボードの外枠 (サイドバー + メイン)。
 * 今後 Analytics 等のページを増やすときは nav に追加してください。
 */
export default function AdminShell({
  basePath,
  current,
  email,
  title,
  subtitle,
  headRight,
  children,
}: {
  basePath: string;
  current: string;
  email: string;
  title: string;
  subtitle?: string;
  headRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  const nav: NavItem[] = [
    { href: basePath, label: "ダッシュボード", icon: "◆", active: current === "dashboard" },
    {
      href: `${basePath}/requests`,
      label: "リクエスト一覧",
      icon: "♪",
      active: current === "requests",
    },
    {
      href: `${basePath}/commissions`,
      label: "依頼一覧",
      icon: "✉",
      active: current === "commissions",
    },
    { label: "アナリティクス", icon: "▤", soon: true },
    { label: "グッズ管理", icon: "▣", soon: true },
    { label: "設定", icon: "⚙", soon: true },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="logo">
          CHISATO
          <small>CONSOLE</small>
        </div>
        <nav>
          {nav.map((n) =>
            n.soon || !n.href ? (
              <a key={n.label} className="soon">
                <span className="ico">{n.icon}</span>
                {n.label}
              </a>
            ) : (
              <Link key={n.label} href={n.href} className={n.active ? "on" : ""}>
                <span className="ico">{n.icon}</span>
                {n.label}
              </Link>
            )
          )}
        </nav>
        <div className="side-foot">
          {email}
          <br />
          <a href="/api/auth/logout">ログアウト →</a>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-head">
          <div>
            <h1>{title}</h1>
            {subtitle && <div className="sub">{subtitle}</div>}
          </div>
          {headRight}
        </div>
        {children}
      </main>
    </div>
  );
}

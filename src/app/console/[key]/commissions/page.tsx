import { getAdminSession, googleAuthConfigured } from "@/lib/auth";
import { listCommissionRequests, type CommissionRequest } from "@/lib/store";
import { fmtDateTime } from "@/lib/analytics";
import AdminShell from "@/components/admin/AdminShell";
import LoginGate from "@/components/admin/LoginGate";

export const dynamic = "force-dynamic";

export default async function CommissionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ auth_error?: string }>;
}) {
  const { key } = await params;
  const { auth_error } = await searchParams;
  const basePath = `/console/${key}`;

  const session = await getAdminSession();
  if (!session) {
    return (
      <LoginGate
        next={`${basePath}/commissions`}
        error={auth_error}
        configured={googleAuthConfigured()}
      />
    );
  }

  let rows: CommissionRequest[] = [];
  try {
    rows = await listCommissionRequests();
  } catch {
    /* noop */
  }

  const byCategory = new Map<string, number>();
  for (const r of rows) byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + 1);

  return (
    <AdminShell
      basePath={basePath}
      current="commissions"
      email={session.email}
      title="依頼一覧"
      subtitle={`届いた制作依頼 ${rows.length}件 (新しい順)`}
    >
      {byCategory.size > 0 && (
        <div className="kpi-grid">
          {[...byCategory.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([cat, n]) => (
              <div className="kpi" key={cat}>
                <div className="k-label">{cat}</div>
                <div className="k-num">
                  {n}
                  <em>件</em>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="panel">
        {rows.length === 0 ? (
          <div className="empty">まだ依頼がありません</div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>日時</th>
                  <th>カテゴリ</th>
                  <th>お名前</th>
                  <th>連絡先</th>
                  <th>予算</th>
                  <th>依頼内容</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="dim">{fmtDateTime(r.created_at)}</td>
                    <td>
                      <span className="a-tag">{r.category}</span>
                    </td>
                    <td>{r.name}</td>
                    <td className="dim">{r.contact}</td>
                    <td className="dim">{r.budget || "—"}</td>
                    <td className="dim" style={{ whiteSpace: "pre-wrap", maxWidth: 380 }}>
                      {r.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

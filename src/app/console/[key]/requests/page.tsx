import { getAdminSession, googleAuthConfigured } from "@/lib/auth";
import { listSongRequests, type SongRequest } from "@/lib/store";
import { fmtDateTime } from "@/lib/analytics";
import AdminShell from "@/components/admin/AdminShell";
import LoginGate from "@/components/admin/LoginGate";

export const dynamic = "force-dynamic";

export default async function RequestsPage({
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
        next={`${basePath}/requests`}
        error={auth_error}
        configured={googleAuthConfigured()}
      />
    );
  }

  let rows: SongRequest[] = [];
  try {
    rows = await listSongRequests();
  } catch {
    /* noop */
  }

  return (
    <AdminShell
      basePath={basePath}
      current="requests"
      email={session.email}
      title="リクエスト一覧"
      subtitle={`届いた歌ってみたリクエスト ${rows.length}件 (新しい順)`}
    >
      <div className="panel">
        {rows.length === 0 ? (
          <div className="empty">まだリクエストがありません</div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>日時</th>
                  <th>曲名</th>
                  <th>アーティスト</th>
                  <th>参考URL</th>
                  <th>差出人</th>
                  <th>コメント</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="dim">{fmtDateTime(r.created_at)}</td>
                    <td>{r.song_title}</td>
                    <td className="dim">{r.artist_name || "—"}</td>
                    <td>
                      {r.reference_url ? (
                        <a href={r.reference_url} target="_blank" rel="noopener noreferrer">
                          開く
                        </a>
                      ) : (
                        <span className="dim">—</span>
                      )}
                    </td>
                    <td className="dim">{r.nickname || "匿名"}</td>
                    <td className="dim">{r.comment || "—"}</td>
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

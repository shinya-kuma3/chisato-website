import Link from "next/link";
import { getAdminSession, googleAuthConfigured } from "@/lib/auth";
import { listSongRequests, listCommissionRequests, storageMode } from "@/lib/store";
import type { SongRequest, CommissionRequest } from "@/lib/store";
import {
  aggregateSongs,
  countWithinDays,
  dailyCounts,
  fmtDateTime,
} from "@/lib/analytics";
import AdminShell from "@/components/admin/AdminShell";
import LoginGate from "@/components/admin/LoginGate";

export const dynamic = "force-dynamic";

export default async function ConsoleDashboard({
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
      <LoginGate next={basePath} error={auth_error} configured={googleAuthConfigured()} />
    );
  }

  let songs: SongRequest[] = [];
  let commissions: CommissionRequest[] = [];
  let loadError = false;
  try {
    [songs, commissions] = await Promise.all([
      listSongRequests(),
      listCommissionRequests(),
    ]);
  } catch {
    loadError = true;
  }

  const { songRanking, artistRanking } = aggregateSongs(songs);
  const chart = dailyCounts(songs, 14);
  const chartMax = Math.max(1, ...chart.map((c) => c.count));
  const last7 = countWithinDays(songs, 7);
  const prev7 = countWithinDays(songs, 14) - last7;
  const delta = last7 - prev7;
  const maxCount = songRanking[0]?.count ?? 1;

  return (
    <AdminShell
      basePath={basePath}
      current="dashboard"
      email={session.email}
      title="ダッシュボード"
      subtitle="歌ってみたリクエストと依頼の状況"
      headRight={
        <span className={`admin-pill ${storageMode() === "supabase" ? "" : "warn"}`}>
          {storageMode() === "supabase" ? "Supabase 接続中" : "ローカルJSON (開発用)"}
        </span>
      }
    >
      {loadError && (
        <div className="panel" style={{ borderColor: "rgba(255,133,133,0.4)" }}>
          データの読み込みに失敗しました。Supabase の設定を確認してください。
        </div>
      )}

      <div className="kpi-grid">
        <div className="kpi">
          <div className="k-label">総リクエスト</div>
          <div className="k-num">
            {songs.length}
            <em>件</em>
          </div>
          <div className={`k-delta ${delta === 0 ? "flat" : ""}`}>
            直近7日 {last7}件 ({delta >= 0 ? "+" : ""}
            {delta})
          </div>
        </div>
        <div className="kpi">
          <div className="k-label">ユニーク楽曲</div>
          <div className="k-num">
            {songRanking.length}
            <em>曲</em>
          </div>
          <div className="k-delta flat">アーティスト {artistRanking.length}組</div>
        </div>
        <div className="kpi">
          <div className="k-label">制作依頼</div>
          <div className="k-num">
            {commissions.length}
            <em>件</em>
          </div>
          <div className="k-delta flat">直近7日 {countWithinDays(commissions, 7)}件</div>
        </div>
        <div className="kpi">
          <div className="k-label">1曲あたり平均</div>
          <div className="k-num">
            {songRanking.length ? (songs.length / songRanking.length).toFixed(1) : "0.0"}
            <em>件</em>
          </div>
          <div className="k-delta flat">
            最多 {songRanking[0]?.count ?? 0}件
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>リクエスト推移</h2>
          <span className="note">直近14日 / 日別件数</span>
        </div>
        {songs.length === 0 ? (
          <div className="empty">まだデータがありません</div>
        ) : (
          <div className="chart">
            {chart.map((c) => (
              <div className="col" key={c.label}>
                <span className="val">{c.count || ""}</span>
                <span
                  className="bar"
                  data-v={c.count}
                  style={{ height: `${(c.count / chartMax) * 100}%` }}
                />
                <span className="cap">{c.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel-grid">
        <div className="panel">
          <div className="panel-head">
            <h2>曲別ランキング</h2>
            <Link href={`${basePath}/requests`} className="note">
              すべて見る →
            </Link>
          </div>
          {songRanking.length === 0 ? (
            <div className="empty">まだリクエストがありません</div>
          ) : (
            <div className="a-rank">
              {songRanking.slice(0, 8).map((s, i) => (
                <div className="a-rank-row" key={s.key}>
                  <div className="n">{i + 1}</div>
                  <div className="t">
                    <div className="nm">{s.song_title}</div>
                    <div className="sub">{s.artist_name || "アーティスト未記入"}</div>
                  </div>
                  <div className="c">
                    {s.count}
                    <small> 件</small>
                  </div>
                  <div className="track">
                    <i style={{ width: `${Math.max(6, (s.count / maxCount) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>アーティスト別</h2>
            <span className="note">上位10組</span>
          </div>
          {artistRanking.length === 0 ? (
            <div className="empty">アーティスト名の記入があると集計されます</div>
          ) : (
            <div className="a-rank">
              {artistRanking.slice(0, 10).map(([artist, count], i) => (
                <div className="a-rank-row" key={artist}>
                  <div className="n">{i + 1}</div>
                  <div className="t">
                    <div className="nm">{artist}</div>
                  </div>
                  <div className="c">
                    {count}
                    <small> 件</small>
                  </div>
                  <div className="track">
                    <i
                      style={{
                        width: `${Math.max(
                          6,
                          (count / (artistRanking[0]?.[1] ?? 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>最近のリクエスト</h2>
          <Link href={`${basePath}/requests`} className="note">
            すべて見る →
          </Link>
        </div>
        {songs.length === 0 ? (
          <div className="empty">まだリクエストがありません</div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>日時</th>
                  <th>曲名</th>
                  <th>アーティスト</th>
                  <th>差出人</th>
                  <th>コメント</th>
                </tr>
              </thead>
              <tbody>
                {songs.slice(0, 8).map((r) => (
                  <tr key={r.id}>
                    <td className="dim">{fmtDateTime(r.created_at)}</td>
                    <td>
                      {r.song_title}
                      {r.reference_url && (
                        <div>
                          <a href={r.reference_url} target="_blank" rel="noopener noreferrer">
                            URL
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="dim">{r.artist_name || "—"}</td>
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

import type { SongRequest } from "./store";

export type SongAggregate = {
  key: string;
  song_title: string;
  artist_name: string | null;
  count: number;
  latest: string;
};

export function aggregateSongs(rows: SongRequest[]) {
  const bySong = new Map<string, SongAggregate>();
  const byArtist = new Map<string, number>();

  for (const r of rows) {
    const key = `${r.song_title.toLowerCase().trim()}||${(r.artist_name ?? "")
      .toLowerCase()
      .trim()}`;
    const existing = bySong.get(key);
    if (existing) {
      existing.count += 1;
      if (r.created_at > existing.latest) existing.latest = r.created_at;
    } else {
      bySong.set(key, {
        key,
        song_title: r.song_title,
        artist_name: r.artist_name,
        count: 1,
        latest: r.created_at,
      });
    }

    const artist = (r.artist_name ?? "").trim();
    if (artist) byArtist.set(artist, (byArtist.get(artist) ?? 0) + 1);
  }

  return {
    songRanking: [...bySong.values()].sort(
      (a, b) => b.count - a.count || (a.latest < b.latest ? 1 : -1)
    ),
    artistRanking: [...byArtist.entries()].sort((a, b) => b[1] - a[1]),
  };
}

/** 直近 days 日の日別件数 (古い順) */
export function dailyCounts(rows: { created_at: string }[], days = 14) {
  const buckets: { date: Date; label: string; count: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({
      date: d,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count: 0,
    });
  }

  const first = buckets[0].date.getTime();
  for (const r of rows) {
    const t = new Date(r.created_at);
    if (Number.isNaN(t.getTime())) continue;
    t.setHours(0, 0, 0, 0);
    if (t.getTime() < first) continue;
    const idx = Math.round((t.getTime() - first) / 86400000);
    if (idx >= 0 && idx < buckets.length) buckets[idx].count += 1;
  }

  return buckets;
}

/** 指定日数以内の件数 */
export function countWithinDays(rows: { created_at: string }[], days: number): number {
  const since = Date.now() - days * 86400000;
  return rows.filter((r) => new Date(r.created_at).getTime() >= since).length;
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${fmtDate(iso)} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

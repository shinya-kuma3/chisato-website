import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// ---------------------------------------------------------------
// データ層: Supabase (REST) / ローカルJSONファイル の切り替え
// SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が設定されていれば Supabase、
// 未設定なら .data/ 配下のJSONファイルに保存する (ローカル開発用)。
// ---------------------------------------------------------------

export type SongRequest = {
  id: string;
  song_title: string;
  artist_name: string | null;
  reference_url: string | null;
  comment: string | null;
  nickname: string | null;
  created_at: string;
};

export type CommissionRequest = {
  id: string;
  category: string;
  name: string;
  contact: string;
  details: string;
  budget: string | null;
  created_at: string;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function storageMode(): "supabase" | "file" {
  return SUPABASE_URL && SUPABASE_KEY ? "supabase" : "file";
}

// ---------------- Supabase (PostgREST) ----------------

function sbHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_KEY as string,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };
}

async function sbSelect<T>(table: string): Promise<T[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`Supabase select failed (${table}): ${res.status}`);
  }
  return res.json();
}

async function sbInsert(table: string, row: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...sbHeaders(),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed (${table}): ${res.status} ${text}`);
  }
}

// ---------------- ローカルJSONフォールバック ----------------

const dataDir = path.join(process.cwd(), ".data");

async function fileRead<T>(name: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(dataDir, name), "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function filePrepend<T>(name: string, row: T): Promise<void> {
  const rows = await fileRead<T>(name);
  rows.unshift(row);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, name), JSON.stringify(rows, null, 2), "utf8");
}

// ---------------- 公開API ----------------

export async function listSongRequests(): Promise<SongRequest[]> {
  if (storageMode() === "supabase") {
    return sbSelect<SongRequest>("song_requests");
  }
  return fileRead<SongRequest>("song_requests.json");
}

export async function addSongRequest(input: {
  song_title: string;
  artist_name?: string | null;
  reference_url?: string | null;
  comment?: string | null;
  nickname?: string | null;
}): Promise<void> {
  const row = {
    song_title: input.song_title,
    artist_name: input.artist_name || null,
    reference_url: input.reference_url || null,
    comment: input.comment || null,
    nickname: input.nickname || null,
  };
  if (storageMode() === "supabase") {
    await sbInsert("song_requests", row);
    return;
  }
  await filePrepend<SongRequest>("song_requests.json", {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...row,
  });
}

export async function listCommissionRequests(): Promise<CommissionRequest[]> {
  if (storageMode() === "supabase") {
    return sbSelect<CommissionRequest>("commission_requests");
  }
  return fileRead<CommissionRequest>("commission_requests.json");
}

export async function addCommissionRequest(input: {
  category: string;
  name: string;
  contact: string;
  details: string;
  budget?: string | null;
}): Promise<void> {
  const row = {
    category: input.category,
    name: input.name,
    contact: input.contact,
    details: input.details,
    budget: input.budget || null,
  };
  if (storageMode() === "supabase") {
    await sbInsert("commission_requests", row);
    return;
  }
  await filePrepend<CommissionRequest>("commission_requests.json", {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...row,
  });
}

import { NextResponse } from "next/server";
import { addSongRequest, listSongRequests } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await listSongRequests();
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch {
    /* noop */
  }
  if (!body) {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  // ハニーポット (botはこの隠しフィールドを埋めるので黙って捨てる)
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const songTitle = str(body.song_title);
  const referenceUrl = str(body.reference_url);

  if (!songTitle && !referenceUrl) {
    return NextResponse.json(
      { error: "曲名または動画URLのどちらかを入力してください" },
      { status: 400 }
    );
  }
  if (referenceUrl && !/^https?:\/\//.test(referenceUrl)) {
    return NextResponse.json(
      { error: "URLは http:// または https:// から始めてください" },
      { status: 400 }
    );
  }

  try {
    await addSongRequest({
      song_title: songTitle || "(URLのみのリクエスト)",
      artist_name: str(body.artist_name).slice(0, 200) || null,
      reference_url: referenceUrl.slice(0, 500) || null,
      comment: str(body.comment).slice(0, 1000) || null,
      nickname: str(body.nickname).slice(0, 100) || null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}

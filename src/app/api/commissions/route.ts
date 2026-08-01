import { NextResponse } from "next/server";
import { addCommissionRequest } from "@/lib/store";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  "作詞作曲",
  "ミキシング",
  "マスタリング",
  "イラスト",
  "MV制作",
  "コラボ",
  "その他",
];

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

  // ハニーポット
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const category = str(body.category);
  const name = str(body.name);
  const contact = str(body.contact);
  const details = str(body.details);

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "依頼カテゴリを選択してください" }, { status: 400 });
  }
  if (!name || !contact || !details) {
    return NextResponse.json(
      { error: "お名前・連絡先・依頼内容は必須です" },
      { status: 400 }
    );
  }

  try {
    await addCommissionRequest({
      category,
      name: name.slice(0, 200),
      contact: contact.slice(0, 300),
      details: details.slice(0, 3000),
      budget: str(body.budget).slice(0, 200) || null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}

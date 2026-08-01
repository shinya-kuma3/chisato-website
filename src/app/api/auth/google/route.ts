import { NextResponse } from "next/server";
import {
  STATE_COOKIE,
  NEXT_COOKIE,
  googleAuthConfigured,
  googleAuthUrl,
  randomState,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  if (!googleAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Google認証が未設定です。GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / AUTH_SECRET / ADMIN_EMAILS を .env.local に設定してください。",
      },
      { status: 500 }
    );
  }

  // ログイン後の戻り先 (オープンリダイレクト防止のため自サイト内パスのみ許可)
  const rawNext = url.searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  const state = randomState();
  const res = NextResponse.redirect(googleAuthUrl(origin, state));

  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600, // 10分
  };
  res.cookies.set(STATE_COOKIE, state, opts);
  res.cookies.set(NEXT_COOKIE, next, opts);

  return res;
}

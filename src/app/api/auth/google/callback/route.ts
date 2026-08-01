import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  STATE_COOKIE,
  NEXT_COOKIE,
  allowedEmails,
  createSessionToken,
  exchangeCodeForProfile,
  googleAuthConfigured,
  sessionCookieOptions,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

function deny(origin: string, reason: string) {
  const res = NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(reason)}`);
  res.cookies.delete(STATE_COOKIE);
  res.cookies.delete(NEXT_COOKIE);
  return res;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  if (!googleAuthConfigured()) {
    return deny(origin, "not_configured");
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (url.searchParams.get("error") || !code || !state) {
    return deny(origin, "cancelled");
  }

  // CSRF対策: 発行時のstateと一致するか
  const cookieHeader = req.headers.get("cookie") ?? "";
  const readCookie = (name: string) =>
    cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`))
      ?.slice(name.length + 1);

  if (readCookie(STATE_COOKIE) !== state) {
    return deny(origin, "state_mismatch");
  }

  const profile = await exchangeCodeForProfile(code, origin);
  if (!profile) {
    return deny(origin, "token_exchange_failed");
  }

  // 許可リストにないアカウントは弾く
  if (!allowedEmails().includes(profile.email.toLowerCase())) {
    return deny(origin, "not_allowed");
  }

  const next = readCookie(NEXT_COOKIE);
  const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const res = NextResponse.redirect(`${origin}${decodeURIComponent(dest)}`);
  res.cookies.set(SESSION_COOKIE, createSessionToken(profile.email), sessionCookieOptions());
  res.cookies.delete(STATE_COOKIE);
  res.cookies.delete(NEXT_COOKIE);
  return res;
}

import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";

// ------------------------------------------------------------------
// 管理者認証 (Google OAuth 2.0 / 外部ライブラリなし)
//
//  1. /api/auth/google        → Googleの同意画面へリダイレクト
//  2. /api/auth/google/callback → コードをトークンに交換し、
//                                 メールが許可リストにあればセッション発行
//  3. セッションは HMAC-SHA256 で署名した HttpOnly Cookie
// ------------------------------------------------------------------

export const SESSION_COOKIE = "chisato_admin";
export const STATE_COOKIE = "chisato_oauth_state";
export const NEXT_COOKIE = "chisato_oauth_next";

const SESSION_MAX_AGE = 60 * 60 * 12; // 12時間

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET が未設定です。.env.local に 32文字以上のランダム文字列を設定してください。"
    );
  }
  return s;
}

/** 管理者として許可するGoogleアカウントのメールアドレス (カンマ区切り) */
export function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** 管理画面の秘密URLセグメント。未設定ならログインもできない */
export function adminPathKey(): string | null {
  const k = process.env.ADMIN_PATH_KEY;
  return k && k.length >= 8 ? k : null;
}

export function isValidAdminPath(key: string): boolean {
  const expected = adminPathKey();
  if (!expected) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------------- セッショントークン ----------------

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${Buffer.from(email).toString("base64url")}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): { email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailB64, expStr, sig] = parts;
  const payload = `${emailB64}.${expStr}`;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }
  if (Number(expStr) < Math.floor(Date.now() / 1000)) return null;

  const email = Buffer.from(emailB64, "base64url").toString("utf8");
  if (!allowedEmails().includes(email.toLowerCase())) return null;
  return { email };
}

/** 現在のリクエストのログイン管理者を返す (未ログインなら null) */
export async function getAdminSession(): Promise<{ email: string } | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function randomState(): string {
  return randomBytes(24).toString("base64url");
}

// ---------------- Google OAuth ----------------

export function googleClientId(): string | null {
  return process.env.GOOGLE_CLIENT_ID || null;
}

export function googleAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.AUTH_SECRET &&
      allowedEmails().length > 0
  );
}

/** リダイレクトURI。Google Cloud 側の「承認済みのリダイレクトURI」と完全一致させる */
export function redirectUri(origin: string): string {
  return process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
}

export function googleAuthUrl(origin: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: redirectUri(origin),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "online",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

type GoogleIdTokenPayload = {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  aud?: string;
  iss?: string;
  exp?: number;
};

/**
 * 認可コードをIDトークンに交換して中身を返す。
 * トークンはGoogleのエンドポイントからHTTPSで直接取得しているため、
 * ここではJWKSによる署名検証は省略し、aud/iss/exp/email_verified を検証する。
 */
export async function exchangeCodeForProfile(
  code: string,
  origin: string
): Promise<{ email: string; name?: string; picture?: string } | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirect_uri: redirectUri(origin),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Google token exchange failed:", res.status, await res.text());
    return null;
  }

  const data = (await res.json()) as { id_token?: string };
  if (!data.id_token) return null;

  const segments = data.id_token.split(".");
  if (segments.length !== 3) return null;

  let payload: GoogleIdTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(segments[1], "base64url").toString("utf8"));
  } catch {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== process.env.GOOGLE_CLIENT_ID) return null;
  if (payload.iss !== "accounts.google.com" && payload.iss !== "https://accounts.google.com") {
    return null;
  }
  if (!payload.exp || payload.exp < now) return null;
  if (!payload.email || payload.email_verified === false) return null;

  return { email: payload.email, name: payload.name, picture: payload.picture };
}

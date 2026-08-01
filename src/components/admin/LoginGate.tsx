const ERRORS: Record<string, string> = {
  not_allowed: "そのGoogleアカウントは管理者として許可されていません。",
  state_mismatch: "セッションの検証に失敗しました。もう一度お試しください。",
  token_exchange_failed: "Googleとの通信に失敗しました。もう一度お試しください。",
  cancelled: "ログインがキャンセルされました。",
  not_configured: "Google認証が未設定です。環境変数を確認してください。",
};

export default function LoginGate({
  next,
  error,
  configured,
}: {
  next: string;
  error?: string;
  configured: boolean;
}) {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="lock">🔒</div>
        <h1>CHISATO CONSOLE</h1>
        <p>管理者専用ページです</p>

        {error && ERRORS[error] && <div className="login-error">{ERRORS[error]}</div>}

        {configured ? (
          <a className="google-btn" href={`/api/auth/google?next=${encodeURIComponent(next)}`}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.9 6.2C12.3 13.2 17.7 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.9c-.3 2.1-1.7 5.3-4.9 7.4l7.6 5.9c4.5-4.2 6.9-10.3 6.9-17z"
              />
              <path
                fill="#FBBC05"
                d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.2C.9 16.4 0 20.1 0 24s.9 7.6 2.5 10.8l7.9-6.2z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2 1.4-4.8 2.4-8.3 2.4-6.3 0-11.7-3.7-13.6-9.1l-7.9 6.2C6.5 42.6 14.6 48 24 48z"
              />
            </svg>
            Googleでログイン
          </a>
        ) : (
          <div className="login-error">
            Google認証が未設定です。<code>.env.local</code> に GOOGLE_CLIENT_ID /
            GOOGLE_CLIENT_SECRET / AUTH_SECRET / ADMIN_EMAILS を設定してください。
          </div>
        )}

        <div className="login-note">
          許可されたGoogleアカウントのみアクセスできます。
          <br />
          このURLは公開サイトのどこからもリンクされていません。
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

type Status = { type: "idle" } | { type: "sending" } | { type: "ok" } | { type: "error"; message: string };

export default function RequestForm() {
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [comment, setComment] = useState("");
  const [nickname, setNickname] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!songTitle.trim() && !referenceUrl.trim()) {
      setStatus({ type: "error", message: "曲名または動画URLのどちらかを入力してください" });
      return;
    }
    setStatus({ type: "sending" });
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          song_title: songTitle,
          artist_name: artistName,
          reference_url: referenceUrl,
          comment,
          nickname,
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "送信に失敗しました" });
        return;
      }
      setStatus({ type: "ok" });
      setSongTitle("");
      setArtistName("");
      setReferenceUrl("");
      setComment("");
    } catch {
      setStatus({ type: "error", message: "通信エラーが発生しました。時間をおいて再度お試しください" });
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {status.type === "ok" && (
        <div className="form-message ok">
          リクエストを受け付けました。ありがとうございます! 続けて送ることもできます。
        </div>
      )}
      {status.type === "error" && (
        <div className="form-message error">{status.message}</div>
      )}

      <div className="field">
        <label htmlFor="song_title">
          曲名<span className="req">※曲名かURLのどちらか必須</span>
        </label>
        <input
          id="song_title"
          type="text"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          placeholder="例: 夜に駆ける"
          maxLength={200}
        />
      </div>

      <div className="field">
        <label htmlFor="artist_name">
          アーティスト名<span className="opt">任意</span>
        </label>
        <input
          id="artist_name"
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="例: YOASOBI"
          maxLength={200}
        />
      </div>

      <div className="field">
        <label htmlFor="reference_url">
          動画URL<span className="opt">任意 (YouTube / ニコニコ動画 など)</span>
        </label>
        <input
          id="reference_url"
          type="url"
          value={referenceUrl}
          onChange={(e) => setReferenceUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          maxLength={500}
        />
        <div className="hint">URLだけの投稿でもOKです。</div>
      </div>

      <div className="field">
        <label htmlFor="comment">
          コメント<span className="opt">任意</span>
        </label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="例: サビの高音がチサトさんの声に合いそうです!"
          maxLength={1000}
        />
      </div>

      <div className="field">
        <label htmlFor="nickname">
          ニックネーム<span className="opt">任意</span>
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例: リスナーA"
          maxLength={100}
        />
      </div>

      {/* スパム対策用の隠しフィールド (人間には見えません) */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button type="submit" className="btn btn-accent" disabled={status.type === "sending"}>
          {status.type === "sending" ? "送信中..." : "リクエストを送信"}
        </button>
      </div>
    </form>
  );
}

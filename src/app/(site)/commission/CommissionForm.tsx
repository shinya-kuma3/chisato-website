"use client";

import { useState } from "react";

type Status = { type: "idle" } | { type: "sending" } | { type: "ok" } | { type: "error"; message: string };

const CATEGORIES = [
  "作詞作曲",
  "ミキシング",
  "マスタリング",
  "イラスト",
  "MV制作",
  "コラボ",
  "その他",
];

export default function CommissionForm() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !details.trim()) {
      setStatus({ type: "error", message: "お名前・連絡先・依頼内容は必須です" });
      return;
    }
    setStatus({ type: "sending" });
    try {
      const res = await fetch("/api/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name, contact, details, budget, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "送信に失敗しました" });
        return;
      }
      setStatus({ type: "ok" });
      setDetails("");
      setBudget("");
    } catch {
      setStatus({ type: "error", message: "通信エラーが発生しました。時間をおいて再度お試しください" });
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {status.type === "ok" && (
        <div className="form-message ok">
          ご依頼を受け付けました。内容を確認のうえ、ご記入いただいた連絡先へ返信します。
        </div>
      )}
      {status.type === "error" && (
        <div className="form-message error">{status.message}</div>
      )}

      <div className="field">
        <label htmlFor="category">
          依頼カテゴリ<span className="req">必須</span>
        </label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="name">
          お名前 / 活動名<span className="req">必須</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
        />
      </div>

      <div className="field">
        <label htmlFor="contact">
          連絡先<span className="req">必須</span>
        </label>
        <input
          id="contact"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="メールアドレス / X(Twitter) ID など"
          maxLength={300}
        />
      </div>

      <div className="field">
        <label htmlFor="details">
          依頼内容<span className="req">必須</span>
        </label>
        <textarea
          id="details"
          rows={6}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="内容・用途・希望納期などをできるだけ具体的にお書きください"
          maxLength={3000}
        />
      </div>

      <div className="field">
        <label htmlFor="budget">
          ご予算感<span className="opt">任意</span>
        </label>
        <input
          id="budget"
          type="text"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="例: 3万円前後 / 応相談"
          maxLength={200}
        />
      </div>

      {/* スパム対策用の隠しフィールド */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website2">Website</label>
        <input
          id="website2"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button type="submit" className="btn btn-navy" disabled={status.type === "sending"}>
          {status.type === "sending" ? "送信中..." : "依頼を送信"}
        </button>
      </div>
    </form>
  );
}

import type { Metadata } from "next";
import IllustrationPlaceholder from "@/components/IllustrationPlaceholder";
import CommissionForm from "./CommissionForm";
import { portfolio } from "@/data/portfolio";

export const metadata: Metadata = { title: "ご依頼" };

const categories = [
  {
    name: "作詞作曲",
    desc: "オリジナル楽曲の作詞・作曲・編曲。歌ってみた用のオケ制作もご相談ください。",
    illust: {
      title: "作詞作曲 カテゴリイラスト",
      size: "600×600 / 1:1",
      description:
        "散らかったデスクで歌詞ノートに向かうチサトのバストアップ。ペンを持つ手を止めて頬杖をつき、穏やかに考えごとをする表情。かたわらに食べかけのカップラーメンとホイップクリームのカップ。頭上に小さな音符の吹き出し。",
    },
  },
  {
    name: "ミキシング",
    desc: "歌ってみたのMIX。ウィスパー系や繊細な声質の質感を活かす調整が得意です。",
    illust: {
      title: "ミキシング カテゴリイラスト",
      size: "600×600 / 1:1",
      description:
        "ヘッドホンを付け、DAWの画面と向き合うチサトの横顔バストアップ。フェーダーに指を添え、真剣モードで目に光がないいつもの真顔(ご愛嬌)。画面の波形はティール色で発光させ、暗めの部屋にモニターの光が当たる構図。",
    },
  },
  {
    name: "マスタリング",
    desc: "音圧・質感の最終調整。配信プラットフォームに合わせた仕上げまで対応します。",
    illust: {
      title: "マスタリング カテゴリイラスト",
      size: "600×600 / 1:1",
      description:
        "スタジオモニタースピーカーの間で腕を組み、目を閉じて音を聴き比べるチサトの上半身。犬耳だけがピンと立って集中していることが伝わる構図。背景にレベルメーターの光の柱を左右対称に。",
    },
  },
  {
    name: "イラスト",
    desc: "サムネイル・立ち絵・ファンアート等のイラスト制作。すべて手描きで制作します(AI不使用)。",
    illust: {
      title: "イラスト カテゴリイラスト",
      size: "600×600 / 1:1",
      description:
        "ペンタブに向かうチサトが、ふと手を止めてこちらを振り返る構図。控えめな微笑みで、右手のタッチペンを軽く持ち上げて挨拶。画面には描きかけのラフをうっすら見せる。肩にブランケットを掛けて引きこもり感を少し。",
    },
  },
  {
    name: "MV制作",
    desc: "歌ってみた・オリジナル曲のミュージックビデオ制作。絵コンテからの相談も歓迎です。",
    illust: {
      title: "MV制作 カテゴリイラスト",
      size: "600×600 / 1:1",
      description:
        "フィルムのコマ枠が斜めに流れる背景の前で、絵コンテのノートを両手で広げて見せるチサト。少し照れたような表情で目線はノートへ。コマの中に小さくカット案の落書きを描き込む。",
    },
  },
  {
    name: "コラボ",
    desc: "歌ってみたコラボ・企画参加など。人見知りですが、お声がけいただけるととても喜びます。",
    illust: {
      title: "コラボ カテゴリイラスト",
      size: "600×600 / 1:1",
      description:
        "画面手前に向かって、少し遠慮がちに右手を差し出すチサト。目線はカメラ、眉は少し下がった照れ笑いで「よかったら、一緒にやりませんか」の空気感。差し出した手のひらは大きめに描くパース構図。尻尾は嬉しさを隠せず小さく揺れている。",
    },
  },
];

export default function CommissionPage() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">
          <span className="en">COMMISSION</span>部屋の隅の仕事机
        </h2>
        <p className="section-desc">
          作詞作曲・ミキシング・マスタリング・イラスト・MV制作・コラボのご依頼を受け付けています。
          料金は内容により変動するため、まずは下のフォームからご相談ください。
        </p>

        <div className="grid-3" style={{ marginBottom: 40 }}>
          {categories.map((c) => (
            <div className="card" key={c.name}>
              <IllustrationPlaceholder
                title={c.illust.title}
                size={c.illust.size}
                ratio="1 / 1"
                minHeight={220}
                description={c.illust.description}
              />
              <h3 style={{ marginTop: 14 }}>{c.name}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: 10 }}>料金の目安</h3>
        <div style={{ overflowX: "auto", marginBottom: 12 }}>
          <table className="price-table">
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>内容</th>
                <th>目安納期</th>
                <th>料金</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>作詞作曲</td>
                <td>フルコーラス 1曲 (作詞+作曲)</td>
                <td>2〜6週間</td>
                <td>応相談</td>
              </tr>
              <tr>
                <td>ミキシング</td>
                <td>歌ってみたMIX (2mix+ボーカル)</td>
                <td>3日〜2週間</td>
                <td>応相談</td>
              </tr>
              <tr>
                <td>マスタリング</td>
                <td>1曲 (配信用の最終仕上げ)</td>
                <td>2日〜1週間</td>
                <td>応相談</td>
              </tr>
              <tr>
                <td>イラスト</td>
                <td>サムネイル / 一枚絵</td>
                <td>1〜3週間</td>
                <td>応相談</td>
              </tr>
              <tr>
                <td>MV制作</td>
                <td>リリックビデオ〜フルMV</td>
                <td>3〜8週間</td>
                <td>応相談</td>
              </tr>
              <tr>
                <td>コラボ</td>
                <td>歌ってみたコラボ・企画参加</td>
                <td>内容による</td>
                <td>原則無償〜応相談</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="section-desc" style={{ fontSize: "0.82rem", marginBottom: 40 }}>
          ※ 表は仮の内容です。実際の料金・納期に合わせて書き換えてください。
        </p>

        <h3 style={{ marginBottom: 10 }}>
          <span
            className="en"
            style={{
              display: "block",
              fontSize: "0.72rem",
              color: "var(--teal)",
              letterSpacing: "0.25em",
              fontWeight: 700,
            }}
          >
            PORTFOLIO
          </span>
          制作実績
        </h3>
        <p className="section-desc">
          これまでの制作実績の一部です。依頼のご検討にお役立てください。
          (実績は <code>src/data/portfolio.ts</code> に追記するだけで増やせます)
        </p>
        {portfolio.length === 0 ? (
          <p style={{ color: "var(--navy-soft)", marginBottom: 40 }}>実績は準備中です。</p>
        ) : (
          <div className="grid-3" style={{ marginBottom: 40 }}>
            {portfolio.map((p) => (
              <div className="card" key={p.title}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <span className="badge">{p.category}</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--navy-soft)" }}>{p.year}</span>
                </div>
                <h3 style={{ fontSize: "1rem" }}>{p.title}</h3>
                <p>{p.description}</p>
                {p.url && (
                  <p style={{ marginTop: 10 }}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      作品を見る →
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <h3 style={{ marginBottom: 14 }}>依頼フォーム</h3>
        <CommissionForm />
      </div>
    </section>
  );
}

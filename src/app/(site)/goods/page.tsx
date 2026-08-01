import type { Metadata } from "next";
import IllustrationPlaceholder from "@/components/IllustrationPlaceholder";
import Particles from "@/components/Particles";

export const metadata: Metadata = { title: "グッズ" };

const goods = [
  {
    name: "アクリルスタンド",
    price: "¥1,800 (予定)",
    status: "準備中",
    illust: {
      title: "アクスタ用イラスト",
      size: "1000×1400 / 縦長 (透過PNG)",
      description:
        "全身のデフォルメ強めイラスト。ヘッドホンを首に掛け、両手でマイクをそっと持って照れ笑いするおっとりポーズ。尻尾は嬉しさがこぼれて小さく揺れている。輪郭を白フチ+青フチの二重にするとアクスタ映えする。",
    },
  },
  {
    name: "缶バッジ (2種)",
    price: "¥500 (予定)",
    status: "準備中",
    illust: {
      title: "缶バッジ用イラスト",
      size: "1200×1200 / 円形入稿",
      description:
        "円形トリミング前提の顔アップ2種。(1)ふにゃっと柔らかい微笑み (2)目に光がない真顔(ネタ枠として人気が出るやつ)。円の中心に顔がくるよう垂れ耳の先まで円内に収める。",
    },
  },
  {
    name: "Tシャツ",
    price: "¥3,500 (予定)",
    status: "準備中",
    illust: {
      title: "Tシャツ用デザイン",
      size: "3000×3000 / 1:1 (印刷用高解像度)",
      description:
        "胸面プリント用の1色〜3色デザイン。チサトのシルエット(横顔+ヘッドホン)と波形ラインを組み合わせたロゴ風グラフィック。文字「CHISATO」を添える。濃紺ボディに白+ティール刷りを想定。",
    },
  },
  {
    name: "ステッカーセット",
    price: "¥800 (予定)",
    status: "準備中",
    illust: {
      title: "ステッカー用イラスト (4点セット)",
      size: "各800×800 / ダイカット",
      description:
        "表情違いのSDチサト4種: (1)マイクを両手にささやき歌唱 (2)カップラーメンをすする (3)ホイップクリームをスプーンで幸せそうに食べる (4)ブランケットにくるまってうとうと。各ポーズとも輪郭太めでダイカットしやすい形に。",
    },
  },
];

export default function GoodsPage() {
  return (
    <>
      <Particles />
      <section className="section">
      <div className="container">
        <h2 className="section-title">
          <span className="en">GOODS</span>棚の上のコレクション
        </h2>
        <p className="section-desc">
          チサトのグッズラインナップです。現在すべて準備中。販売開始はお知らせでご案内します。
          (価格・仕様は仮のものです)
        </p>

        <div className="grid-2">
          {goods.map((g) => (
            <div className="card" key={g.name}>
              <IllustrationPlaceholder
                title={g.illust.title}
                size={g.illust.size}
                ratio="1 / 1"
                minHeight={240}
                description={g.illust.description}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <h3 style={{ margin: 0 }}>{g.name}</h3>
                <span className="badge">{g.status}</span>
              </div>
              <p style={{ marginTop: 6 }}>{g.price}</p>
            </div>
          ))}
        </div>
      </div>
      </section>
    </>
  );
}

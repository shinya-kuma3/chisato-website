// 制作実績 (ポートフォリオ)
// ここに実績を追記するだけで依頼ページに表示されます。
// url は YouTube / ニコニコ / pixiv などのリンク (任意)。

export type PortfolioItem = {
  title: string;
  category:
    | "作詞作曲"
    | "ミキシング"
    | "マスタリング"
    | "イラスト"
    | "MV制作"
    | "コラボ";
  year: string;
  url?: string;
  description: string;
};

export const portfolio: PortfolioItem[] = [
  {
    title: "(サンプル) 歌ってみた「〇〇」MIX担当",
    category: "ミキシング",
    year: "2026",
    url: "https://www.youtube.com/",
    description:
      "ウィスパー系ボーカルの質感を残したまま抜けを良くしたMIX。※サンプルです。実績に差し替えてください。",
  },
  {
    title: "(サンプル) オリジナル曲「〇〇」作詞作曲",
    category: "作詞作曲",
    year: "2026",
    description:
      "バラード寄りのオリジナル曲。作詞・作曲・編曲まで担当。※サンプルです。",
  },
  {
    title: "(サンプル) 「〇〇」歌ってみたサムネイル",
    category: "イラスト",
    year: "2025",
    description: "手描きのサムネイルイラスト (AI不使用)。※サンプルです。",
  },
];

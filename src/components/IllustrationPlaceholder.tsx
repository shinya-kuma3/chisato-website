type Props = {
  /** 枠の用途名 (例: メインビジュアル) */
  title: string;
  /** 推奨サイズ・比率 (例: 1920×1080 / 16:9) */
  size: string;
  /** 構図・ポーズの指示テキスト */
  description: string;
  /** CSS aspect-ratio (例: "16 / 9") */
  ratio?: string;
  /** 最低高さ (px) */
  minHeight?: number;
};

/**
 * 手描きイラストが完成するまでの仮枠。
 * 実際の掲載サイズの枠の中央に、描くべき構図・ポーズをテキストで表示する。
 * イラスト完成後はこのコンポーネントを <Image> に差し替える。
 */
export default function IllustrationPlaceholder({
  title,
  size,
  description,
  ratio = "16 / 9",
  minHeight = 200,
}: Props) {
  return (
    <div className="illust-frame" style={{ aspectRatio: ratio, minHeight }}>
      <div className="inner">
        <span className="tag">ILLUST 枠</span>
        <div className="title">{title}</div>
        <div className="size">推奨: {size}</div>
        <p className="desc">{description}</p>
      </div>
    </div>
  );
}

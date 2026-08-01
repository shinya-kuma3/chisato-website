import type { Metadata } from "next";
import IllustrationPlaceholder from "@/components/IllustrationPlaceholder";
import Particles from "@/components/Particles";
import RequestForm from "./RequestForm";

export const metadata: Metadata = { title: "歌ってみたリクエスト" };

export default function RequestPage() {
  return (
    <>
      <Particles />
      <section className="section">
      <div className="container">
        <h2 className="section-title">
          <span className="en">SONG REQUEST</span>ドアの下から届く手紙
        </h2>
        <p className="section-desc">
          チサトに歌ってほしい曲を、手紙にして部屋のドアの下から差し込んでください。
          曲名だけでも、動画URLだけでも大丈夫です。届いた手紙は全部読んで、
          次に歌う曲の参考にさせてもらいます。
        </p>

        <div style={{ marginBottom: 32 }}>
          <IllustrationPlaceholder
            title="リクエストページ ヘッダーバナー"
            size="1600×500 / 約3:1 (横長バナー)"
            ratio="16 / 5"
            minHeight={160}
            description="横長バナー。薄暗い部屋の床にぺたんと座るチサトを画面左1/3に。ドアの下から差し込まれた手紙を両手で大事そうに持ち、モニターの光を頼りに読んでいる。目を細めた嬉しそうで控えめな微笑み。右2/3は暗いブルーの壁で、ドアの隙間から廊下の暖色の光が一筋伸び、その光の帯に沿って手紙が数枚散らばる。白文字「SONG REQUEST」を重ねる余白を右側に確保。"
          />
        </div>

        <RequestForm />
      </div>
      </section>
    </>
  );
}

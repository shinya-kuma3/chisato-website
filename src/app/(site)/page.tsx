import Link from "next/link";
import IllustrationPlaceholder from "@/components/IllustrationPlaceholder";

export default function HomePage() {
  return (
    <>
      {/* ヒーロー: 深夜のチサトの部屋 */}
      <section className="hero">
        <div className="room-scene" aria-hidden="true">
          <div className="room-window">
            <span className="win-bar-v" />
            <span className="win-bar-h" />
            <span className="moon" />
            <span className="star s1" />
            <span className="star s2" />
            <span className="star s3" />
          </div>
          <div className="desk-zone">
            <span className="desk-glow" />
            <span className="monitor">
              <span className="screen" />
            </span>
            <span className="desk-line" />
          </div>
          <div className="particles">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="container">
          <div>
            <p className="hero-loc">AM 2:00 — チサトの部屋</p>
            <h1>
              暗い部屋の隅っこから、
              <br />
              そっと歌ってる。<span className="cursor">▍</span>
            </h1>
            <p className="lead">
              白い犬の獣人の歌い手・チサト。息交じりのウィスパーボイスと、
              たまに本気のハイトーン。ここはチサトが引きこもっている部屋(のサイト)です。
              散らかっててごめんなさい。ゆっくりしていってください。
            </p>
            <div className="actions">
              <Link href="/request" className="btn btn-primary">
                歌ってみたをリクエスト
              </Link>
              <Link href="/commission" className="btn btn-outline">
                制作のご依頼
              </Link>
            </div>
          </div>
          <IllustrationPlaceholder
            title="メインビジュアル: 深夜の部屋のチサト"
            size="1600×1200 / 4:3 (このサイトの世界観を決める1枚)"
            ratio="4 / 3"
            description="深夜の薄暗い自室の全景。光源はPCモニターのティールの光と、窓から差す月明かりの2つだけ。中央の机にデュアルモニター・オーディオインターフェース・コンデンサーマイク。壁際にギターと電子ピアノを立てかけ、床にはカップラーメンの空容器と書き散らした歌詞メモ。チサトは椅子に浅く座ってヘッドホンを片耳だけ外し、こちらへ半分だけ振り返る。白い毛がモニターの光で青白く縁取られ、表情は驚き半分の控えめな微笑み(「あ、来たんだ」の顔)。窓の外は月と夜の街。全体を暗いブルーでまとめ、白文字が乗る余白を意識する。"
          />
        </div>
      </section>

      {/* お知らせ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            <span className="en">NEWS</span>机の上のメモ
          </h2>
          <p className="section-desc">お知らせは机のメモに書いて貼ってあります。</p>
          <div className="grid-3">
            <div className="card memo">
              <div className="meta">2026.07.19</div>
              <h3>オフィシャルサイト準備中</h3>
              <p>チサトオフィシャルサイトを開設準備中です。公開までしばらくお待ちください。</p>
            </div>
            <div className="card memo">
              <div className="meta">COMING SOON</div>
              <h3>歌ってみたリクエスト受付開始</h3>
              <p>聴きたい曲をタイトルやURLで送れるリクエスト機能を公開予定です。</p>
            </div>
            <div className="card memo">
              <div className="meta">COMING SOON</div>
              <h3>グッズ情報</h3>
              <p>アクリルスタンドなどのグッズを準備中。ラインナップはグッズページへ。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 歌ってみたリクエスト導線 */}
      <section className="section alt">
        <div className="container">
          <h2 className="section-title">
            <span className="en">SONG REQUEST</span>ドアの下から届く手紙
          </h2>
          <p className="section-desc">
            人見知りなので、リクエストは手紙で受け付けています。
            「この曲をチサトに歌ってほしい」をそのまま送ってください。曲名だけでも、
            YouTubeなどのURLだけでもOK。届いた手紙は全部読んで、次に歌う曲の参考にします。
          </p>
          <div className="grid-2" style={{ alignItems: "center" }}>
            <IllustrationPlaceholder
              title="リクエストページ用イラスト"
              size="1200×800 / 3:2"
              ratio="3 / 2"
              description="薄暗い部屋でリスニング中のチサト。部屋着姿で床のクッションにゆったり座り、両手でヘッドホンを軽く押さえ、目を閉じて聴き入る少し横向きのバストアップ。口元は穏やかで控えめな微笑み、垂れた犬耳はヘッドホンの上からぴょこんと出す。手元はスマホ画面の光で下から照らされ、かたわらに食べかけのカップラーメンと、ドアの隙間から差し込んだ手紙(リクエスト)が数枚。背景は暗いブルーで、ドア下から廊下の光が一筋差し込む。"
            />
            <div>
              <p style={{ marginTop: 0 }}>
                リクエストはニックネームだけで送れます。コメント欄に「ここのサビが好き」など
                推しポイントを書いてもらえると選曲の参考になります。
              </p>
              <div className="actions" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/request" className="btn btn-accent">
                  リクエストを送る
                </Link>
                <Link href="/goods" className="btn btn-navy">
                  グッズを見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 依頼・グッズ導線 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            <span className="en">WORKS & GOODS</span>仕事机と、棚の上
          </h2>
          <p className="section-desc">
            部屋の隅の仕事机ではご依頼を受け付けています。棚の上にはグッズを並べる予定。
          </p>
          <div className="grid-2">
            <div className="card">
              <div className="meta">COMMISSION</div>
              <h3>制作のご依頼</h3>
              <p>
                作詞作曲・ミキシング・マスタリング・イラスト・MV制作・コラボの
                ご依頼を受け付けています。内容と予算感を添えてお気軽にご相談ください。
              </p>
              <p style={{ marginTop: 14 }}>
                <Link href="/commission" className="btn btn-accent">
                  依頼ページへ
                </Link>
              </p>
            </div>
            <div className="card">
              <div className="meta">GOODS</div>
              <h3>グッズ紹介</h3>
              <p>
                チサトのグッズラインナップを紹介しています。現在は準備中のアイテムが中心です。
              </p>
              <p style={{ marginTop: 14 }}>
                <Link href="/goods" className="btn btn-accent">
                  グッズページへ
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

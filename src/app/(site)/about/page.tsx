import type { Metadata } from "next";
import Image from "next/image";
import IllustrationPlaceholder from "@/components/IllustrationPlaceholder";

export const metadata: Metadata = { title: "プロフィール" };

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">
          <span className="en">PROFILE</span>この部屋の主、チサト
        </h2>
        <p className="section-desc">
          白い毛色の犬獣人の歌い手。少し中性的で息交じりの、控えめで優しい声の持ち主。
          普段はウィスパーボイス寄りに歌うけれど、実はハイトーンが得意で、
          曲に合わせていろいろな声を使い分けます。おっとり天然、しゃべるのはちょっと苦手。
          自分が主役になるより、誰かの曲や活動をそっと支えて輝かせるのが好きなタイプです。
        </p>

        <div className="profile-top">
          <IllustrationPlaceholder
            title="プロフィール用アーティスト写真"
            size="1200×1600 / 3:4 (縦長)"
            ratio="3 / 4"
            minHeight={320}
            description="全身の立ち絵。179cmの細身の体型がわかる、少し猫背気味の気負わない立ち姿。両手はパーカーのポケットに軽く入れ、首にヘッドホンを掛ける。顔はカメラ目線だけど少し照れたような控えめな微笑み。尻尾は静かに垂らして先だけ小さく揺れる。背景は暗い部屋の壁で、右側からモニターのティールの光が差して体の右半分だけ青白く照らされる。左側は月明かりのわずかなブルーグレー。足元に長めの影。『堂々としたアー写』ではなく『部屋にいる素のチサト』の空気感を優先し、暗背景に白い毛が浮かび上がる明暗差を活かす。"
          />
          <div className="card profile-info">
            <h3>基本情報</h3>
            <dl className="info-list">
              <dt>名前</dt>
              <dd>チサト (Chisato)</dd>
              <dt>種族</dt>
              <dd>犬獣人 (毛色は白ベース)</dd>
              <dt>身長 / 体重</dt>
              <dd>179cm / 58kg</dd>
              <dt>声</dt>
              <dd>
                少し中性的で息交じりの、控えめで優しい声。ウィスパー寄り・ハイトーン得意
              </dd>
              <dt>好きなもの</dt>
              <dd>甘いもの全般 (特にホイップクリーム単体)、カップラーメン</dd>
              <dt>活動</dt>
              <dd>歌ってみたがメイン</dd>
            </dl>
          </div>
        </div>

        <div className="card profile-blurb">
          <h3>ひとことでいうと</h3>
          <p>
            おっとりしていて天然。感情はいつも穏やかで一定。
            引きこもり気味でカップラーメンばかり食べている、ちょっとダメな一面も。
            でもおふざけでイタズラすると倍返しされるらしい……?
            真顔になると目から光が消えるのはご愛嬌。
          </p>
        </div>

        <div className="card">
          <h3>キャラクターデザイン (設定資料)</h3>
          <p style={{ marginBottom: 12 }}>
            三面図+表情の設定資料。イラスト・MV制作をご依頼いただく際の参考資料です。
          </p>
          <Image
            src="/images/chisato-reference.jpg"
            alt="チサト キャラクターデザイン三面図"
            width={1200}
            height={848}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 10,
              position: "relative",
              zIndex: 46,
            }}
          />
        </div>
      </div>
    </section>
  );
}

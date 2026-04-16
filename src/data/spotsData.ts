import { Bone, Trees, Scissors, Stethoscope, CalendarDays } from 'lucide-react';
import React from 'react';

export type SpotType = 'run' | 'park' | 'salon' | 'hospital' | 'event' | 'all';

export interface Spot {
    id: number;
    name: string;
    type: SpotType;
    description: string;
    rating?: number;
    lat: number;
    lng: number;
    color: string;
    icon: React.ElementType;
}

export const SPOTS: Spot[] = [
    // Dog Runs
    { id: 1, name: '代々木公園ドッグラン', type: 'run', description: '都内最大級！大型犬エリアもあります🐕', rating: 4.8, lat: 35.6723, lng: 139.6934, color: 'bg-green-600', icon: Bone },
    { id: 10, name: '駒沢オリンピック公園', type: 'run', description: 'アジリティ設備も充実しています🦴', rating: 4.5, lat: 35.6265, lng: 139.6603, color: 'bg-green-600', icon: Bone },

    // Parks (Walk)
    { id: 2, name: '渋谷ストリーム広場', type: 'park', description: '川沿いのお散歩コース。カフェあり☕️', lat: 35.6565, lng: 139.7031, color: 'bg-green-400', icon: Trees },
    { id: 3, name: '宮下パーク', type: 'park', description: '屋上の芝生エリアが気持ちいいです🌳', lat: 35.6620, lng: 139.7022, color: 'bg-green-400', icon: Trees },
    { id: 11, name: '北谷公園', type: 'park', description: 'おしゃれなカフェ併設の広場です✨', lat: 35.6635, lng: 139.6995, color: 'bg-green-400', icon: Trees },

    // Salons
    { id: 4, name: 'Doggy Style 渋谷店', type: 'salon', description: 'カット技術に定評あり✂️ 初回20%OFF', rating: 4.8, lat: 35.6580, lng: 139.6980, color: 'bg-pink-500', icon: Scissors },
    { id: 5, name: 'Bubble Paws', type: 'salon', description: '泡パックが人気🛁 予約が取りやすい', rating: 4.2, lat: 35.6700, lng: 139.7050, color: 'bg-pink-500', icon: Scissors },
    { id: 6, name: 'ワンワン美容室', type: 'salon', description: '老舗の安心感。シニア犬もOK🐕', rating: 4.5, lat: 35.6600, lng: 139.6900, color: 'bg-pink-500', icon: Scissors },

    // Hospitals
    { id: 7, name: '代々木ペットクリニック', type: 'hospital', description: '夜間救急対応🏥 優しい先生です', rating: 4.9, lat: 35.6750, lng: 139.6900, color: 'bg-red-500', icon: Stethoscope },
    { id: 8, name: '渋谷動物病院', type: 'hospital', description: '最新設備完備。健康診断におすすめ', rating: 4.4, lat: 35.6520, lng: 139.7080, color: 'bg-red-500', icon: Stethoscope },
    { id: 9, name: '森のどうぶつ病院', type: 'hospital', description: '土日も診療しています🌲', rating: 4.6, lat: 35.6680, lng: 139.6800, color: 'bg-red-500', icon: Stethoscope },

    // Events
    { id: 3001, name: '代々木わんわんカーニバル', type: 'event', description: '日本最大級のドッグイベント！グッズ販売やアジリティ体験など', rating: 4.9, lat: 35.6723, lng: 139.6934, color: 'bg-gray-800', icon: CalendarDays },
    { id: 3002, name: '名古屋ドッグマルシェ', type: 'event', description: '地元クリエイターによる犬具や無添加おやつの販売が行われます', rating: 4.7, lat: 35.1649, lng: 136.9010, color: 'bg-gray-800', icon: CalendarDays },

    // --- Aichi / Nagoya Special Collection (User Requested) ---
    { id: 1001, name: '庄内緑地ドッグラン', type: 'run', description: '大型犬エリアはそれなりに広く、トイレや駐車場も近いので使いやすいです。', rating: 3.7, lat: 35.2215, lng: 136.8970, color: 'bg-green-600', icon: Bone },
    { id: 1002, name: '大高緑地 ドッグラン', type: 'run', description: '大型犬用・小型犬用ではないので、体格差がごっちゃになっている日もあります。', rating: 3.6, lat: 35.0645, lng: 136.9450, color: 'bg-green-600', icon: Bone },
    { id: 1003, name: '新宝緑地ドッグラン', type: 'run', description: '港の工業地帯が見渡せて景色も良いドッグランです。', rating: 3.8, lat: 35.0667, lng: 136.8934, color: 'bg-green-600', icon: Bone },
    { id: 1004, name: '貸切わんわん広場', type: 'run', description: 'オーナ様もとても親切で、また来たいと思うドッグランです。', rating: 5.0, lat: 35.2400, lng: 136.8700, color: 'bg-green-600', icon: Bone }, // Approx North Nagoya
    { id: 1005, name: 'DCR Dog Cafe & Run', type: 'salon', description: 'ドッグランは会員制のためか、みなさん感じがよくわんこが楽しめます。', rating: 4.4, lat: 35.0934, lng: 136.8797, color: 'bg-green-600', icon: Bone },
    { id: 1006, name: 'アンドシー (And C)', type: 'salon', description: '室内ドックランであり、暑い時期と雨の時はとてもありがたいです。', rating: 4.4, lat: 35.1388, lng: 136.8488, color: 'bg-green-600', icon: Bone },
    { id: 1007, name: 'BARNABAS', type: 'salon', description: '貸切でBBQができて犬も連れて行けるのはここらへんではここだけかと思います。', rating: 4.6, lat: 35.1502, lng: 136.9015, color: 'bg-green-600', icon: Bone },
    { id: 1008, name: 'ドッグウィズ 長久手', type: 'run', description: '室内と外のドッグランがあり、小型犬用と中型大型犬用でそれぞれわかれています。', rating: 3.7, lat: 35.1649, lng: 137.0845, color: 'bg-green-600', icon: Bone },
    { id: 1009, name: 'Dog Garden SPANIEL', type: 'run', description: '初めてお邪魔させていただきとてもキレイで自然もありとても楽しかった。', rating: 4.1, lat: 35.3404, lng: 136.9538, color: 'bg-green-600', icon: Bone },
    { id: 1010, name: 'わんわん広場 小牧', type: 'run', description: '小型犬と大型犬が別々に遊べるので安心です。', rating: 4.0, lat: 35.3143, lng: 136.9835, color: 'bg-green-600', icon: Bone },
    { id: 1011, name: 'ドッグフォレスト 江南', type: 'run', description: '店員さんの対応も良く、ドッグランも綺麗でした。', rating: 4.3, lat: 35.3385, lng: 136.8548, color: 'bg-green-600', icon: Bone },
    { id: 1012, name: 'Bon-Ami', type: 'salon', description: '大型犬用の広いドッグランと小型犬用の小さめのドッグランが2つありました。', rating: 4.3, lat: 35.0970, lng: 137.1558, color: 'bg-green-600', icon: Bone },
    { id: 1013, name: 'A Growing Hill', type: 'run', description: '大自然な感じで綺麗。駐車場からドッグランまでの急な坂がしんどいかも。', rating: 4.1, lat: 34.8876, lng: 136.9114, color: 'bg-green-600', icon: Bone },
    { id: 1014, name: 'あま市庄内川河川敷公園ドッグラン', type: 'run', description: '利用者は許可証を見える様に身に付けたりとか、利用方法が厳格化してます。', rating: 3.6, lat: 35.1798, lng: 136.8451, color: 'bg-green-600', icon: Bone },
    { id: 1015, name: 'SKドッグラン', type: 'run', description: '500円で24時間営業です 大型犬、小型犬と分かれているので安心です', rating: 4.4, lat: 34.7928, lng: 137.0245, color: 'bg-green-600', icon: Bone },
    { id: 1016, name: 'グリーンゲーブル', type: 'salon', description: '施設もとても綺麗で、ドックランも広く沢山のワンちゃんと遊んで大満足でした！', rating: 3.9, lat: 34.9004, lng: 136.8806, color: 'bg-green-600', icon: Bone },
    { id: 1017, name: 'スターランド (一宮)', type: 'salon', description: '朝8時からオープンと高架下で日影になる場所があります。', rating: 4.5, lat: 35.3031, lng: 136.7998, color: 'bg-green-600', icon: Bone },
    { id: 1018, name: 'ドッグカフェWANPO', type: 'salon', description: '店内にティッシュ・トイレ袋・ゴミ箱の設置もあり、すごく有り難かったです。', rating: 4.7, lat: 35.2201, lng: 136.7972, color: 'bg-green-600', icon: Bone },
    { id: 1019, name: 'one two Skip', type: 'salon', description: 'お会計口やトイレの中までリード掛けがあって行き届いたお店だと感じました。', rating: 4.1, lat: 35.1458, lng: 136.9830, color: 'bg-green-600', icon: Bone },
    { id: 1020, name: 'DOG GARDEN MATSURIBA', type: 'run', description: '犬同士で触れ合って遊べる環境はとても良くてこれからも通わせたいです。', rating: 4.2, lat: 35.0881, lng: 137.1555, color: 'bg-green-600', icon: Bone },
    { id: 1021, name: 'MINRAKU (大府)', type: 'salon', description: 'トイレも仮設のトイレですが、洋式でとても綺麗で臭いも全くありませんでした。', rating: 4.3, lat: 34.9925, lng: 136.9304, color: 'bg-green-600', icon: Bone },
    { id: 1022, name: '新舞子マリンパーク ドッグラン', type: 'run', description: '小型犬、中大型犬スペースに別れており、大型犬も十分に走れる広さがあります。', rating: 3.7, lat: 34.9547, lng: 136.8215, color: 'bg-green-600', icon: Bone },

    // --- Added Salons (User Request) ---
    { id: 2001, name: 'Dog Salon & Spa Furufuru IKESHITA', type: 'salon', description: 'カット以外の事も親身になって相談ものって頂いてます。', rating: 4.4, lat: 35.164878, lng: 136.94257, color: 'bg-pink-500', icon: Scissors },
    { id: 2002, name: 'Ｊａｃｋ＆Ｒｉｃｏ', type: 'salon', description: 'かわいくしていただきありがとうございました、また行きます(^^)', rating: 5.0, lat: 35.1664, lng: 136.9561, color: 'bg-pink-500', icon: Scissors },
    { id: 2003, name: 'トリミングサロン・ファンプレイス 昭和区檀渓通店', type: 'salon', description: '清潔感のある店内で、トリマーさんも優しくて、毎回安心してお任せしています。', rating: 4.8, lat: 35.144322, lng: 136.945148, color: 'bg-pink-500', icon: Scissors },
    { id: 2004, name: 'dog salon Macoco', type: 'salon', description: '事業年数: 5 年以上 · 愛知県名古屋市', rating: 4.8, lat: 35.1685, lng: 136.9180, color: 'bg-pink-500', icon: Scissors },
    { id: 2005, name: 'dog salon horohoro 名古屋', type: 'salon', description: '愛知県名古屋市', rating: 0, lat: 35.164267, lng: 136.965468, color: 'bg-pink-500', icon: Scissors },
    { id: 2006, name: 'ペットホテル&トリミング ワンルーク 瑞穂区桜山店', type: 'salon', description: 'トリミングの技術も高く、仕上がりに大満足しています。', rating: 4.9, lat: 35.135412, lng: 136.933478, color: 'bg-pink-500', icon: Scissors },
    { id: 2007, name: 'Dog salon Coco ange', type: 'salon', description: 'ペットホテルも備えてあるのでいつか預けてみたいです。', rating: 5.0, lat: 35.181129, lng: 136.943211, color: 'bg-pink-500', icon: Scissors },
    { id: 2008, name: 'DOGSALON porte（ポルテ）', type: 'salon', description: 'わんこひとりひとりをとても大切にしてくれるサロン！', rating: 5.0, lat: 35.169724, lng: 136.942167, color: 'bg-pink-500', icon: Scissors },
    { id: 2009, name: 'ドッグサロンシェリー覚王山店', type: 'salon', description: 'これからもよろしくお願いいたします❤️', rating: 4.3, lat: 35.164536, lng: 136.953799, color: 'bg-pink-500', icon: Scissors },
    { id: 2010, name: 'DOG CAT COCO', type: 'salon', description: 'トリミングだけではなく、色々な事に相談にのって頂いています。', rating: 4.2, lat: 35.1493, lng: 136.9326, color: 'bg-pink-500', icon: Scissors },
    { id: 2011, name: 'トリミングサロンアンジュ', type: 'salon', description: '事業年数: 10 年以上 · 愛知県名古屋市', rating: 5.0, lat: 35.135405, lng: 136.923265, color: 'bg-pink-500', icon: Scissors },
    { id: 2012, name: 'MySalon', type: 'salon', description: '新規開店トリミングサロン 公式ラインで予約ができたので、便利で助かりました。', rating: 4.9, lat: 35.173268, lng: 136.910503, color: 'bg-pink-500', icon: Scissors },
    { id: 2013, name: 'プリティー・ワン 古出来町店', type: 'salon', description: 'トリミング後のフォトブースでの写真も素敵でオススメです。', rating: 5.0, lat: 35.182704, lng: 136.940647, color: 'bg-pink-500', icon: Scissors },
    { id: 2014, name: 'atelier mellow', type: 'salon', description: 'カットの要望を細かくヒアリングしてくださって安心してお任せできました。', rating: 5.0, lat: 35.1710, lng: 136.9210, color: 'bg-pink-500', icon: Scissors },
    { id: 2015, name: 'ブーケ・ド・ギ', type: 'salon', description: 'トリミングされている様子が外出先でもみれるので安心して任せられます！', rating: 4.9, lat: 35.2051, lng: 136.9323, color: 'bg-pink-500', icon: Scissors },
    { id: 2016, name: 'TrimmingSalon tocotoco 本山店', type: 'salon', description: 'ただ、トリミングをしてもらうお店とは違うので気に入っています。', rating: 5.0, lat: 35.161886, lng: 136.942622, color: 'bg-pink-500', icon: Scissors },
    { id: 2017, name: 'ドッグサロン アシル', type: 'salon', description: '本当に安心してお願いできるトリマーさんです😊 うちの子達も大好きです😄', rating: 5.0, lat: 35.170617, lng: 136.960253, color: 'bg-pink-500', icon: Scissors },
    { id: 2018, name: 'Private salon for DOG MIRO JANE', type: 'salon', description: 'トリミング後の我が子に会うのが一番の楽しみで癒しです。', rating: 5.0, lat: 35.1615, lng: 136.9311, color: 'bg-pink-500', icon: Scissors },
    { id: 2019, name: 'Dog salon en_ululu', type: 'salon', description: 'トリマーさんは若いですが技術はあると思います。', rating: 5.0, lat: 35.182681, lng: 136.954284, color: 'bg-pink-500', icon: Scissors },
    { id: 2020, name: 'ペットホテル＆トリミングサロン ワンルーク守山区中新店', type: 'salon', description: 'トリミングも凄く可愛くなって帰って来て嬉しいです🤣', rating: 4.9, lat: 35.19788, lng: 136.970305, color: 'bg-pink-500', icon: Scissors },
    // Batch 3 (2021-2030)
    { id: 2021, name: 'ペットホテル & トリミングサロン ワンルーク 千種区 自由ヶ丘店', type: 'salon', description: 'トリミングの内容も細かく聞いてくださって、とても良かったです。', rating: 4.9, lat: 35.180183, lng: 136.973941, color: 'bg-pink-500', icon: Scissors }, // Chikusa, Fujimidai 4-93-1
    { id: 2022, name: 'Trimming salon choco*mo', type: 'salon', description: 'とても丁寧なトリミングで、安心して　おまかせできます。', rating: 4.6, lat: 35.16905, lng: 136.976008, color: 'bg-pink-500', icon: Scissors }, // Chikusa, Nekogahora-dori (Approx)
    { id: 2023, name: 'timru〜dog salon〜', type: 'salon', description: 'トリミングが丁寧で、トリミング中や後の写真をLINEで送ってもらえます。', rating: 4.1, lat: 35.196191, lng: 136.942341, color: 'bg-pink-500', icon: Scissors }, // Higashi, Yada 3-8 (Approx)
    { id: 2024, name: 'トリミングスタジオＬ', type: 'salon', description: '愛知県名古屋市', rating: 4.8, lat: 35.154529, lng: 136.935715, color: 'bg-pink-500', icon: Scissors }, // Showa, Akebono-cho 3-9
    { id: 2025, name: 'Pet Trimming＆Hotel ASMO', type: 'salon', description: 'とてもおすすめのトリミングサロンです。', rating: 4.9, lat: 35.172441, lng: 136.911003, color: 'bg-pink-500', icon: Scissors }, // Higashi, Higashisakura 2-20-9
    { id: 2026, name: 'トリミング サロンぷぅきみチェリー 名古屋店', type: 'salon', description: 'アットホームなサロンで猫ちゃんも安心してトリミングをうけてくれました！', rating: 5.0, lat: 35.212492, lng: 136.927482, color: 'bg-pink-500', icon: Scissors }, // Kita, Yonegase-cho 45-2
    { id: 2027, name: 'Dog salon Lino', type: 'salon', description: 'カットも丁寧で可愛いお写真も撮影してくれます。', rating: 4.9, lat: 35.205112, lng: 136.932333, color: 'bg-pink-500', icon: Scissors }, // Kita, Kami-iidakita-machi 2-60-2
    { id: 2028, name: 'エトワール 名古屋千種店', type: 'salon', description: '24時間対応はとてもありがたいです。', rating: 4.2, lat: 35.171756, lng: 136.939833, color: 'bg-pink-500', icon: Scissors }, // Chikusa, Uchiyama 2-13-4
    { id: 2029, name: 'トリミングサロン名古屋名東', type: 'salon', description: '愛知県名古屋市', rating: 0, lat: 35.160949, lng: 136.990641, color: 'bg-pink-500', icon: Scissors }, // Meito, Meito-honmachi 175
    { id: 2030, name: 'Dog salon Sourique -スリーク-', type: 'salon', description: '先日初めてこちらでトリミングしてもらいました。', rating: 4.8, lat: 35.182311, lng: 136.935900, color: 'bg-pink-500', icon: Scissors }, // Higashi, Dekimachi 1-10-15
    // Batch 4 (2031-2039)
    { id: 2031, name: 'ペトラスタイル 覚王山店', type: 'salon', description: '事業年数: 10 年以上 · 愛知県名古屋市', rating: 4.2, lat: 35.166860, lng: 136.954911, color: 'bg-pink-500', icon: Scissors }, // Chikusa, Suemori-dori 1-18-1
    { id: 2032, name: 'ドッグサロンシェリー葵店', type: 'salon', description: 'ずっとお世話になりたいと思っているトリミングサロンです。', rating: 4.2, lat: 35.170013, lng: 136.924574, color: 'bg-pink-500', icon: Scissors }, // Naka, Aoi 2-13-26
    { id: 2033, name: 'dogsalon colorer', type: 'salon', description: '丁寧にトリミングしていただけます。', rating: 5.0, lat: 35.118395, lng: 136.951890, color: 'bg-pink-500', icon: Scissors }, // Mizuho, Yatomidoori 4-72
    { id: 2034, name: 'ペットホテル & トリミングサロン ワンルーク 名東区 高針店', type: 'salon', description: 'トリミングも希望以上の仕上がりで、ふわふわで帰ってきて感動です。', rating: 5.0, lat: 35.150309, lng: 137.012435, color: 'bg-pink-500', icon: Scissors }, // Meito, Shinjuku 2-250
    { id: 2035, name: 'ペットホテル＆トリミングサロン ワンルーク中区金山店', type: 'salon', description: 'トリマーさんには、希望をしっかり聞いくれて、可愛くしてもらいました。', rating: 4.9, lat: 35.146021, lng: 136.898769, color: 'bg-pink-500', icon: Scissors }, // Naka, Masaki 3-12-3
    { id: 2036, name: 'アプリシエイト', type: 'salon', description: 'こちらは多分名古屋で1番うまくカットしてもらえるサロンだと思います。', rating: 4.9, lat: 35.140785, lng: 136.927921, color: 'bg-pink-500', icon: Scissors }, // Showa, Hiromicho 3-30
    { id: 2037, name: 'ペットホテル＆トリミングサロン ワンルーク中区栄店', type: 'salon', description: '仕上りも前回の別のサロンとは比べものにならないくらいいいです。', rating: 4.9, lat: 35.165000, lng: 136.903000, color: 'bg-pink-500', icon: Scissors }, // Naka, Sakae 3-21-27 (Approx)
    { id: 2038, name: 'スタードックス', type: 'salon', description: '技術は勿論、安心して任せられるサロンです。', rating: 5.0, lat: 35.183000, lng: 136.950000, color: 'bg-pink-500', icon: Scissors }, // Chikusa, Nabeya Ueno-cho 1089 (Approx)
    { id: 2039, name: 'MOFU MOFU | Trimming & Hotel', type: 'salon', description: '無事預けられたけど、トリミングの片手間でホテルもやってるイメージ。', rating: 4.6, lat: 35.152900, lng: 136.907100, color: 'bg-pink-500', icon: Scissors }, // Naka, Fujimi-cho 13-22 // Naka, Fujimi-cho 13-22
];

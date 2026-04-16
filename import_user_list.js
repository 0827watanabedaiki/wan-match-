
const https = require('https');

const rawText = `
写真館・スタジオドッグラン
3.8(116) · 写真館
事業年数: 20 年以上 · 愛知県名古屋市
営業時間外 · 営業開始: 10:00（木）
"この暑さの中涼しいお部屋で大型犬ですが、遊びやお稽古事で堪能きました。"

プライベートドッグラン セレンゲティ
3.5(13) · 犬専用公園
愛知県豊田市
"目が届く範囲の丁度いい広さで椅子やテーブルもあり車も乗り入れられるのは有難い。"

腕白ファーム＆フィールド
3.9(16) · ドッグカフェ
愛知県一宮市
営業時間外 · 営業開始: 12:00（木）
"ドッグランの部屋が５つくらいあり、個別で楽しみたい人もオッケー。"

ドッグカフェ ももカフェ
4.3(79) · ドッグカフェ
愛知県名古屋市
"犬連れではない人は60分¥1.500ドリンク、犬オヤツがつきます。"

ペットのスマイル徳重店・スマイル室内ドッグラン
3.7(71) · ペットショップ
愛知県名古屋市
まもなく営業終了 · 19:00
"室内ドッグランの中では人が多くていい感じだと思う。"

DOG GARDEN MATSURIBA（ドッグガーデンマツリバ）
4.2(25) · 住宅展示場
愛知県豊田市
営業時間外 · 営業開始: 10:00（金）
"犬同士で触れ合って遊べる環境はとても良くてこれからも通わせたいです。"

MINRAKU
4.3(13) · バーベキュー場
愛知県大府市
営業時間外 · 営業開始: 10:00（金）
"トイレも仮設のトイレですが、洋式でとても綺麗で臭いも全くありませんでした。"

金魚の森 ドッグラン
4.6(20) · 犬専用公園
愛知県岡崎市
まもなく営業終了 · 19:00
"果樹園も兼ねているので大型犬ですが、少し狭い感じがあるかなー。"

ロックガーデン
4.3(3) · 公園
愛知県日進市
"春は桜がとても綺麗です。"

新舞子マリンパーク ドッグラン
3.7(120) · 犬専用公園
愛知県知多市
営業時間外 · 営業開始: 9:30（木）
"小型犬、中大型犬スペースに別れており、大型犬も十分に走れる広さがあります。"

スターランド Star Land
4.5(12) · ドッグカフェ
愛知県一宮市
"朝8時からオープンと高架下で日影になる場所があります。"

グリーンゲーブル
3.9(142) · ドッグカフェ
愛知県半田市
営業時間外 · 営業開始: 9:00（木）
"施設もとても綺麗で、ドックランも広く沢山のワンちゃんと遊んで大満足でした！"

ドッグカフェWANPO
4.7(23) · ドッグカフェ
愛知県稲沢市
まもなく営業終了 · 18:30
"店内にティッシュ・トイレ袋・ゴミ箱の設置もあり、すごく有り難かったです。"

貸切わんわん広場
5.0(5) · 犬専用公園
愛知県北名古屋市
"オーナ様もとても親切で、また来たいと思うドッグランです。"

one two Skip (ワンツースキップ）
4.1(78) · ドッグカフェ
愛知県名古屋市
営業時間外 · 営業開始: 10:00（金）
"お会計口やトイレの中までリード掛けがあって行き届いたお店だと感じました。"

SKドッグラン
4.4(148) · 犬専用公園
愛知県西尾市
"500円で24時間営業です 大型犬、小型犬と分かれているので安心です"

Dog cafe FLAT /ドッグカフェ フラット
3.2(24) · ドッグカフェ
愛知県名古屋市
営業時間外 · 営業開始: 10:30（木）
"ドッグランは食事すると割引きがあると 利用しやすいなと思います"

山田農園畑のドッグラン
4.2(19) · 犬専用公園
愛知県岡崎市
"元気な子、優しい子でエリア分けしてくれているのがとてもありがたい。"

タダノイヌヅキ
4.6(66) · ドッグカフェ
愛知県豊田市
営業時間外 · 営業開始: 10:00（木）
"ドックランはそれなりに整備されてて料金設定も犬ちゃんのみの500円と満足です。"

わんわんプレイランド
3.7(36) · 犬専用公園
愛知県稲沢市
営業時間外 · 営業開始: 9:00（木）
"人工芝の色落ちが激しく、犬の足が緑色になります。"

空と緑のDogRun 『GreenHands』
4.3(3) · 犬専用公園
愛知県名古屋市
"2024.11上旬、人生初のドックランに 行ってきました！"

DCR Dog Cafe & Run
4.4(55) · ドッグカフェ
愛知県名古屋市
"ドッグランは会員制のためか、みなさん感じがよくわんこが楽しめます。"

庄内緑地ドッグラン
3.7(246) · 犬専用公園
愛知県名古屋市
"大型犬エリアはそれなりに広く、トイレや駐車場も近いので使いやすいです。"

新宝緑地ドッグラン
3.8(149) · 犬専用公園
愛知県東海市
"港の工業地帯が見渡せて景色も良いドッグランです。"

アンドシー
4.4(279) · ￥1,000～2,000 · ドッグカフェ
愛知県名古屋市
"室内ドックランであり、暑い時期と雨の時はとてもありがたいです。"

BARNABAS(ドッグラン＆BBQ場)
4.6(5) · ドッグカフェ
愛知県名古屋市
"貸切でBBQができて犬も連れて行けるのはここらへんではここだけかと思います。"

大高緑地 ドッグラン
3.6(369) · 犬専用公園
愛知県名古屋市
"大型犬用・小型犬用ではないので、体格差がごっちゃになっている日もあります。"

ドッグウィズ
3.7(111) · 犬専用公園
愛知県長久手市
"室内と外のドッグランがあり、小型犬用と中型大型犬用でそれぞれわかれています。"

Dog Garden SPANIEL
4.1(27) · 犬専用公園
愛知県犬山市
"初めてお邪魔させていただきとてもキレイで自然もありとても楽しかった。"

わんわん広場 みどり憩いの場
4.0(55) · 犬専用公園
愛知県小牧市
"小型犬と大型犬が別々に遊べるので安心です。"

ドッグフォレスト 江南
4.3(44) · ペットショップ
愛知県江南市
"店員さんの対応も良く、ドッグランも綺麗でした。"

Bon-Ami（Cafe＆Dogrun）
4.3(24) · ￥1,000～2,000 · ドッグカフェ
愛知県豊田市
"大型犬用の広いドッグランと小型犬用の小さめのドッグランが2つありました。"

スマイル犬のようちえん室内ドッグラン
4.0(4) · 犬の調教師
事業年数: 5 年以上 · 愛知県長久手市
"涼しく楽しませて頂きました。"

アグローウィングヒルドッグランA Growing Hill Dogrun
4.1(38) · 犬専用公園
愛知県半田市
"大自然な感じで綺麗 駐車場からドッグランまでの急な坂がしんどい、料金も高い"

若水３丁目中北子ども会どんぐりひろば
3.7(3) · 公園
愛知県名古屋市
犬の同伴可

あま市庄内川河川敷公園ドッグラン
3.6(61) · 犬専用公園
愛知県あま市
"利用者は許可証を見える様に身に付けたりとか、利用方法が厳格化してます。"

わんプレイ
4.5(20) · 犬専用公園
愛知県豊田市
"駐車場はドッグランの塀越しに停められるので、7・8台は停めれる。"

ドッグランみよし店
3.9(15) · 犬専用公園
愛知県みよし市
"利用時間帯も8:00〜18:00ですので、定時仕事の方や夏季は利用しづらそう。"

ＢＡＮゴルフ倶楽部/小さなドッグランJJ PARK
4.4(20) · 犬専用公園
愛知県瀬戸市
"小型犬(一部中型犬)のために作られた施設でとても満足です 貸切なので安心"

〇〇 Dogrun&cafe
3.7(30) · ￥1,000～2,000 · コーヒーショップ・喫茶店
愛知県豊田市
"平日11時過ぎに行って、ドッグランとランチ食べました！"
`;

// Simple parser
function parseText(text) {
    const blocks = text.split('\n\n').filter(b => b.trim().length > 0);
    const seen = new Set();
    const unique = [];

    blocks.forEach(block => {
        const lines = block.split('\n').filter(l => l.trim().length > 0);
        let name = lines[0] || "Unknown";
        if (seen.has(name)) return;
        seen.add(name);

        let ratingLine = lines[1] || "";
        let address = "";

        // Find address line (contains "愛知県" or "名古屋")
        address = lines.find(l => l.includes('愛知県') || l.includes('名古屋')) || "";
        if (address) {
            // Clean up address (e.g. remove "事業年数: ... · ")
            if (address.includes('·')) address = address.split('·').pop().trim();
        }

        let review = lines.find(l => l.startsWith('"') && l.endsWith('"')) || "";
        let rating = 0;
        const ratingMatch = ratingLine.match(/^(\d\.\d)/);
        if (ratingMatch) rating = parseFloat(ratingMatch[1]);
        review = review.replace(/^"|"$/g, '');

        unique.push({ name, address, rating, review });
    });
    return unique;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function cleanName(name) {
    // Remove "Dog Run", "Dog Cafe" prefixes/suffixes for cleaner searching
    let cleaned = name;
    // Common noisy prefixes
    const prefixes = ['プライベートドッグラン', 'ドッグカフェ', 'ドッグラン', 'Dog Cafe & Run', 'Dog Run', 'Dog Cafe', '空と緑のDogRun'];
    for (const p of prefixes) {
        if (cleaned.startsWith(p)) cleaned = cleaned.substring(p.length).trim();
    }
    // Remove brackets
    cleaned = cleaned.replace(/（.*?）/g, '').replace(/\(.*?\)/g, '');

    // If empty (i.e. name WAS "Dog Run"), revert
    if (cleaned.length < 2) return name;
    return cleaned.trim();
}

async function geocode(spot) {
    return new Promise((resolve, reject) => {
        // Strategy: 1. CleanName + Address(City)
        const cleaned = cleanName(spot.name);
        const city = spot.address || "愛知県";

        const q = `${cleaned} ${city}`;

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
        const options = {
            headers: { 'User-Agent': 'WanMatchApp/1.0 (watanabe.dev@example.com)' }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json.length > 0) {
                        resolve({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) });
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', err => resolve(null));
    });
}

(async () => {
    const spots = parseText(rawText);
    const results = [];

    console.log(`Parsed ${spots.length} unique spots.`);

    for (const spot of spots) {
        process.stdout.write(`Geocoding ${spot.name} [${cleanName(spot.name)} + ${spot.address}]... `);

        let coords = await geocode(spot);

        if (coords) {
            console.log(`OK`);

            let type = 'run';
            if (spot.name.toLowerCase().includes('run') || spot.name.includes('ラン')) type = 'run';
            else if (spot.name.includes('Cafe') || spot.name.includes('カフェ')) type = 'salon';

            results.push({
                id: 2000 + results.length,
                name: spot.name,
                type: type,
                description: spot.review || 'ユーザーおすすめスポット',
                rating: spot.rating,
                lat: coords.lat,
                lng: coords.lng,
                color: type === 'run' ? 'bg-green-600' : 'bg-pink-500',
                icon: type === 'run' ? 'Bone' : 'Scissors'
            });
        } else {
            console.log("Failed");
        }

        await sleep(1500);
    }

    console.log("\n// COPY THIS ARRAY INTO MapView.tsx SPOTS");
    console.log(JSON.stringify(results, null, 2));
})();

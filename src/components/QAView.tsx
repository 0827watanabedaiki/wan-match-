import React, { useState } from 'react';
import { MessageCircle, Plus, X, ChevronDown, ChevronUp, Heart, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Answer {
    id: number;
    author: string;
    avatar: string;
    years: number; // 飼育年数
    text: string;
    time: string;
    likes: number;
}

interface Question {
    id: number;
    title: string;
    body: string;
    category: string;
    time: string;
    author: string;
    avatar: string;
    isNewbie: boolean;
    answers: Answer[];
    likes: number;
}

const CATEGORIES = ['すべて', '初心者', 'ご飯・食事', '健康', 'しつけ', 'おでかけ', 'ケア'];

const INITIAL_QUESTIONS: Question[] = [
    {
        id: 1,
        title: '初めて犬を飼います。最初に用意するものを教えてください！',
        body: '来月トイプードルを迎える予定です。ケージ、トイレ、ご飯…何から準備すればいいか全然わかりません。先輩飼い主さん、アドバイスお願いします🙏',
        category: '初心者',
        time: '15分前',
        author: 'はじめてのわんこ',
        avatar: '🐣',
        isNewbie: true,
        likes: 4,
        answers: [
            {
                id: 1,
                author: 'プードル歴5年',
                avatar: '🐩',
                years: 5,
                text: 'まず最低限これだけ揃えれば大丈夫です！①クレート（ハウス用）②トイレトレー＋シーツ③ご飯とお水のボウル④首輪とリード⑤年齢に合ったフード。最初は狭い空間の方が子犬が安心しやすいので、大きなケージより小さめのクレートがおすすめです。',
                time: '10分前',
                likes: 12,
            },
            {
                id: 2,
                author: '柴犬ママ',
                avatar: '🐕',
                years: 3,
                text: 'トイレの場所は最初に決めたらなるべく動かさないのがコツ！あとペット保険も早めに検討してみてください。若いうちに入る方が保険料が安くてお得です。',
                time: '8分前',
                likes: 7,
            },
        ],
    },
    {
        id: 2,
        title: 'ご飯を全然食べてくれません…病院に連れて行くべき？',
        body: '2歳の柴犬なのですが、昨日から急にドライフードを食べなくなりました。水は飲んでいます。元気はあるように見えるのですが…',
        category: 'ご飯・食事',
        time: '1時間前',
        author: 'シバポチ',
        avatar: '🐶',
        isNewbie: false,
        likes: 6,
        answers: [
            {
                id: 1,
                author: '獣医師アシスタント',
                avatar: '🩺',
                years: 8,
                text: '丸1日以上食べない、または嘔吐・下痢・ぐったりしている場合はすぐ受診を。元気があって水を飲めているなら、まず1〜2日様子を見てOKです。フードの種類を急に変えた場合も拒否することがあります。',
                time: '50分前',
                likes: 18,
            },
        ],
    },
    {
        id: 3,
        title: 'ドッグランデビュー！注意することってありますか？',
        body: '生後8ヶ月のゴールデン、先日ワクチン接種が完了したのでドッグランデビューを考えています。初めてなので何に気をつければいいか教えてください。',
        category: 'おでかけ',
        time: '3時間前',
        author: 'ゴールデン親バカ',
        avatar: '🦮',
        isNewbie: true,
        likes: 9,
        answers: [
            {
                id: 1,
                author: 'ドッグラン常連',
                avatar: '🏃',
                years: 6,
                text: '最初は空いている時間帯に少人数の状態で行くのがおすすめ！最初から大勢の犬がいると圧倒されてしまう子もいます。入場前にリードを外す前に、フェンス越しに他の犬の匂いを嗅がせてあげると落ち着きやすいですよ。',
                time: '2時間前',
                likes: 14,
            },
            {
                id: 2,
                author: 'トレーナー見習い',
                avatar: '🎓',
                years: 4,
                text: '「呼び戻し」ができるか事前に確認を！名前を呼んだら戻ってくる練習をしてから行くと安心です。あとウンチ袋は多めに持って行ってください笑',
                time: '1時間前',
                likes: 8,
            },
        ],
    },
    {
        id: 4,
        title: '夜泣きが1週間続いています。どうしたらいいですか？',
        body: '2ヶ月のチワワを迎えて1週間。毎晩2〜3時間泣き続けます。かわいそうで抱っこしてしまうのですが、よくないでしょうか…',
        category: 'しつけ',
        time: '5時間前',
        author: '寝不足ママ',
        avatar: '😴',
        isNewbie: true,
        likes: 21,
        answers: [
            {
                id: 1,
                author: 'チワワ3匹の親',
                avatar: '🐾',
                years: 7,
                text: '抱っこすると「泣けば来てくれる」と学習してしまうので、できれば泣き止むまで待つのが基本です。でも最初の1〜2週間はどうしても泣きます。クレートの中に飼い主の匂いがついた服を入れてあげると安心する子が多いです！湯たんぽ（ペット用）も効果的でした。',
                time: '4時間前',
                likes: 31,
            },
        ],
    },
    {
        id: 5,
        title: '換毛期の抜け毛、みなさんどう対処してますか？',
        body: '柴犬を飼って2年目。春の換毛期の抜け毛がすごくて床が毛だらけになります😅 おすすめのブラシや対策があれば教えてください。',
        category: 'ケア',
        time: '1日前',
        author: 'しばいぬの人',
        avatar: '🐕‍🦺',
        isNewbie: false,
        likes: 15,
        answers: [
            {
                id: 1,
                author: '柴犬歴10年',
                avatar: '🏆',
                years: 10,
                text: 'ファーミネーターが最強です！高いけど投資する価値あり。毎日5〜10分のブラッシングで抜け毛の量が全然違います。あとロボット掃除機は必須アイテムになりました笑。外でブラッシングすれば野鳥が巣作りに使ってくれますよ🐦',
                time: '20時間前',
                likes: 22,
            },
        ],
    },
];

export const QAView: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
    const [selectedCategory, setSelectedCategory] = useState('すべて');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [likedQuestions, setLikedQuestions] = useState<Set<number>>(new Set());
    const [likedAnswers, setLikedAnswers] = useState<Set<string>>(new Set());

    // 投稿フォームの状態
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [newCategory, setNewCategory] = useState('初心者');

    // カテゴリフィルター
    const filtered = selectedCategory === 'すべて'
        ? questions
        : questions.filter(q => q.category === selectedCategory);

    const handleLikeQuestion = (id: number) => {
        setLikedQuestions(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
        setQuestions(prev => prev.map(q =>
            q.id === id ? { ...q, likes: likedQuestions.has(id) ? q.likes - 1 : q.likes + 1 } : q
        ));
    };

    const handleLikeAnswer = (key: string) => {
        setLikedAnswers(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const handlePost = () => {
        if (!newTitle.trim()) return;
        const newQ: Question = {
            id: Date.now(),
            title: newTitle.trim(),
            body: newBody.trim(),
            category: newCategory,
            time: 'たった今',
            author: 'あなた',
            avatar: '🐾',
            isNewbie: false,
            likes: 0,
            answers: [],
        };
        setQuestions(prev => [newQ, ...prev]);
        setNewTitle('');
        setNewBody('');
        setNewCategory('初心者');
        setShowPostModal(false);
    };

    return (
        <div className="h-full w-full bg-white flex flex-col">
            {/* Header */}
            <div className="pt-8 pb-4 px-4 flex flex-col items-center border-b border-gray-100">
                <h2 className="text-[13px] font-extrabold tracking-widest text-gray-900 uppercase">ワンコ座談会</h2>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">DOG OWNER COMMUNITY</p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-gray-100 shrink-0">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase transition-all border ${
                            selectedCategory === cat
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-400 border-gray-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
                <div className="space-y-3">
                    {filtered.map(q => (
                        <div key={q.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {/* Question Header */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-extrabold text-gray-900 border border-gray-900 px-2 py-0.5 rounded-sm tracking-wider">
                                            {q.category}
                                        </span>
                                        {q.isNewbie && (
                                            <span className="text-[10px] font-extrabold text-white bg-gray-500 px-2 py-0.5 rounded-sm tracking-wider">
                                                初心者
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-wider shrink-0">{q.time}</span>
                                </div>

                                <h3 className="font-bold text-gray-900 text-sm leading-relaxed mb-3">{q.title}</h3>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{q.avatar}</span>
                                        <span className="text-xs font-bold text-gray-500">{q.author}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={e => { e.stopPropagation(); handleLikeQuestion(q.id); }}
                                            className={`flex items-center gap-1 text-xs font-bold transition-colors ${likedQuestions.has(q.id) ? 'text-gray-900' : 'text-gray-400'}`}
                                        >
                                            <Heart size={13} className={likedQuestions.has(q.id) ? 'fill-gray-900' : ''} />
                                            {q.likes}
                                        </button>
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                                            <MessageCircle size={13} />
                                            {q.answers.length}
                                        </div>
                                        {expandedId === q.id
                                            ? <ChevronUp size={16} className="text-gray-400" />
                                            : <ChevronDown size={16} className="text-gray-400" />
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Expanded: Body + Answers */}
                            <AnimatePresence>
                                {expandedId === q.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        {/* Question Body */}
                                        {q.body && (
                                            <div className="px-4 pb-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-600 leading-relaxed pt-3">{q.body}</p>
                                            </div>
                                        )}

                                        {/* Answers */}
                                        {q.answers.length > 0 && (
                                            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-4">
                                                <p className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase">
                                                    {q.answers.length} ANSWERS
                                                </p>
                                                {q.answers.map(a => {
                                                    const likeKey = `${q.id}-${a.id}`;
                                                    return (
                                                        <div key={a.id} className="bg-white rounded-lg p-3 border border-gray-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-base">{a.avatar}</span>
                                                                <div>
                                                                    <span className="text-xs font-extrabold text-gray-900">{a.author}</span>
                                                                    <span className="ml-2 text-[10px] text-gray-400 font-bold">飼育歴{a.years}年</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-gray-700 leading-relaxed mb-2">{a.text}</p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-gray-400 font-bold">{a.time}</span>
                                                                <button
                                                                    onClick={() => handleLikeAnswer(likeKey)}
                                                                    className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${likedAnswers.has(likeKey) ? 'text-gray-900' : 'text-gray-400'}`}
                                                                >
                                                                    <Heart size={12} className={likedAnswers.has(likeKey) ? 'fill-gray-900' : ''} />
                                                                    {likedAnswers.has(likeKey) ? a.likes + 1 : a.likes} 役に立った
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {q.answers.length === 0 && (
                                            <div className="border-t border-gray-100 bg-gray-50 px-4 py-6 text-center">
                                                <p className="text-[11px] text-gray-400 font-bold">まだ回答がありません。最初に答えてみよう！</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAB: 質問を投稿 */}
            <div className="fixed bottom-24 right-6 z-20">
                <button
                    onClick={() => setShowPostModal(true)}
                    className="bg-gray-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                    <Plus size={24} strokeWidth={2.5} />
                </button>
            </div>

            {/* Post Question Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-end justify-center"
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPostModal(false)} />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="relative w-full max-w-sm bg-white rounded-t-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-extrabold text-gray-900 text-[13px] tracking-widest uppercase">質問を投稿</h3>
                                <button onClick={() => setShowPostModal(false)} className="p-2 text-gray-400 hover:text-gray-900 transition">
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* Category */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">カテゴリ</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.filter(c => c !== 'すべて').map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setNewCategory(cat)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest border transition-all ${
                                                    newCategory === cat
                                                        ? 'bg-gray-900 text-white border-gray-900'
                                                        : 'bg-white text-gray-400 border-gray-200'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">タイトル <span className="text-gray-900">*</span></label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        placeholder="例：子犬のトイレトレーニングのコツは？"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-300"
                                    />
                                </div>

                                {/* Body */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">詳細（任意）</label>
                                    <textarea
                                        value={newBody}
                                        onChange={e => setNewBody(e.target.value)}
                                        placeholder="状況や詳細を書くと回答してもらいやすくなります"
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-300 resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handlePost}
                                disabled={!newTitle.trim()}
                                className={`w-full mt-6 py-4 rounded-lg text-[11px] font-extrabold tracking-widest uppercase transition-all active:scale-95 shadow-md ${
                                    newTitle.trim()
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                }`}
                            >
                                投稿する
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

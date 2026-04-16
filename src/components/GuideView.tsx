import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, GraduationCap, Star, Award, Check } from 'lucide-react';

interface GuideViewProps {
    onClose: () => void;
}

interface GuideItem {
    id: string;
    title: string;
    time: string;
    content: React.ReactNode;
}

interface LevelContent {
    title: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    items: GuideItem[];
}

export const GuideView: React.FC<GuideViewProps> = ({ onClose }) => {
    const [activeLevel, setActiveLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [selectedItem, setSelectedItem] = useState<GuideItem | null>(null);
    const [completedItems, setCompletedItems] = useState<string[]>([]);

    const handleComplete = (id: string) => {
        if (!completedItems.includes(id)) {
            setCompletedItems([...completedItems, id]);
        }
        setSelectedItem(null); // Return to list
    };

    const content: Record<'beginner' | 'intermediate' | 'advanced', LevelContent> = {
        beginner: {
            title: '初心者',
            icon: <Star className="text-yellow-400" />,
            color: 'bg-yellow-50 text-yellow-600',
            description: 'これからワンちゃんを迎えるあなたへ',
            items: [
                {
                    id: 'b1',
                    title: 'お迎え初日！やることリスト',
                    time: '5分',
                    content: (
                        <div className="space-y-4">
                            <p>ワンちゃんがお家に来る初日は、喜びと同時に緊張の瞬間でもあります。スムーズな新生活のために、これだけは守りたいポイントをまとめました。</p>
                            <h4 className="font-bold text-lg mt-4">1. 静かな環境を用意する</h4>
                            <p>初日はワンちゃんも疲れています。ケージやベッドを用意し、あまり構いすぎずにゆっくり休ませてあげましょう。「可愛いから」といって長時間遊ぶのはNGです。</p>
                            <h4 className="font-bold text-lg mt-4">2. トイレの場所を教える</h4>
                            <p>お家についたら、まずはトイレシーツの上に連れて行きましょう。排泄ができたらたくさん褒めてあげることが最初のトレーニングです。</p>
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-4">
                                <span className="font-bold text-yellow-700">💡 ポイント</span>
                                <p className="text-sm text-yellow-600 mt-1">環境が変わると食欲が落ちることがあります。初日はフードをふやかしてあげたり、少し温めると匂いが出て食べやすくなります。</p>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'b2',
                    title: 'ワクチン・登録手続きの基本',
                    time: '10分',
                    content: (
                        <div className="space-y-4">
                            <p>ワンちゃんと暮らす上で、法律で決まっている手続きと、命を守るためのワクチンについて解説します。</p>
                            <h4 className="font-bold text-lg mt-4">必須の手続き</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>畜犬登録：</strong>お住まいの役所で行います（生涯1回）。</li>
                                <li><strong>狂犬病注射：</strong>年に1回の接種が法律で義務付けられています。</li>
                            </ul>
                            <h4 className="font-bold text-lg mt-4">混合ワクチン</h4>
                            <p>パルボウイルスやジステンパーなど、恐ろしい伝染病から守る注射です。子犬の時期は数回の接種が必要です。獣医師と相談してスケジュールを決めましょう。</p>
                        </div>
                    )
                },
                {
                    id: 'b3',
                    title: 'トイレトレーニング（基礎編）',
                    time: '15分',
                    content: (
                        <div className="space-y-4">
                            <p>最も悩みが多いトイレトレーニング。基本は「失敗させない」環境づくりです。</p>
                            <h4 className="font-bold text-lg mt-4">成功の秘訣</h4>
                            <p>「寝起き」「食後」「遊んだ後」が排泄のタイミングです。ソワソワし始めたらサッとトイレに誘導しましょう。</p>
                        </div>
                    )
                },
                {
                    id: 'b4',
                    title: 'ご飯の選び方と与え方',
                    time: '8分',
                    content: (
                        <div className="space-y-4">
                            <p>成長期の子犬と成犬では必要な栄養素がまったく違います。「総合栄養食」と書かれたフードを選びましょう。</p>
                        </div>
                    )
                },
            ]
        },
        intermediate: {
            title: '中級者',
            icon: <BookOpen className="text-blue-400" />,
            color: 'bg-blue-50 text-blue-600',
            description: 'より良い関係を築くために',
            items: [
                { id: 'i1', title: 'お散歩デビューの進め方', time: '10分', content: <p>ワクチンプログラムが終わったら、いよいよお散歩デビューです...</p> },
                { id: 'i2', title: '無駄吠え・甘噛みへの対処法', time: '12分', content: <p>要求吠えや警戒吠え、それぞれの理由に合わせた対処法を学びましょう...</p> },
                { id: 'i3', title: 'コマンド（お座り・伏せ）の教え方', time: '20分', content: <p>基本的なコマンドは、愛犬の安全を守るためにも重要です...</p> },
                { id: 'i4', title: 'ドッグランでのマナー', time: '8分', content: <p>みんなが楽しく遊ぶためのドッグランのルールとマナーについて...</p> },
            ]
        },
        advanced: {
            title: '上級者',
            icon: <Award className="text-purple-400" />,
            color: 'bg-purple-50 text-purple-600',
            description: '愛犬との生活をより豊かに',
            items: [
                { id: 'a1', title: '健康シグナルの見分け方', time: '15分', content: <p>日々のボディチェックで早期発見できる病気のサインとは...</p> },
                { id: 'a2', title: 'シニア期のケアと準備', time: '10分', content: <p>シニアになっても快適に過ごすための住環境の工夫やケアについて...</p> },
                { id: 'a3', title: '手作りご飯のレシピと栄養', time: '25分', content: <p>トッピングや手作り食に挑戦したい方向けの栄養ガイド...</p> },
                { id: 'a4', title: '災害時の避難シミュレーション', time: '20分', content: <p>いざという時に愛犬を守るための同行避難の準備と心構え...</p> },
            ]
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-50 bg-dog-bg flex flex-col pt-12"
        >
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm z-10">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-dog-text flex items-center gap-2">
                        <GraduationCap className="text-dog-primary" />
                        わんこ飼育マスター
                    </h2>
                </div>
            </div>

            {/* Level Tabs (Disabled when article is open) */}
            <div className="bg-white px-4 pb-4 flex gap-2 overflow-x-auto">
                {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                    <button
                        key={level}
                        disabled={!!selectedItem}
                        onClick={() => setActiveLevel(level)}
                        className={`flex-1 min-w-[100px] py-2 px-3 rounded-full text-sm font-bold transition-colors border-2 ${activeLevel === level
                            ? 'bg-dog-text text-white border-dog-text'
                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {content[level].title}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-24 relative">
                <div
                    key={activeLevel}
                    className={`p-6 rounded-3xl mb-6 ${content[activeLevel].color}`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                            {content[activeLevel].icon}
                        </div>
                        <h3 className="font-bold text-lg">{content[activeLevel].title}コース</h3>
                    </div>
                    <p className="text-sm opacity-90 font-medium">
                        {content[activeLevel].description}
                    </p>
                </div>

                <div className="space-y-3">
                    {content[activeLevel].items.map((item, index) => {
                        const isCompleted = completedItems.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className={`bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between group active:scale-[0.98] transition-transform cursor-pointer ${isCompleted ? 'border-dog-primary/30 bg-green-50/10' : 'border-dog-border'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCompleted ? 'bg-dog-primary text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {isCompleted ? <Check size={16} /> : index + 1}
                                    </span>
                                    <div>
                                        <h4 className={`font-bold text-sm mb-1 ${isCompleted ? 'text-dog-primary' : 'text-dog-text'}`}>
                                            {item.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <BookOpen size={10} /> 読む目安: {item.time}
                                        </span>
                                    </div>
                                </div>
                                <CheckCircle size={20} className={isCompleted ? 'text-dog-primary fill-current' : 'text-gray-200'} />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        すべての項目を完了して、<br />
                        マスターバッジを獲得しよう！
                    </p>
                </div>
            </div>

            {/* Article Detail Overlay */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute inset-0 z-20 bg-white flex flex-col"
                    >
                        <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-dog-border">
                            <button onClick={() => setSelectedItem(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-gray-600" />
                            </button>
                            <h2 className="text-sm font-bold text-gray-500 flex-1 truncate pr-4">
                                {selectedItem.title}
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 pb-24">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold mb-4">
                                ⏱️ 目安時間: {selectedItem.time}
                            </span>
                            <h1 className="text-2xl font-bold text-dog-text mb-6 leading-tight">
                                {selectedItem.title}
                            </h1>

                            <div className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed">
                                {selectedItem.content}
                            </div>
                        </div>

                        <div className="p-4 border-t border-dog-border bg-white/90 backdrop-blur-sm">
                            <button
                                onClick={() => handleComplete(selectedItem.id)}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg ${completedItems.includes(selectedItem.id)
                                    ? 'bg-green-100 text-green-600 cursor-default'
                                    : 'bg-dog-primary text-white hover:bg-purple-700'
                                    }`}
                                disabled={completedItems.includes(selectedItem.id)}
                            >
                                {completedItems.includes(selectedItem.id) ? (
                                    <>
                                        <CheckCircle size={24} />
                                        読了済み
                                    </>
                                ) : (
                                    <>
                                        読了！
                                        <span className="text-sm opacity-80 font-normal ml-1">次へ進む</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

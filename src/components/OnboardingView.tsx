import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { ChevronDown } from 'lucide-react'

const BREEDS = [
  // 小型犬
  'トイプードル', 'チワワ', 'ポメラニアン', 'ミニチュアダックスフンド',
  'ヨークシャーテリア', 'マルチーズ', 'シーズー', 'パピヨン', 'ペキニーズ',
  'イタリアングレーハウンド', 'ミニチュアピンシャー', 'アフェンピンシャー',
  'キャバリア', 'ビションフリーゼ', 'ボロニーズ', 'ハバニーズ',
  'ジャックラッセルテリア', 'ウェストハイランドホワイトテリア',
  'スコティッシュテリア', 'ケアーンテリア', 'ノリッジテリア',
  'トイマンチェスターテリア', 'イングリッシュトイスパニエル',
  'プードル（ミニチュア）', 'プードル（トイ）',
  // 中型犬
  '柴犬', '豆柴', '四国犬', '紀州犬', '北海道犬',
  'ビーグル', 'コーギー（ウェルシュ）', 'コーギー（カーディガン）',
  'シェットランドシープドッグ', 'バセットハウンド', 'ブルドッグ',
  'フレンチブルドッグ', 'パグ', 'ボストンテリア', 'シュナウザー（ミニチュア）',
  'アメリカンコッカースパニエル', 'イングリッシュコッカースパニエル',
  'スプリンガースパニエル', 'バセンジー', 'ウィペット',
  'ポルトガルウォータードッグ', 'ラゴットロマニョーロ',
  // 大型犬
  'ゴールデンレトリバー', 'ラブラドールレトリバー', 'フラットコーテッドレトリバー',
  'ボーダーコリー', 'シェパード（ジャーマン）', 'シベリアンハスキー',
  'アラスカンマラミュート', 'サモエド', 'グレートピレニーズ',
  'バーニーズマウンテンドッグ', 'ロットワイラー', 'ドーベルマン',
  'ボクサー', 'ダルメシアン', 'ポインター', 'アイリッシュセッター',
  'スタンダードプードル', 'アフガンハウンド', 'グレートデン',
  'セントバーナード', 'ニューファンドランド', 'アイリッシュウルフハウンド',
  '秋田犬', '甲斐犬', '土佐犬',
  // MIX・その他
  'MIX犬（小型）', 'MIX犬（中型）', 'MIX犬（大型）', 'その他',
]

interface Props {
  userId: string
  onComplete: () => void
}

export const OnboardingView: React.FC<Props> = ({ userId, onComplete }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 飼い主
  const [ownerName, setOwnerName] = useState('')

  // 犬
  const [dogName, setDogName] = useState('')
  const [breed, setBreed] = useState('')
  const [showBreedPicker, setShowBreedPicker] = useState(false)
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [bio, setBio] = useState('')
  const [area, setArea] = useState('')

  const handleSubmit = async () => {
    if (!dogName || !breed || !age || !gender || !ownerName) {
      setError('必須項目をすべて入力してください')
      return
    }
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('dog_profiles').insert({
      user_id: userId,
      owner_name: ownerName,
      name: dogName,
      breed,
      age: parseInt(age),
      gender,
      bio,
      area,
    })

    if (error) {
      setError('登録に失敗しました。もう一度お試しください。')
      setLoading(false)
      return
    }

    onComplete()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <div className="pt-12 pb-6 px-6 border-b border-gray-100">
        <h1 className="font-black text-xl tracking-[0.1em] text-gray-900 uppercase">WMC</h1>
        <p className="text-xs font-bold text-gray-400 tracking-widest mt-1">プロフィールを設定してください</p>
        {/* ステップバー */}
        <div className="flex gap-2 mt-4">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-dog-accent' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-dog-accent' : 'bg-gray-200'}`} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-5"
          >
            <p className="text-xs font-extrabold text-gray-400 tracking-widest uppercase">Step 1 — 飼い主情報</p>

            <div>
              <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">
                あなたの名前 <span className="text-dog-accent">*</span>
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="例：山田 太郎"
                className="w-full border border-dog-border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-dog-accent transition-colors"
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-5"
          >
            <p className="text-xs font-extrabold text-gray-400 tracking-widest uppercase">Step 2 — 犬のプロフィール</p>

            <div>
              <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">
                犬の名前 <span className="text-dog-accent">*</span>
              </label>
              <input
                type="text"
                value={dogName}
                onChange={e => setDogName(e.target.value)}
                placeholder="例：モチ"
                className="w-full border border-dog-border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-dog-accent transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">
                犬種 <span className="text-dog-accent">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowBreedPicker(!showBreedPicker)}
                className="w-full border border-dog-border rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between outline-none focus:border-dog-accent transition-colors"
              >
                <span className={breed ? 'text-gray-800' : 'text-gray-400'}>{breed || '犬種を選択'}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {showBreedPicker && (
                <div className="border border-dog-border rounded-xl mt-1 max-h-40 overflow-y-auto shadow-md">
                  {BREEDS.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => { setBreed(b); setShowBreedPicker(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">
                  年齢 <span className="text-dog-accent">*</span>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="例：2"
                  min="0"
                  max="20"
                  className="w-full border border-dog-border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-dog-accent transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">
                  性別 <span className="text-dog-accent">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-colors ${gender === 'male' ? 'bg-dog-accent text-white border-dog-accent' : 'border-dog-border text-gray-500'}`}
                  >
                    ♂ オス
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-colors ${gender === 'female' ? 'bg-dog-accent text-white border-dog-accent' : 'border-dog-border text-gray-500'}`}
                  >
                    ♀ メス
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">居住エリア</label>
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="例：東京都渋谷区"
                className="w-full border border-dog-border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-dog-accent transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">一言自己紹介</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="例：散歩大好き！フレンドリーな子です"
                rows={3}
                className="w-full border border-dog-border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-dog-accent transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
          </motion.div>
        )}
      </div>

      {/* ボタン */}
      <div className="px-6 pb-10 pt-4 border-t border-gray-100">
        {step === 1 ? (
          <button
            onClick={() => {
              if (!ownerName) { setError('名前を入力してください'); return }
              setError(null)
              setStep(2)
            }}
            className="w-full bg-dog-accent text-white font-bold py-4 rounded-xl text-sm tracking-wide active:scale-95 transition-transform"
          >
            次へ
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-200 text-gray-700 font-bold py-4 rounded-xl text-sm active:scale-95 transition-transform"
            >
              戻る
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-dog-accent text-white font-bold py-4 rounded-xl text-sm active:scale-95 transition-transform disabled:opacity-50"
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

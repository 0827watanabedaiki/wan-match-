import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'

type Mode = 'login' | 'signup'

export const AuthView: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('確認メールを送りました。メールを確認してください。')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-8">
      {/* ロゴ */}
      <div className="mb-10 text-center">
        <h1 className="font-black text-3xl tracking-[0.15em] text-gray-900 uppercase">WMC</h1>
        <span className="font-bold text-[0.6rem] tracking-[0.4em] text-gray-400 uppercase">WANMATCH</span>
      </div>

      {/* タブ */}
      <div className="flex mb-8 border-b border-dog-border">
        <button
          className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors ${
            mode === 'login' ? 'text-dog-accent border-b-2 border-dog-accent' : 'text-gray-400'
          }`}
          onClick={() => { setMode('login'); setError(null); setMessage(null) }}
        >
          ログイン
        </button>
        <button
          className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors ${
            mode === 'signup' ? 'text-dog-accent border-b-2 border-dog-accent' : 'text-gray-400'
          }`}
          onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
        >
          新規登録
        </button>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-dog-border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-dog-accent transition-colors"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 tracking-wide block mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-dog-border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-dog-accent transition-colors"
            placeholder="6文字以上"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}

        {message && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-green-600 text-center"
          >
            {message}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-dog-accent text-white font-bold py-3 rounded-xl text-sm tracking-wide mt-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? '...' : mode === 'login' ? 'ログイン' : '登録する'}
        </button>
      </form>
    </div>
  )
}

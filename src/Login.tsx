import { useState } from 'react'

interface LoginProps {
  onLoginSuccess: (email: string) => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }

    // Save session locally so the app unlocks immediately
    localStorage.setItem('honest_eye_user', email.trim())
    onLoginSuccess(email.trim())
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 opacity-95" />

      <div className="relative w-full max-w-md rounded-[3rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-indigo-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">
            HONEST EYE
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isSignUp
              ? 'Sign up to start verifying claims with AI.'
              : 'Sign in to access your credibility dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-indigo-400 hover:to-violet-400"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="text-sm text-slate-400 transition hover:text-red-500"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

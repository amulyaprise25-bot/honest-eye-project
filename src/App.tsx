
import { useState } from 'react'
import {
  ShieldCheck,
  Search,
  Upload,
  FileText,
  Image,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Lock,
  Zap,
  BookOpen,
  Info
} from 'lucide-react'
import Login from './Login'

type InputMode = 'text' | 'image'

type AnalysisResult = {
  verdict?: string
  confidence?: number
  explanation?: string
  summary?: string
  sources?: string[]
  [key: string]: unknown
}

function HomePage() {
  const [mode, setMode] = useState<InputMode>('text')
  const [claim, setClaim] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (mode === 'text' && !claim.trim()) {
      setError('Please enter a claim first.')
      return
    }

    if (mode === 'image' && !file) {
      setError('Please upload an image first.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/misinfo', {
        method: 'POST',
        headers: mode === 'text'
          ? { 'Content-Type': 'application/json' }
          : undefined,
        body: mode === 'text'
          ? JSON.stringify({ text: claim })
          : (() => {
              const formData = new FormData()
              if (file) formData.append('image', file)
              return formData
            })()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Analysis failed.')
      }

      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const verdict = String(result?.verdict || 'Analysis completed')
  const explanation = String(
    result?.explanation || result?.summary || 'No explanation was provided.'
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-600 p-2 text-white">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight">
              honest<span className="text-teal-600">eye</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#analyzer" className="hover:text-teal-600">Fact Check</a>
            <a href="#how-it-works" className="hover:text-teal-600">How it works</a>
            <a href="#features" className="hover:text-teal-600">Features</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-teal-600 hover:text-teal-700"
            >
              Log in
            </a>
            <a
              href="#analyzer"
              className="hidden rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700 sm:inline-block"
            >
              Check a claim <ArrowRight className="ml-1 inline" size={15} />
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              <ShieldCheck size={17} />
              Your trusted fact-checking assistant
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
              See the truth.
              <br />
              <span className="text-teal-600">Stop the fake.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              In a world full of misinformation, make informed decisions.
              Check suspicious claims and images with Honest Eye.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#analyzer"
                className="rounded-full bg-teal-600 px-7 py-4 font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700"
              >
                Start fact checking <ArrowRight className="ml-2 inline" size={18} />
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-slate-300 px-7 py-4 font-bold text-slate-700 hover:bg-white"
              >
                Learn more
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle className="text-teal-600" size={17} />
                Easy to use
              </span>
              <span className="flex items-center gap-2">
                <Lock className="text-teal-600" size={17} />
                Simple analysis
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-teal-600">HONEST EYE</p>
                <h2 className="mt-1 text-2xl font-black">Truth matters.</h2>
              </div>
              <div className="rounded-2xl bg-teal-50 p-4 text-teal-700">
                <Eye size={34} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Search className="text-teal-600" />
                  <div>
                    <p className="font-bold">Check information</p>
                    <p className="text-sm text-slate-500">Examine suspicious claims</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Image className="text-teal-600" />
                  <div>
                    <p className="font-bold">Analyse images</p>
                    <p className="text-sm text-slate-500">Submit an image for checking</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-teal-600" />
                  <div>
                    <p className="font-bold">Understand the result</p>
                    <p className="text-sm text-slate-500">Review the analysis explanation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="analyzer" className="bg-slate-900 px-6 py-20 text-white">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="font-bold uppercase tracking-widest text-teal-400">
                Fact checking tool
              </p>
              <h2 className="mt-3 text-4xl font-black">Check before you believe.</h2>
              <p className="mt-4 text-slate-300">
                Enter a claim or upload an image to begin your analysis.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl md:p-9">
              <div className="mb-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setMode('text')
                    setError('')
                    setResult(null)
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold ${
                    mode === 'text'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <FileText size={19} /> Text claim
                </button>

                <button
                  onClick={() => {
                    setMode('image')
                    setError('')
                    setResult(null)
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold ${
                    mode === 'image'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Image size={19} /> Image check
                </button>
              </div>

              {mode === 'text' ? (
                <textarea
                  value={claim}
                  onChange={e => setClaim(e.target.value)}
                  placeholder="Paste or type the claim you want to verify..."
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-slate-200 p-5 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              ) : (
                <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-teal-500">
                  <Upload size={38} className="mb-4 text-teal-600" />
                  <span className="font-bold">Click to upload an image</span>
                  <span className="mt-2 text-sm text-slate-500">
                    Choose an image from your device
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                  {file && (
                    <span className="mt-4 text-sm font-semibold text-teal-700">
                      Selected: {file.name}
                    </span>
                  )}
                </label>
              )}

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-4 font-bold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analysing...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Analyse now
                  </>
                )}
              </button>

              {result && (
                <div className="mt-7 rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    {verdict.toLowerCase().includes('false') ||
                    verdict.toLowerCase().includes('fake') ? (
                      <XCircle className="text-red-600" size={28} />
                    ) : verdict.toLowerCase().includes('true') ? (
                      <CheckCircle className="text-green-600" size={28} />
                    ) : (
                      <Info className="text-teal-600" size={28} />
                    )}
                    <h3 className="text-xl font-black">{verdict}</h3>
                  </div>

                  <p className="mt-4 leading-7 text-slate-600">{explanation}</p>

                  {result.confidence !== undefined && (
                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      Confidence: {String(result.confidence)}%
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-teal-600">
              Simple process
            </p>
            <h2 className="mt-3 text-4xl font-black">How it works</h2>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {[
              {
                icon: Upload,
                title: '1. Submit',
                description: 'Enter a suspicious claim or upload an image.'
              },
              {
                icon: Search,
                title: '2. Analyse',
                description: 'Let the available analysis service examine your input.'
              },
              {
                icon: CheckCircle,
                title: '3. Understand',
                description: 'Read the result and its explanation before deciding.'
              }
            ].map((item, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-white p-8">
                <div className="mb-5 inline-flex rounded-2xl bg-teal-50 p-4 text-teal-700">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="bg-teal-50 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="font-bold uppercase tracking-widest text-teal-700">
                Why Honest Eye?
              </p>
              <h2 className="mt-3 text-4xl font-black">Think before you share.</h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-7">
                <Zap className="text-teal-600" size={30} />
                <h3 className="mt-4 text-xl font-bold">Simple experience</h3>
                <p className="mt-2 text-slate-600">
                  A straightforward way to submit information for checking.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-7">
                <ShieldCheck className="text-teal-600" size={30} />
                <h3 className="mt-4 text-xl font-bold">Awareness</h3>
                <p className="mt-2 text-slate-600">
                  Encourages users to question information before sharing it.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-7">
                <BookOpen className="text-teal-600" size={30} />
                <h3 className="mt-4 text-xl font-bold">Learn and verify</h3>
                <p className="mt-2 text-slate-600">
                  Understand why checking information matters.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-teal-400" size={25} />
            <span className="text-xl font-black">
              honest<span className="text-teal-400">eye</span>
            </span>
          </div>

          <p className="text-sm text-slate-400">
            Think critically. Verify responsibly. Share wisely.
          </p>

          <a href="#analyzer" className="text-sm font-bold text-teal-400 hover:text-white">
            Check a claim ↑
          </a>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return window.location.pathname === '/login'
    ? <Login />
    : <HomePage />
}

export default App

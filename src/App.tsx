import { useState, useEffect } from 'react'
import Login from './Login'

interface AnalysisResult {
  error?: string;
  score?: number;
  explanation?: string;
  redFlags?: string[];
  trustedSources?: string[];
}

type InputMode = 'text' | 'url' | 'image'

function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [mode, setMode] = useState<InputMode>('text')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  // Check if user is already logged in on page load
  useEffect(() => {
    const savedUser = localStorage.getItem('honest_eye_user')
    if (savedUser) {
      setUserEmail(savedUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('honest_eye_user')
    setUserEmail(null)
    setResult(null)
    setContent('')
    setImageFile(null)
    setImagePreview(null)
  }

  // Show Login page if not authenticated
  if (!userEmail) {
    return <Login onLoginSuccess={(email) => setUserEmail(email)} />
  }

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    setContent('')
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview(null)
    }
  }

  const handleAnalyze = async () => {
    if ((mode === 'text' || mode === 'url') && !content.trim()) return
    if (mode === 'image' && !imageFile) return

    setLoading(true)
    setResult(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000'
      const endpoint = `${apiUrl}/api/misinfo`
      const payload: Record<string, unknown> = { type: mode }

      if (mode === 'image') {
        const formData = new FormData()
        formData.append('type', 'image')
        formData.append('image', imageFile as Blob)

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setResult(data)
        return
      }

      payload.content = content.trim()

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to analyze content. Please try again.'
      console.error('Error analyzing content:', message)
      setResult({ error: message, explanation: 'Failed to analyze content. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 opacity-95" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 rounded-[3rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <span className="inline-flex rounded-full bg-indigo-500/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-indigo-200">
              HONEST EYE
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">{userEmail}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/15 bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-rose-400/50 hover:text-rose-300"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Analyze credibility in seconds.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Verify claims with AI-powered text, URL, and image analysis. Get a credibility score, red flag alerts, and trusted source guidance instantly.
              </p>
            </div>
            <div className="rounded-[2.5rem] bg-slate-900/80 p-8 shadow-xl shadow-indigo-950/30 ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">What you get</p>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                <li>• Instant misinformation scoring</li>
                <li>• Adaptive text, link, and image analysis</li>
                <li>• Actionable red flag insights</li>
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-indigo-500/10 p-4">
                  <p className="text-2xl font-semibold text-white">98%</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Accuracy</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-2xl font-semibold text-white">3 modes</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Text, URL, Image</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[3rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Analysis mode</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Start a new review</h2>
              </div>
              <div className="rounded-full bg-slate-800/80 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
                {mode === 'text' ? 'Text analysis' : mode === 'url' ? 'URL analysis' : 'Image analysis'}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {(['text', 'url', 'image'] as InputMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMode(item)
                    setResult(null)
                    setContent('')
                    handleImageChange(null)
                  }}
                  className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                    mode === item
                      ? 'border-transparent bg-gradient-to-r from-red-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'border-white/10 bg-slate-950 text-slate-300 hover:border-white/20 hover:bg-slate-900'
                  }`}
                >
                  {item === 'text' ? 'Text' : item === 'url' ? 'URL' : 'Image'}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-inner shadow-white/5">
              {mode === 'image' ? (
                <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-200">Upload image</label>
                      <p className="mt-2 text-sm text-slate-400">Select an image for the AI to inspect the text and claim context.</p>
                    </div>
                    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/70 p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null
                          handleImageChange(file)
                        }}
                        className="mx-auto block w-full cursor-pointer text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-400"
                      />
                      <p className="mt-4 text-sm text-slate-500">PNG, JPG, or WEBP. Max 10MB.</p>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-4">
                    <p className="text-sm font-semibold text-slate-200">Preview</p>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-4 h-64 w-full rounded-[1.75rem] object-cover"
                      />
                    ) : (
                      <div className="mt-4 flex h-64 items-center justify-center rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-950 text-sm text-slate-500">
                        No image selected
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm font-semibold text-slate-200">{mode === 'text' ? 'Enter text' : 'Enter URL'}</label>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Paste your content</span>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={mode === 'url' ? 4 : 10}
                    placeholder={
                      mode === 'text'
                        ? 'Paste article text, social media post, or claim content here...'
                        : 'Paste the link to the article or post you want analyzed...'
                    }
                    className="mt-4 min-h-[220px] w-full rounded-[2rem] border border-white/10 bg-slate-950/80 px-5 py-5 text-slate-100 shadow-inner shadow-black/20 placeholder:text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  /> 
                </div>
              )}

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">
                  {mode === 'image'
                    ? 'Upload an image to detect misleading visuals and hidden claims.'
                    : mode === 'url'
                    ? 'Analyze a website URL for credibility and misinformation risk.'
                    : 'Analyze raw text for misinformation signals and credibility.'}
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || (mode !== 'image' ? !content.trim() : !imageFile)}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {loading ? 'Analyzing...' : 'Analyze now'}
                </button>
              </div>
            </div>
          </section>

          <aside className="rounded-[3rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Live verdict</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Analysis panel</h2>
              </div>
              <div className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
                {result ? 'Ready' : 'Waiting'}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">credibility score</p>
                    <p className={`mt-3 text-4xl font-semibold ${
                      result?.score !== undefined
                        ? result.score >= 70
                          ? 'text-emerald-400'
                          : result.score >= 40
                          ? 'text-amber-400'
                          : 'text-rose-400'
                        : 'text-slate-400'
                    }`}>
                      {result?.score !== undefined ? `${result.score}/100` : '-- /100'}
                    </p>
                  </div>
                  <div className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    result?.score !== undefined
                      ? result.score >= 70
                        ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30'
                        : result.score >= 40
                        ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30'
                        : 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {result?.score !== undefined
                      ? result.score >= 70
                        ? 'NOT FAKE'
                        : result.score >= 40
                        ? 'REVIEW NEEDED'
                        : 'FAKE NEWS'
                      : 'AWAITING INPUT'}
                  </div>
                </div>
                <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result?.score !== undefined
                        ? result.score >= 70
                          ? 'bg-emerald-400'
                          : result.score >= 40
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${result?.score ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">status</p>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  {result?.error
                    ? 'The analysis failed. Try again or use different input.'
                    : result
                    ? 'Analysis complete. Review the findings below.'
                    : 'Submit your first input to generate a credibility assessment.'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Focus area</p>
                  <p className="mt-3 text-base text-slate-300">{mode === 'image' ? 'Visual claim detection' : mode === 'url' ? 'Link credibility' : 'Text reliability'}</p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Recommended action</p>
                  <p className="mt-3 text-base text-slate-300">{result?.error ? 'Request new analysis' : 'Review results and verify sources'}</p>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {result && (
          <section className="mt-10 rounded-[3rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[2rem] bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Analysis details</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">{result.explanation || 'Detailed insight will appear here once analysis completes.'}</p>
              </div>
              <div className="rounded-[2rem] bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Red flags</p>
                {result.redFlags && result.redFlags.length > 0 ? (
                  <ul className="mt-4 space-y-3 text-sm text-amber-200">
                    {result.redFlags.map((flag, index) => (
                      <li key={index}>• {flag}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">No significant red flags detected.</p>
                )}
              </div>
              <div className="rounded-[2rem] bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Trusted sources</p>
                {result.trustedSources && result.trustedSources.length > 0 ? (
                  <ul className="mt-4 space-y-3 text-sm text-emerald-200">
                    {result.trustedSources.map((source, index) => (
                      <li key={index}>• {source}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">No trusted sources available for this analysis.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App

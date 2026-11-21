import Login from './Login'
import { useEffect, useState } from 'react'
import {
  ArrowRight, BadgeCheck, BookOpen, CheckCircle2, ChevronRight, CircleAlert,
  ClipboardCheck, FileImage, FileText, Globe2, Link2, Loader2, Shield,
  ShieldCheck, Sparkles, UploadCloud, X, Zap,
} from 'lucide-react'

interface FactCheckItem {
  claim?: string
  text?: string
  claimant?: string
  publisher?: { name?: string; site?: string }
  url?: string
  reviewDate?: string
  textualRating?: string
}
interface AnalysisResult {
  error?: string
  score?: number
  explanation?: string
  redFlags?: string[]
  trustedSources?: string[]
  educationalTips?: string[]
  factCheck?: FactCheckItem[]
  confidence?: number
  content?: string
  type?: string
}
type InputMode = 'text' | 'url' | 'image'

const modes = [
  { id: 'text' as const, label: 'Text claim', detail: 'Paste a message or claim', icon: FileText },
  { id: 'url' as const, label: 'Article link', detail: 'Check a webpage URL', icon: Link2 },
  { id: 'image' as const, label: 'Image', detail: 'Upload a screenshot', icon: FileImage },
]

function App() {
    if (window.location.pathname === '/login') {
    return <Login />
  }
  const [mode, setMode] = useState<InputMode>('text')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview) }, [imagePreview])

  const chooseMode = (next: InputMode) => {
    setMode(next); setResult(null); setContent(''); setImageFile(null); setImagePreview(null)
  }

  const handleAnalyze = async () => {
    if ((mode === 'text' || mode === 'url') && !content.trim()) return
    if (mode === 'image' && !imageFile) return
    setLoading(true); setResult(null)
    try {
      const endpoint = `${import.meta.env.VITE_API_URL?.trim() || ''}/api/misinfo`
      let response: Response
      if (mode === 'image') {
        const body = new FormData()
        body.append('type', 'image'); body.append('image', imageFile as Blob)
        response = await fetch(endpoint, { method: 'POST', body })
      } else {
        response = await fetch(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: mode, content: content.trim() }),
        })
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || `Server returned ${response.status}. Check that the backend is running.`)
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unable to reach the Honest Eye server.' })
    } finally { setLoading(false) }
  }

  const score = typeof result?.score === 'number' ? Math.max(0, Math.min(100, result.score)) : null
  const scoreTone = score === null ? 'neutral' : score >= 70 ? 'good' : score >= 40 ? 'warn' : 'bad'

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="hero-wash" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between border-b border-slate-200/70">
          <a href="#home" className="flex items-center gap-3 no-underline">
            <span className="brand-mark"><ShieldCheck size={23} strokeWidth={2.4} /></span>
            <span><span className="block text-lg font-extrabold tracking-tight text-slate-900">honest<span className="text-teal-600">eye</span></span><span className="-mt-1 block text-[10px] font-semibold uppercase tracking-[.22em] text-slate-400">Think before you share</span></span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
            <a className="nav-link" href="#how-it-works">How it works</a>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#learn">Media literacy</a>
          </div>
          <a href="#analyzer" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-teal-700">Check a claim <ArrowRight className="ml-1 inline" size={15} /></a>
        </nav>

        <header id="home" className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[.13em] text-teal-700 shadow-sm"><Sparkles size={14} /> AI-powered misinformation awareness</div>
            <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-[-.045em] text-slate-950 sm:text-6xl">Pause. Check.<br /><span className="headline-gradient">Share with confidence.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">A smarter way to examine online claims. Review text, article links and images with AI-assisted analysis, warning signs and trusted source guidance.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#analyzer" className="rounded-full bg-teal-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700">Start fact-checking <ArrowRight className="ml-2 inline" size={16} /></a>
              <a href="#how-it-works" className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">See how it works</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-600" size={17} /> Text, links & images</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-600" size={17} /> AI-assisted insights</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-600" size={17} /> Built for digital awareness</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-5 top-12 h-28 w-28 rounded-full bg-amber-200/70 blur-2xl" />
            <div className="absolute -right-4 bottom-4 h-36 w-36 rounded-full bg-teal-200/80 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-[0_25px_80px_-35px_rgba(15,45,65,.28)] sm:p-7">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-extrabold text-slate-800"><span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700"><Shield size={19} /></span> Honest Eye snapshot</div><span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">Illustrative preview</span></div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-5"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><Globe2 size={14} /> Claim review</div><p className="mt-3 text-lg font-bold leading-7 text-slate-800">“A viral message says a new public scheme gives free smartphones to everyone.”</p><div className="mt-4 flex items-center gap-2"><span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"><span className="block h-full w-[42%] rounded-full bg-gradient-to-r from-amber-400 to-orange-500" /></span><span className="text-xs font-bold text-amber-600">Needs checking</span></div></div>
              <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-teal-50 p-4"><div className="text-xs font-bold uppercase tracking-wider text-teal-700">Input types</div><div className="mt-2 text-2xl font-black text-slate-900">03</div><div className="mt-1 text-xs text-slate-500">Text · URL · Image</div></div><div className="rounded-2xl bg-violet-50 p-4"><div className="text-xs font-bold uppercase tracking-wider text-violet-700">Review support</div><div className="mt-2 text-2xl font-black text-slate-900">AI + sources</div><div className="mt-1 text-xs text-slate-500">Evidence-aware guidance</div></div></div>
              <p className="mt-4 text-[11px] leading-5 text-slate-400">Example interface only. An AI score is an indicator, not proof that a claim is true or false.</p>
            </div>
          </div>
        </header>

        <section id="analyzer" className="scroll-mt-6">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="section-kicker">The verification workspace</p><h2 className="section-title">Check something you saw online</h2><p className="mt-2 text-sm text-slate-500">Choose an input type and submit it for analysis.</p></div><div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Analysis service</div></div>
          <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-30px_rgba(15,45,65,.35)] sm:p-7">
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
                {modes.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => chooseMode(id)} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-xs font-bold transition sm:flex-row sm:justify-center sm:gap-2 sm:text-sm ${mode === id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><Icon size={17} />{label}</button>)}
              </div>
              {mode === 'image' ? <div className="mt-6"><div className="mb-3"><h3 className="font-extrabold text-slate-800">Upload a screenshot or image</h3><p className="mt-1 text-sm text-slate-500">Choose a clear image containing the claim you want to review.</p></div><label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 p-6 text-center transition hover:border-teal-400 hover:bg-teal-50"><UploadCloud className="mb-3 text-teal-600" size={32} /><span className="font-bold text-slate-700">Click to choose an image</span><span className="mt-1 text-xs text-slate-400">PNG, JPG or WEBP</span><input className="hidden" type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0] || null; setImageFile(f); setImagePreview(f ? URL.createObjectURL(f) : null); setResult(null) }} /></label>{imagePreview && <div className="relative mt-4 inline-block"><img src={imagePreview} alt="Selected upload preview" className="max-h-48 rounded-xl border border-slate-200" /><button onClick={() => { setImageFile(null); setImagePreview(null) }} className="absolute -right-2 -top-2 rounded-full bg-slate-900 p-1.5 text-white"><X size={14} /></button></div>}</div> : <div className="mt-6"><div className="mb-3"><h3 className="font-extrabold text-slate-800">{mode === 'text' ? 'Paste the claim or message' : 'Paste the article URL'}</h3><p className="mt-1 text-sm text-slate-500">{mode === 'text' ? 'Include the complete message where possible, not just a headline.' : 'Use the full public webpage address.'}</p></div><textarea value={content} onChange={e => setContent(e.target.value)} rows={mode === 'url' ? 4 : 8} placeholder={mode === 'text' ? 'Paste a forwarded message, social media post, news claim or statement here…' : 'https://example.com/news/article'} className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10" /></div>}
              <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center"><p className="max-w-sm text-xs leading-5 text-slate-400">Avoid sharing private information. AI analysis can make mistakes; verify important claims with primary sources.</p><button onClick={handleAnalyze} disabled={loading || (mode === 'image' ? !imageFile : !content.trim())} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40">{loading ? <><Loader2 className="animate-spin" size={17} /> Analyzing…</> : <>Analyze content <ArrowRight size={16} /></>}</button></div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-30px_rgba(15,45,65,.35)] sm:p-7">
              <div className="flex items-start justify-between"><div><p className="section-kicker">Your review</p><h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Analysis summary</h3></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-500">{result ? 'Completed' : loading ? 'In progress' : 'Awaiting input'}</span></div>
              {!result && !loading && <div className="mt-7 flex min-h-[290px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/70 px-6 text-center"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-teal-600 shadow-sm"><ClipboardCheck size={30} /></span><h4 className="mt-5 font-extrabold text-slate-800">Your results will appear here</h4><p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Submit text, a link or an image to see the credibility assessment, explanation and warning signs.</p></div>}
              {loading && <div className="mt-7 flex min-h-[290px] flex-col items-center justify-center rounded-2xl bg-slate-50"><Loader2 className="animate-spin text-teal-600" size={36} /><p className="mt-4 font-bold text-slate-700">Reviewing your content</p><p className="mt-1 text-sm text-slate-400">This may take a few moments.</p></div>}
              {result && <div className="mt-6 space-y-4">
                {result.error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5"><div className="flex items-center gap-2 font-extrabold text-rose-700"><CircleAlert size={19} /> Analysis could not be completed</div><p className="mt-2 text-sm leading-6 text-rose-700">{result.error}</p><p className="mt-3 text-xs text-rose-500">Check that the backend is running and try again.</p></div> : <>
                  <div className={`rounded-2xl p-5 ${scoreTone === 'good' ? 'bg-emerald-50' : scoreTone === 'warn' ? 'bg-amber-50' : scoreTone === 'bad' ? 'bg-rose-50' : 'bg-slate-50'}`}><div className="flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Credibility indicator</p><div className={`mt-2 text-4xl font-black ${scoreTone === 'good' ? 'text-emerald-700' : scoreTone === 'warn' ? 'text-amber-700' : scoreTone === 'bad' ? 'text-rose-700' : 'text-slate-500'}`}>{score !== null ? `${score}/100` : 'Not provided'}</div></div><span className="rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold text-slate-600">{score === null ? 'No score' : score >= 70 ? 'Higher indicator' : score >= 40 ? 'Needs review' : 'Lower indicator'}</span></div>{score !== null && <div className="mt-4 h-2 overflow-hidden rounded-full bg-white"><div className={`h-full rounded-full ${scoreTone === 'good' ? 'bg-emerald-500' : scoreTone === 'warn' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${score}%` }} /></div>}</div>
                  <div className="rounded-2xl border border-slate-100 p-4"><h4 className="flex items-center gap-2 font-extrabold text-slate-800"><Sparkles className="text-violet-500" size={17} /> AI explanation</h4><p className="mt-2 text-sm leading-6 text-slate-600">{result.explanation || 'No explanation was returned.'}</p></div>
                  <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4"><h4 className="flex items-center gap-2 text-sm font-extrabold text-amber-800"><CircleAlert size={16} /> Warning signs</h4>{result.redFlags?.length ? <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-amber-900">{result.redFlags.map((f,i)=><li key={i}>{f}</li>)}</ul> : <p className="mt-3 text-xs text-slate-500">No warning signs were returned.</p>}</div><div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4"><h4 className="flex items-center gap-2 text-sm font-extrabold text-teal-800"><BadgeCheck size={16} /> Suggested sources</h4>{result.trustedSources?.length ? <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-teal-900">{result.trustedSources.map((s,i)=><li key={i}>{s}</li>)}</ul> : <p className="mt-3 text-xs text-slate-500">No source suggestions returned.</p>}</div></div>
                  {result.factCheck?.length ? <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4"><h4 className="font-extrabold text-indigo-900">Related fact-check reviews</h4><div className="mt-3 space-y-3">{result.factCheck.map((f,i)=><div key={i} className="rounded-xl bg-white p-3"><p className="text-sm font-bold text-slate-800">{f.claim || f.text || 'Related claim'}</p><p className="mt-1 text-xs text-slate-500">{f.publisher?.name || f.claimant || 'Fact-check publisher'} {f.textualRating ? `· ${f.textualRating}` : ''}</p>{f.url && <a className="mt-2 inline-flex text-xs font-bold text-indigo-700 underline" href={f.url} target="_blank" rel="noreferrer">Read review</a>}</div>)}</div></div> : null}
                  {result.educationalTips?.length ? <div className="rounded-2xl bg-slate-50 p-4"><h4 className="font-extrabold text-slate-800">Before you share</h4><ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-slate-600">{result.educationalTips.map((tip,i)=><li key={i}>{tip}</li>)}</ul></div> : null}
                  <p className="text-[11px] leading-5 text-slate-400">This assessment is decision support, not a definitive verdict. Confirm important information through original documents and independent fact-checkers.</p>
                </>}
              </div>}
            </section>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-8 py-16"><div className="text-center"><p className="section-kicker">Simple by design</p><h2 className="section-title">A clearer way to check information</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">Honest Eye brings useful review signals together so you can make a more informed decision before sharing.</p></div><div className="mt-9 grid gap-4 md:grid-cols-3">{[{n:'01',t:'Choose your content',d:'Submit a text claim, a public article link or an image screenshot.',ic:FileText,c:'bg-sky-50 text-sky-700'},{n:'02',t:'Review the signals',d:'AI-assisted analysis highlights context, possible warning signs and source suggestions.',ic:Zap,c:'bg-violet-50 text-violet-700'},{n:'03',t:'Verify before sharing',d:'Use the explanation and suggested sources to check the original evidence.',ic:ShieldCheck,c:'bg-emerald-50 text-emerald-700'}].map(({n,t,d,ic:Icon,c})=><div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-black tracking-widest text-slate-300">{n}</span><span className={`grid h-11 w-11 place-items-center rounded-xl ${c}`}><Icon size={21}/></span></div><h3 className="mt-5 text-lg font-extrabold text-slate-900">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}</div></section>

        <section id="features" className="scroll-mt-8 rounded-[2rem] bg-slate-900 px-6 py-10 text-white sm:px-10"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-teal-300">Designed for digital awareness</p><h2 className="mt-3 text-3xl font-black tracking-tight">More context.<br/>Better decisions.</h2><p className="mt-4 text-sm leading-7 text-slate-300">Misinformation can spread quickly. Honest Eye encourages careful reading, source checking and responsible sharing.</p></div><div className="grid gap-3 sm:grid-cols-2">{[{t:'Multi-format review',d:'Text, URL and image inputs',ic:FileImage},{t:'AI-assisted insights',d:'Readable explanations and signals',ic:Sparkles},{t:'Warning sign detection',d:'Patterns that deserve a closer look',ic:CircleAlert},{t:'Learning-oriented guidance',d:'Practical habits for safer sharing',ic:BookOpen}].map(({t,d,ic:Icon})=><div key={t} className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><Icon className="text-teal-300" size={21}/><h3 className="mt-3 font-extrabold">{t}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{d}</p></div>)}</div></div></section>

        <section id="learn" className="mt-10 flex flex-col justify-between gap-4 rounded-2xl border border-teal-100 bg-teal-50 p-6 sm:flex-row sm:items-center"><div><p className="text-xs font-extrabold uppercase tracking-widest text-teal-700">A good habit</p><h2 className="mt-1 text-xl font-black text-slate-900">Pause before you forward.</h2><p className="mt-1 text-sm text-slate-600">Check the date, original source, evidence and independent coverage.</p></div><a href="#analyzer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">Review a claim <ChevronRight size={16}/></a></section>
        <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-200 py-7 text-xs text-slate-400 sm:flex-row"><span className="font-bold text-slate-600">honest<span className="text-teal-600">eye</span> · Think before you share</span><span>AI-assisted information review · Always verify important claims independently</span></footer>
      </div>
    </div>
  )
}

export default App

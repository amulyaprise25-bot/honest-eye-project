import Login from './Login'
import { useEffect, useState } from 'react'
import {
  ArrowRight, BadgeCheck, BookOpen, CheckCircle2, ChevronRight, CircleAlert,
  ClipboardCheck, FileImage, FileText, Globe2, Link2, Loader2, Shield,
  ShieldCheck, Sparkles, UploadCloud, X, Zap,
}

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

function HomePage() {
  // KEEP YOUR EXISTING HOMEPAGE CODE HERE, UNCHANGED.
}

function App() {
  return window.location.pathname === '/login' ? <Login /> : <HomePage />
}

export default App

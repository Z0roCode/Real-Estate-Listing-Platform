"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, Loader2, Database, ArrowRight, Copy, Check } from "lucide-react"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

interface Status {
  connected: boolean
  seeded?: boolean
  counts?: { agents: number; properties: number; leads: number }
  error?: string
}

export default function SetupPage() {
  const [status, setStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const check = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/setup")
      const data = await res.json()
      setStatus(data)
    } catch {
      setStatus({ connected: false, error: "Cannot reach the API" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { check() }, [])

  const seed = async () => {
    setSeeding(true); setError(null); setSeedResult(null)
    try {
      const res = await fetch("/api/admin/setup", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Seed failed")
      setSeedResult(data.message)
      check()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Seed failed")
    } finally {
      setSeeding(false)
    }
  }

  const copyEnvLine = () => {
    navigator.clipboard.writeText("DATABASE_URL=postgresql://your-supabase-connection-string?pgbouncer=true")
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Database className="h-5 w-5" /></span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Database setup</h1>
              <p className="text-sm text-muted-foreground">One-click setup for your Vercel deployment. No terminal needed.</p>
            </div>
          </div>

          {/* Step 1: Supabase */}
          <section className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
              <h2 className="text-base font-semibold text-foreground">Create a free Supabase database</h2>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-foreground/80">
              <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">supabase.com</a> and sign up (free).</li>
              <li>Click <strong>New Project</strong>, pick a name, choose a region close to you.</li>
              <li>Wait 1–2 minutes for it to provision.</li>
            </ol>
          </section>

          {/* Step 2: Connection string */}
          <section className="mt-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
              <h2 className="text-base font-semibold text-foreground">Copy your connection string</h2>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-foreground/80">
              <li>In your Supabase project, click the <strong>Connect</strong> button in the top toolbar.</li>
              <li>Click the <strong>ORMs</strong> or <strong>Frameworks</strong> tab.</li>
              <li>Select <strong>Prisma</strong>.</li>
              <li>Copy the connection string (it looks like <code className="rounded bg-muted px-1.5 py-0.5 text-xs">postgresql://postgres.xxxxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres</code>).</li>
            </ol>
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              Can't find a "Connect" button? Go to <strong>Project Settings (gear icon, bottom left) → Database → Connection string → URI</strong> instead.
            </p>
          </section>

          {/* Step 3: Vercel env var */}
          <section className="mt-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
              <h2 className="text-base font-semibold text-foreground">Add it to Vercel</h2>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-foreground/80">
              <li>Open your Vercel project → <strong>Settings → Environment Variables</strong>.</li>
              <li>Click <strong>Add New</strong>.</li>
              <li>Set the name to <code className="rounded bg-muted px-1.5 py-0.5 text-xs">DATABASE_URL</code>.</li>
              <li>Paste your Supabase connection string as the value, then add <code className="rounded bg-muted px-1.5 py-0.5 text-xs">?pgbouncer=true</code> at the very end.</li>
              <li>Save it, then <strong>Redeploy</strong> your project.</li>
            </ol>
            <button onClick={copyEnvLine} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-mono text-foreground/70 hover:bg-muted">
              {copied ? <><Check className="h-3 w-3 text-primary" /> Copied</> : <><Copy className="h-3 w-3" /> DATABASE_URL=...?pgbouncer=true</>}
            </button>
          </section>

          {/* Step 4: Check + seed */}
          <section className="mt-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span>
              <h2 className="text-base font-semibold text-foreground">Check connection & seed the data</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">After redeploying with your <code className="rounded bg-muted px-1.5 py-0.5 text-xs">DATABASE_URL</code> set, come back here and click the button below.</p>

            {/* status */}
            <div className="mt-4">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Checking database...</div>
              ) : status?.connected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" /> Database connected.
                  </div>
                  {status.seeded ? (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" /> Already seeded: {status.counts?.agents} agents, {status.counts?.properties} properties, {status.counts?.leads} leads.
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                      <AlertCircle className="h-4 w-4" /> Connected but not seeded yet. Click the button below.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {status?.error || "Cannot connect to the database."}
                  </div>
                  <p className="text-xs text-muted-foreground">Make sure you've set <code className="rounded bg-muted px-1">DATABASE_URL</code> on Vercel and redeployed. The connection string must end with <code className="rounded bg-muted px-1">?pgbouncer=true</code>.</p>
                </div>
              )}
            </div>

            {/* actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={check} variant="outline" size="sm" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Re-check
              </Button>
              {status?.connected && !status?.seeded && (
                <Button onClick={seed} size="sm" disabled={seeding} className="gap-1.5">
                  {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                  {seeding ? "Seeding..." : "Seed the database"}
                </Button>
              )}
              {status?.seeded && (
                <Button asChild size="sm" className="gap-1.5">
                  <a href="/">View the live site <ArrowRight className="h-4 w-4" /></a>
                </Button>
              )}
            </div>

            {seedResult && (
              <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                <CheckCircle2 className="mr-1.5 inline h-4 w-4" /> {seedResult}
              </div>
            )}
            {error && (
              <div className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mr-1.5 inline h-4 w-4" /> {error}
              </div>
            )}
          </section>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            This setup page is a demo convenience. In production you'd run <code className="rounded bg-muted px-1">prisma db push</code> and the seed from your CI pipeline.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

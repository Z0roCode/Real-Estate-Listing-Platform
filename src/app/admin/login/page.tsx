"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Building2, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-secondary/30"><div className="h-8 w-8 animate-pulse rounded-full bg-muted" /></div>}>
      <AdminLoginForm />
    </Suspense>
  )
}

function AdminLoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const notConfigured = params.get("error") === "not_configured"

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")
      router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold text-foreground">Admin access</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter the admin password to continue.</p>
          </div>

          {notConfigured && (
            <div className="mt-5 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Admin access is not configured. Set <code className="font-mono">ADMIN_SECRET</code> in your environment variables to enable login.</span>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-9"
                  autoFocus
                  required
                />
              </div>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            )}

            <Button type="submit" className="w-full gap-2" disabled={loading || !password}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Protected by middleware. <a href="/" className="hover:text-foreground">← Back to site</a>
        </p>
      </motion.div>
    </div>
  )
}

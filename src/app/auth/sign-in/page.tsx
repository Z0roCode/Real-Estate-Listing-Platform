"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, LogIn, Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModal } from "@/lib/modal-store"

export default function SignInPage() {
  const router = useRouter()
  const { openSignup } = useModal()
  const [loading, setLoading] = useState(false)

  const demoSignIn = async () => {
    setLoading(true)
    await fetch("/api/auth/demo", { method: "POST" })
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Building2 className="h-6 w-6" /></span>
              <h1 className="mt-4 text-2xl font-bold text-foreground">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your Z0roCode dashboard.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); demoSignIn() }} className="mt-6 space-y-4">
              <div className="space-y-1.5"><Label className="text-sm font-medium">Email</Label><Input type="email" placeholder="you@example.com" required /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Password</Label><Input type="password" placeholder="••••••••" required /></div>
              <Button type="submit" className="w-full gap-2"><LogIn className="h-4 w-4" /> Sign in</Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" /></div>

            <Button variant="secondary" className="w-full gap-2" onClick={demoSignIn} disabled={loading}>
              <Sparkles className="h-4 w-4" /> {loading ? "Signing in…" : "Explore as demo user"}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Instant access. No account needed. For portfolio review.</p>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <button onClick={() => openSignup()} className="font-semibold text-primary hover:underline">Create an account</button>
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">← Back to home</Link>
          </p>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  )
}

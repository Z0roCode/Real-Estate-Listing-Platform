"use client"

import Link from "next/link"
import { Building2, ArrowRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

export default function SignUpPage() {
  const { openSignup } = useModal()
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Building2 className="h-6 w-6" /></span>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Join Z0roCode</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tell us what you&apos;re looking for and we&apos;ll match you with the right agent.</p>
          <Button className="mt-6 w-full gap-2" onClick={() => openSignup()}>Get started <ArrowRight className="h-4 w-4" /></Button>
          <Button variant="secondary" className="mt-3 w-full gap-2" onClick={() => { fetch("/api/auth/demo", { method: "POST" }).then(() => router.push("/dashboard")) }}>
            <Sparkles className="h-4 w-4" /> Explore as demo user
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

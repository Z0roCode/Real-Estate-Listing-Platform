"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronLeft, Clock, Calendar } from "lucide-react"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"
import { StructuredData, articleSchema, breadcrumbSchema } from "@/lib/schema"
import { ARTICLES, ARTICLE_IMG } from "@/app/insights/page"

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("")
  useEffect(() => { params.then((p) => setSlug(p.slug)) }, [params])
  if (!slug) return null
  return <Article slug={slug} />
}

function Article({ slug }: { slug: string }) {
  const router = useRouter()
  const { openBooking } = useModal()
  const article = ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold">Article not found.</h1>
          <Button asChild className="mt-6"><Link href="/insights">All insights</Link></Button>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const related = ARTICLES.filter((a) => a.slug !== slug).slice(0, 2)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StructuredData data={[
        articleSchema({ title: article.title, description: article.excerpt, date: article.date, slug: article.slug }),
        breadcrumbSchema([
          { name: "Home", url: "https://z0rocode.com" },
          { name: "Insights", url: "https://z0rocode.com/insights" },
          { name: article.title, url: `https://z0rocode.com/insights/${article.slug}` },
        ]),
      ]} />
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/60 bg-secondary/30">
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 text-sm text-muted-foreground sm:px-6">
            <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
            <Link href="/insights" className="hover:text-foreground">Insights</Link><span>/</span>
            <span className="truncate text-foreground">{article.title}</span>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <span className="inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{article.tag}</span>
          <h1 className="text-display mt-4 text-foreground">{article.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{article.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{article.read}</span>
            <span>By Z0roCode Insights</span>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <img src={ARTICLE_IMG(slug)} alt={article.title} className="aspect-[16/9] w-full object-cover" fetchPriority="high" />
          </div>

          <div className="mt-8 space-y-5">
            {article.body.map((p, i) => (
              <p key={i} className="text-[17px] leading-[1.75] text-foreground/85">{p}</p>
            ))}
          </div>

          {/* inline CTA */}
          <div className="my-10 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:p-8">
            <h3 className="text-lg font-semibold text-foreground">Have a question about this?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Book a free consultation. We&apos;ll talk it through.</p>
            <Button className="mt-4 gap-2" onClick={() => openBooking()}>Book a consultation <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </article>

        {/* related */}
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-foreground">Keep reading</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {related.map((a) => (
                <Link key={a.slug} href={`/insights/${a.slug}`} className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  <span className="inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{a.tag}</span>
                  <h3 className="mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-primary">{a.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

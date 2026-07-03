"use client"

import Link from "next/link"
import { ArrowRight, Clock, Search } from "lucide-react"
import { useState } from "react"
import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { useModal } from "@/lib/modal-store"

export const ARTICLES = [
  { slug: "what-800k-buys-in-austin", tag: "Market", title: "What $800K buys in Austin right now", excerpt: "A neighborhood-by-neighborhood tour of what your money gets in Austin this season, from Barton Hills to Mueller.", read: "6 min read", date: "Jun 2026", featured: true,
    body: [
      "Eight hundred thousand dollars used to buy you a big house with a yard in central Austin. That number has moved, but it still buys you a genuinely good life here — if you know where to look.",
      "In Barton Hills and Zilker, $800K gets you a three-bedroom cottage on a quiet street, walking distance to the greenbelt. You will give up square footage and the kitchen may need work, but you gain a neighborhood that holds its value and a ten-minute ride downtown.",
      "Head east to Mueller and the same budget buys newer construction, a two-car garage, and a community pool out your front door. The trade-off is a smaller lot and a longer drive to the trails.",
      "In 78748, south of Ben White, you can still find four-bedroom homes under $800K built in the last ten years. The schools are strong and the commute is real, but for a growing family it is hard to beat.",
      "The pattern across all three: the homes that sell fast are the ones priced honestly and photographed well. The ones that sit are the ones chasing a number from 2022. If you are buying in this range, bring patience and a good agent. The right home shows up every week.",
    ] },
  { slug: "three-things-that-sell-a-home", tag: "Selling", title: "The 3 things that actually sell a home in 2025", excerpt: "Forget the fluff. These three moves move listings, and we have the data to prove it.", read: "5 min read", date: "May 2026",
    body: [
      "There is a lot of advice online about selling a home. Most of it is noise. After selling four hundred plus homes, we have narrowed it down to three things that actually move the needle.",
      "First, price it right the day it lists. The first two weeks are when the most buyers see your home. If you start high and reduce, you have trained buyers to wait. Price it at the number it should sell for and you create urgency.",
      "Second, photograph it like it matters, because it does. Over ninety percent of buyers see your home online before they ever tour it. Professional photography, shot in the right light, with the right staging, is the single best return on investment in a sale.",
      "Third, respond to every showing request within an hour. Buyers move on fast. A delayed response signals a difficult seller and kills momentum. We staff every listing so inquiries get answered in real time.",
      "Do these three and you will outperform the market. Skip them and you will join the listings that sit for sixty days and sell below ask.",
    ] },
  { slug: "mortgage-rates-explained", tag: "Finance", title: "Mortgage rates just moved. Here's what it means for you.", excerpt: "A plain-English breakdown of the latest rate change and how it shifts your monthly payment.", read: "4 min read", date: "May 2026",
    body: [
      "Mortgage rates moved again this month, and if you are house hunting, you have probably felt the whiplash. Here is what actually changed and what it means for your monthly payment.",
      "A half-percent rate change sounds small, but on a $600,000 loan it shifts your monthly payment by roughly $200. Over thirty years that is more than $70,000. The number matters.",
      "If you are buying, this is not a reason to wait. Rates and prices often move in opposite directions — when rates rise, buyer demand softens, and sellers get more flexible. You may pay a bit more in interest but less for the home.",
      "If you already own and your rate is above seven percent, a refinance conversation makes sense once rates dip below six and a half. Run the numbers with a lender before locking in.",
      "The bottom line: do not try to time the market perfectly. Buy the home you can afford at today's rate, and refinance if the math works later. The home you love today will not wait.",
    ] },
  { slug: "first-time-buyer-guide", tag: "Guide", title: "A calm guide for first-time buyers", excerpt: "If the process feels overwhelming, start here. Every step, in plain English.", read: "8 min read", date: "Apr 2026",
    body: [
      "Buying your first home is the biggest financial decision most people ever make. It is normal to feel overwhelmed. This guide breaks it into steps you can actually follow.",
      "Step one is not house hunting. It is getting pre-approved. A lender looks at your income, debt, and savings, and gives you a letter saying how much they will lend. This letter is your budget, and sellers will not take an offer without it.",
      "Step two is making a wants-versus-needs list. Needs are the things you cannot change — location, school district, number of bedrooms. Wants are things you can change — paint, floors, the kitchen. Know the difference before you tour.",
      "Step three is touring with your agent. You will see homes online and want to book ten tours. Resist. Tour five that actually fit your needs. Your agent will flag the things you would miss — the roof age, the lot slope, the noise.",
      "Step four is making an offer. Your agent pulls recent sales to justify your number, and you decide whether to go in strong or negotiate. There is no single right answer, but there is a right answer for the home in front of you.",
      "Step five is inspection and closing. The inspection is your safety net — it finds the expensive problems. Closing is paperwork and keys. Your agent handles the deadlines so you do not have to stress.",
      "The whole process takes thirty to sixty days once you are under contract. The right agent makes it feel calm. That is the whole job.",
    ] },
  { slug: "how-we-price-a-home", tag: "Behind the scenes", title: "How we price a home (and why it matters)", excerpt: "A look behind the curtain at the comps, condition, and conversations that set a number.", read: "5 min read", date: "Apr 2026",
    body: [
      "Pricing a home is the most important decision a seller makes, and it is the one we spend the most time on. Here is how we actually do it.",
      "We start with comps — recent sales of similar homes within half a mile, ideally in the last ninety days. These tell us what buyers have actually paid, not what they are asking. We adjust for square footage, lot size, beds, baths, and condition.",
      "Then we look at the current competition — the homes a buyer would tour instead of yours. If there are three similar homes listed above your target, you have room. If there are none, you may have to wait.",
      "Condition is the part no algorithm can see. A new roof, a renovated kitchen, a finished basement — these move the number. We walk the home with the seller and honestly assess what helps and what hurts.",
      "Finally, we have a conversation with the seller about their goals. A fast sale and a top-dollar sale are sometimes different numbers. We lay out the trade-offs and let the seller choose.",
      "The result is a number with a story behind it. That story is what gets a home sold.",
    ] },
  { slug: "investor-playbook-2026", tag: "Investing", title: "The investor's playbook for 2026", excerpt: "Where the numbers still pencil, what to avoid, and how to model a deal before you bid.", read: "7 min read", date: "Mar 2026",
    body: [
      "Investing in real estate in 2026 is not about finding the next hot market. It is about discipline. Here is how we help investors model deals that actually work.",
      "Start with the rent. Not the best-case rent, the realistic rent. Pull comps from the last six months, not the listings still sitting. A home that rents for $2,400 and costs $2,600 to carry is a bad deal no matter how you frame it.",
      "Model all the costs, not just the mortgage. Property taxes, insurance, maintenance, vacancy, management — these add up to thirty to forty percent of gross rent. Skip them and you are lying to yourself.",
      "Price appreciation is a bonus, not a strategy. If the deal does not cash flow today, do not buy it hoping the market bails you out. The market has been bailing people out for a decade and that ride is getting slower.",
      "The deals that still work are the boring ones — solid neighborhoods, three-bedroom homes, rents that cover costs with a small margin. You will not get rich on one. You will build wealth on five, held for fifteen years.",
      "If you want a second set of eyes on a deal, bring it to us. We will run the numbers honestly, even if the answer is walk away.",
    ] },
]

export default function InsightsPage() {
  const { showToast } = useModal()
  const [q, setQ] = useState("")
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const filtered = ARTICLES.filter((a) => !q || (a.title + a.excerpt + a.tag).toLowerCase().includes(q.toLowerCase()))
  const featured = filtered.find((a) => a.featured) ?? filtered[0]
  const rest = filtered.filter((a) => a.slug !== featured?.slug)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@")) return
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "insights", intent: "newsletter" }) }).catch(() => {})
    setDone(true); showToast("You're on the list", "Sunday market notes start this week.")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
          <p className="eyebrow">Market insights</p>
          <h1 className="text-display mt-3 text-foreground">Market insights, plain English.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Short, useful reads on buying, selling, and the market. No jargon, no fluff.
          </p>
          <div className="mt-6 relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          {featured && (
            <Link href={`/insights/${featured.slug}`} className="group mb-10 grid overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:shadow-card-hover lg:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:aspect-auto">
                <img src={ARTICLE_IMG(featured.slug)} alt={featured.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                <span className="inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{featured.tag} · Featured</span>
                <h2 className="mt-3 text-2xl font-bold leading-snug text-foreground group-hover:text-primary">{featured.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground"><span>{featured.date}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.read}</span></div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <Link key={a.slug} href={`/insights/${a.slug}`} className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <span className="inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{a.tag}</span>
                <h3 className="mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-primary">{a.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground"><span>{a.date}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.read}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* newsletter */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:p-8">
            <div><h2 className="text-lg font-semibold text-foreground">Get the weekly market note.</h2><p className="mt-1 text-sm text-muted-foreground">One email, every Sunday. No spam.</p></div>
            <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <Button type="submit" className="gap-1.5">{done ? "Subscribed" : "Subscribe"}</Button>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export function ARTICLE_IMG(slug: string): string {
  const map: Record<string, string> = {
    "what-800k-buys-in-austin": "https://sfile.chatglm.cn/images-ppt/fb823fa5177b.jpg",
    "three-things-that-sell-a-home": "https://sfile.chatglm.cn/images-ppt/881392c04080.jpg",
    "mortgage-rates-explained": "https://sfile.chatglm.cn/images-ppt/8a597f80cd5c.jpg",
    "first-time-buyer-guide": "https://sfile.chatglm.cn/images-ppt/51ff1eb439c0.jpg",
    "how-we-price-a-home": "https://sfile.chatglm.cn/images-ppt/d3f9a730f839.jpg",
    "investor-playbook-2026": "https://sfile.chatglm.cn/images-ppt/931d33bb6e17.jpg",
  }
  return map[slug] ?? "https://sfile.chatglm.cn/images-ppt/7ab5b5e64dbe.jpg"
}

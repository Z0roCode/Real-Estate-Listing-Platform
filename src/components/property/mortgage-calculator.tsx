"use client"

import { useMemo, useState } from "react"
import { Calculator, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency, formatNumber } from "@/lib/helpers"

interface MortgageCalculatorProps {
  homePrice: number
}

/**
 * Mortgage calculator.
 *
 * The standard amortization formula for a fixed-rate mortgage:
 *
 *                  r
 *   M = P · ----------------
 *            1 - (1 + r)^-n
 *
 * where
 *   P = loan principal (home price − down payment)
 *   r = monthly interest rate (annual rate / 12 / 100)
 *   n = total number of monthly payments (loan term in years × 12)
 *
 * NOTE (see README "Known Limitations"): this estimate does NOT include
 * property taxes, homeowners insurance, PMI, or HOA dues — it is the
 * principal + interest portion only, which is what most listing calculators
 * show by default.
 */
export function MortgageCalculator({ homePrice }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(homePrice)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(6.75)
  const [termYears, setTermYears] = useState(30)

  const { monthly, principal, downPayment, totalPaid, totalInterest } = useMemo(() => {
    const downPayment = (price * downPct) / 100
    const principal = price - downPayment
    const r = rate / 100 / 12 // monthly rate
    const n = termYears * 12 // total payments

    let monthly = 0
    if (principal > 0 && n > 0) {
      if (r === 0) {
        // Interest-free edge case: just divide evenly
        monthly = principal / n
      } else {
        monthly =
          (principal * r) / (1 - Math.pow(1 + r, -n))
      }
    }

    const totalPaid = monthly * n
    const totalInterest = totalPaid - principal

    return {
      monthly,
      principal,
      downPayment,
      totalPaid,
      totalInterest,
    }
  }, [price, downPct, rate, termYears])

  // Pie-style split for the visual breakdown
  const interestPct =
    totalPaid > 0 ? Math.round((totalInterest / totalPaid) * 100) : 0
  const principalPct = 100 - interestPct

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Mortgage calculator
          </h3>
          <p className="text-xs text-muted-foreground">
            Principal &amp; interest only — excludes taxes &amp; insurance
          </p>
        </div>
      </div>

      {/* Monthly payment headline */}
      <div className="mt-5 rounded-lg bg-primary/5 px-4 py-4 ring-1 ring-inset ring-primary/15">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Estimated monthly payment
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-primary">
          {formatCurrency(Math.round(monthly))}
          <span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span>
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        {/* Home price */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="mc-price" className="text-sm font-medium">
              Home price
            </Label>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(price)}
            </span>
          </div>
          <div className="relative mt-2">
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="mc-price"
              type="number"
              value={price}
              min={0}
              step={1000}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
              className="pl-9"
            />
          </div>
        </div>

        {/* Down payment % */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Down payment</Label>
            <span className="text-sm font-semibold text-foreground">
              {downPct}% · {formatCurrency(Math.round(downPayment))}
            </span>
          </div>
          <Slider
            value={[downPct]}
            min={0}
            max={50}
            step={1}
            onValueChange={(v) => setDownPct(v[0])}
            className="mt-3"
            aria-label="Down payment percentage"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Interest rate + term */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mc-rate" className="text-sm font-medium">
              Interest rate
            </Label>
            <div className="relative mt-2">
              <Input
                id="mc-rate"
                type="number"
                value={rate}
                min={0}
                max={15}
                step={0.05}
                onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                className="pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>
          <div>
            <Label htmlFor="mc-term" className="text-sm font-medium">
              Loan term
            </Label>
            <div className="relative mt-2">
              <Input
                id="mc-term"
                type="number"
                value={termYears}
                min={5}
                max={40}
                step={5}
                onChange={(e) => setTermYears(Math.max(1, Number(e.target.value)))}
                className="pr-12"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                yrs
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-1 space-y-3 border-t border-border/70 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Loan amount</span>
            <span className="font-medium text-foreground">
              {formatCurrency(Math.round(principal))}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total interest paid</span>
            <span className="font-medium text-foreground">
              {formatCurrency(Math.round(totalInterest))}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total of {termYears * 12} payments</span>
            <span className="font-medium text-foreground">
              {formatCurrency(Math.round(totalPaid))}
            </span>
          </div>

          {/* Principal vs interest bar */}
          <div className="pt-1">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${principalPct}%` }}
                title={`Principal ${principalPct}%`}
              />
              <div
                className="h-full bg-primary/30"
                style={{ width: `${interestPct}%` }}
                title={`Interest ${interestPct}%`}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Principal {principalPct}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary/30" />
                Interest {interestPct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

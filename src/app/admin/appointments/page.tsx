"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, Video, Phone, Building, ChevronLeft, ChevronRight } from "lucide-react"
import { AdminShell } from "@/components/layout/admin-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { prettyDate, prettyTime } from "@/lib/helpers"

interface Appt {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  type: string
  status: string
  notes: string | null
}

const TYPE_ICON: Record<string, any> = { video: Video, phone: Phone, office: Building }

export default function AdminAppointmentsPage() {
  const [appts, setAppts] = useState<Appt[]>([])
  const [loading, setLoading] = useState(true)
  const [monthOffset, setMonthOffset] = useState(0)

  useEffect(() => {
    fetch("/api/admin/appointments").then((r) => r.json()).then((d) => { setAppts(d.appointments ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const now = new Date()
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const apptsByDate: Record<string, Appt[]> = {}
  appts.forEach((a) => {
    if (!apptsByDate[a.date]) apptsByDate[a.date] = []
    apptsByDate[a.date].push(a)
  })

  const upcoming = appts
    .filter((a) => new Date(a.date + "T" + a.time) >= new Date())
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 8)

  return (
    <AdminShell title="Appointments" subtitle="Your consultation and viewing calendar.">
      {loading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* calendar */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{monthName}</h2>
              <div className="flex gap-1">
                <button onClick={() => setMonthOffset((m) => m - 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setMonthOffset(0)} className="rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted">Today</button>
                <button onClick={() => setMonthOffset((m) => m + 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-muted-foreground">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                const dayAppts = apptsByDate[iso] ?? []
                const isToday = iso === now.toISOString().slice(0, 10)
                return (
                  <div key={day} className={`min-h-[64px] rounded-lg border p-1.5 ${isToday ? "border-primary bg-primary/5" : "border-border/60"}`}>
                    <p className={`text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</p>
                    {dayAppts.slice(0, 2).map((a) => {
                      const Icon = TYPE_ICON[a.type] ?? Clock
                      return (
                        <div key={a.id} className="mt-1 flex items-center gap-1 rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary">
                          <Icon className="h-2.5 w-2.5" /> {prettyTime(a.time).replace(":00", "")}
                        </div>
                      )
                    })}
                    {dayAppts.length > 2 && <p className="mt-0.5 text-[10px] text-muted-foreground">+{dayAppts.length - 2} more</p>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* upcoming list */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">Upcoming</h2>
            <div className="mt-3 space-y-2">
              {upcoming.map((a) => {
                const Icon = TYPE_ICON[a.type] ?? Clock
                return (
                  <div key={a.id} className="rounded-lg border border-border/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><Icon className="h-4 w-4 text-primary" />{prettyDate(a.date)}</span>
                      <span className="text-xs text-muted-foreground">{prettyTime(a.time)}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{a.type} consultation · {a.phone}</p>
                  </div>
                )
              })}
              {upcoming.length === 0 && (
                <div className="flex flex-col items-center py-8 text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">No upcoming appointments.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

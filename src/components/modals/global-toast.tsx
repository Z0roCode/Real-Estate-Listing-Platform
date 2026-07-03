"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, X } from "lucide-react"
import { useModal } from "@/lib/modal-store"

export function GlobalToast() {
  const { toast, clearToast } = useModal()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 3800)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 16, x: "-50%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-20 left-1/2 z-[110] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-modal sm:bottom-6"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{toast.title}</p>
            {toast.description && <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>}
          </div>
          <button onClick={clearToast} className="text-muted-foreground hover:text-foreground" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

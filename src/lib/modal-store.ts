"use client"

import { create } from "zustand"

/**
 * Global modal + UI store.
 *
 * One store controls the booking, onboarding and list-a-property modals so any
 * button anywhere on the site can open them with the right context. This is
 * what makes every CTA actually do something instead of scrolling.
 */

export type ModalKind = "booking" | "signup" | "list-property" | null

interface ModalState {
  active: ModalKind
  /** Context for the booking modal — e.g. scoped to a property. */
  bookingContext: {
    propertyId?: string
    propertyTitle?: string
    defaultType?: "video" | "phone" | "office"
  }
  /** Context for signup — e.g. triggered from "save this home". */
  signupContext: {
    intent?: "buying" | "selling"
    pendingSavePropertyId?: string
  }
  /** Saved property ids for the current session (lightweight, no auth needed). */
  savedIds: string[]
  toast: { title: string; description?: string } | null

  openBooking: (ctx?: ModalState["bookingContext"]) => void
  openSignup: (ctx?: ModalState["signupContext"]) => void
  openListProperty: () => void
  close: () => void

  toggleSave: (id: string) => void
  isSaved: (id: string) => boolean

  showToast: (title: string, description?: string) => void
  clearToast: () => void
}

export const useModal = create<ModalState>((set, get) => ({
  active: null,
  bookingContext: {},
  signupContext: {},
  savedIds: [],
  toast: null,

  openBooking: (ctx) =>
    set({ active: "booking", bookingContext: ctx ?? {} }),
  openSignup: (ctx) =>
    set({ active: "signup", signupContext: ctx ?? {} }),
  openListProperty: () => set({ active: "list-property" }),
  close: () => set({ active: null }),

  toggleSave: (id) => {
    const { savedIds, showToast } = get()
    const isSaved = savedIds.includes(id)
    if (isSaved) {
      set({ savedIds: savedIds.filter((x) => x !== id) })
      showToast("Removed from saved", "You can save it again anytime.")
    } else {
      set({ savedIds: [...savedIds, id] })
      showToast("Saved to your dashboard", "Find it anytime under Saved.")
    }
  },
  isSaved: (id) => get().savedIds.includes(id),

  showToast: (title, description) =>
    set({ toast: { title, description } }),
  clearToast: () => set({ toast: null }),
}))

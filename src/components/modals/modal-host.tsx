"use client"

import { BookingModal } from "@/components/modals/booking-modal"
import { SignupModal } from "@/components/modals/signup-modal"
import { ListPropertyModal } from "@/components/modals/list-property-modal"
import { GlobalToast } from "@/components/modals/global-toast"

/** Mounts all global modals + toast once, near the root. */
export function ModalHost() {
  return (
    <>
      <BookingModal />
      <SignupModal />
      <ListPropertyModal />
      <GlobalToast />
    </>
  )
}

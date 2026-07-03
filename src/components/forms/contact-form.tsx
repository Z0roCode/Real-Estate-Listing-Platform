"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const schema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  message: z.string().min(10, "Tell us a little about what you're looking for."),
})

type FormValues = z.infer<typeof schema>

interface ContactFormProps {
  propertyId: string
  propertyAddress: string
}

export function ContactForm({ propertyId, propertyAddress }: ContactFormProps) {
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: `I'm interested in ${propertyAddress}. Could you share more details and availability for a tour?`,
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          propertyId,
          source: "contact",
          intent: "buying",
          message: `Property inquiry for ${propertyAddress}: ${values.message}`,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? "Something went wrong")
      }
      setSubmitted(true)
      toast({
        title: "Inquiry sent",
        description: "An agent will reach out within one business day.",
      })
    } catch (err) {
      toast({
        title: "Could not send inquiry",
        description:
          err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      })
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Thank you — we&apos;ve got it.
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Your inquiry about {propertyAddress} has been logged. A Z0roCode agent
          will contact you shortly at the email you provided.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-border bg-card p-5 sm:p-6"
      noValidate
    >
      <h3 className="text-base font-semibold text-foreground">
        Contact the agent
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Schedule a tour or ask a question about this home.
      </p>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cf-name" className="text-sm font-medium">
              Full name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cf-name"
              autoComplete="name"
              placeholder="Jane Doe"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cf-email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cf-email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cf-phone" className="text-sm font-medium">
            Phone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 555-0100"
            {...register("phone")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cf-message" className="text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="cf-message"
            rows={4}
            className="resize-none"
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          {errors.message && (
            <p className="text-xs text-destructive">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send inquiry
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          By submitting, you agree to be contacted about this property. We never
          share your information.
        </p>
      </div>
    </form>
  )
}

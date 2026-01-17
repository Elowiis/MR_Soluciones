"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]"
      )}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border bg-background p-6 pr-8 shadow-lg transition-all animate-in slide-in-from-bottom-4",
            toast.open === false && "animate-out fade-out-80 slide-out-to-right-full",
            toast.className
          )}
        >
          <div className="grid gap-1 flex-1">
            {toast.title && (
              <div className="text-sm font-semibold text-foreground">
                {toast.title}
              </div>
            )}
            {toast.description && (
              <div className="text-sm text-muted-foreground opacity-90">
                {toast.description}
              </div>
            )}
          </div>
          {toast.action && (
            <div className="flex-shrink-0">
              {toast.action}
            </div>
          )}
          <button
            onClick={() => dismiss(toast.id)}
            className={cn(
              "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
              "hover:bg-accent"
            )}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}


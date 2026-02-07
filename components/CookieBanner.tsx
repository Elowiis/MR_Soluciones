"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Verificar si ya hay una preferencia guardada
    if (typeof window !== "undefined") {
      const cookiesAccepted = localStorage.getItem("cookies-accepted")
      // Solo mostrar el banner si no hay preferencia guardada
      if (cookiesAccepted === null) {
        setShowBanner(true)
      }
    }
  }, [])

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookies-accepted", "true")
      setShowBanner(false)
    }
  }

  const handleReject = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookies-accepted", "false")
      setShowBanner(false)
    }
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white z-50 shadow-2xl border-t border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm sm:text-base leading-relaxed">
                  Utilizamos cookies propias y de terceros para mejorar tu experiencia. Puedes aceptar todas las cookies o configurar tus preferencias.{" "}
                  <Link
                    href="/legal/politica-cookies"
                    className="underline hover:text-gray-300 transition-colors font-medium"
                  >
                    Política de Cookies
                  </Link>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white hover:border-gray-600 w-full sm:w-auto min-h-[44px]"
                >
                  Rechazar
                </Button>
                <Button
                  onClick={handleAccept}
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-h-[44px]"
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

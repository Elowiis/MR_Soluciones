'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowRight, Sparkles, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PropertySearch } from "@/components/PropertySearch"

// Imágenes con posición personalizada para cada una
const heroImages = [
  { src: '/castillo.jpg', position: 'object-[center_40%]' },
  { src: '/clubnautico.jpg', position: 'object-center' },
  { src: '/iglesia_encina.jpg', position: 'object-[center_35%]' },
  { src: '/castillo2.jpg', position: 'object-[center_40%]' },
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Cambio automático de imágenes cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const scrollToForm = () => {
    const element = document.getElementById("lead-form")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToProperties = () => {
    const element = document.getElementById("featured-properties")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <>
      {/* Hero Section - Con pt para compensar navbar fixed */}
      <section className="relative min-h-[100svh] h-[100svh] md:h-[80vh] lg:h-[90vh] lg:min-h-[700px] max-h-[900px] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-12 sm:pb-20 md:pb-24 overflow-hidden">
        {/* Carrusel de imágenes de fondo */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.07 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1 },
                // Ken Burns: zoom lento durante los 8s que dura cada imagen
                scale: { duration: 9, ease: 'linear' },
              }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[currentImageIndex].src}
                alt={`Imagen de fondo ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                priority={currentImageIndex === 0}
                className={`object-cover ${heroImages[currentImageIndex].position}`}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Overlay con gradiente para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10"></div>

        {/* Contenido del Hero */}
        <div className="relative max-w-5xl mx-auto text-center text-white z-20 w-full flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4">
          {/* Badge animado - con margen superior extra para no cortarse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-2 sm:mb-4 md:mb-6"
          >
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-300" />
            <span className="text-xs sm:text-sm font-medium">El Bierzo, León</span>
            <span className="hidden min-[420px]:inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/40" aria-hidden="true" />
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="text-xs sm:text-sm font-medium">Tu hogar, nuestra misión</span>
            </span>
          </motion.div>

          {/* Título principal con animación */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4 text-balance leading-tight px-2"
          >
            Encuentra tu{" "}
            <span className="bg-gradient-to-r from-green-200 via-emerald-200 to-green-300 bg-clip-text text-transparent">
              propiedad ideal
            </span>
          </motion.h1>

          {/* Subtítulo con animación */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-3 sm:mb-5 md:mb-6 text-balance opacity-90 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Conectamos personas con las mejores oportunidades inmobiliarias
          </motion.p>

          {/* Buscador de propiedades */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-3 sm:mb-5 md:mb-6 px-2 w-full"
          >
            <PropertySearch />
          </motion.div>

          {/* Botones con animación */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center w-full px-4 max-w-md sm:max-w-none mx-auto"
          >
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-white text-green-900 hover:bg-green-50 px-10 sm:px-12 md:px-14 py-5 sm:py-6 md:py-7 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group w-full sm:w-auto min-h-[64px] sm:min-h-[72px] flex flex-col items-center justify-center leading-tight gap-1.5"
            >
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center whitespace-nowrap">
                ¿Vendes un inmueble?
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-sm sm:text-base md:text-lg font-medium text-green-700 whitespace-nowrap">
                Solicita una valoración
              </span>
            </Button>
            
            <Button
              onClick={scrollToProperties}
              size="lg"
              variant="outline"
              className="bg-white/5 border-2 border-white/30 text-white hover:bg-white/15 hover:border-white/60 text-xs sm:text-sm md:text-base lg:text-lg px-5 sm:px-7 md:px-9 py-2 sm:py-3 md:py-4 lg:py-6 rounded-full font-semibold backdrop-blur-sm transition-all duration-300 w-full sm:w-auto min-h-[40px] sm:min-h-[44px]"
            >
              Conoce nuestras propiedades
            </Button>
          </motion.div>

        </div>

        {/* Indicadores del carrusel - posicionados más arriba en móvil */}
        <div className="absolute bottom-20 sm:bottom-16 md:bottom-12 lg:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                index === currentImageIndex
                  ? 'w-6 sm:w-8 bg-white'
                  : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/573000000000"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-2xl transition-all z-50 min-w-[56px] min-h-[56px] flex items-center justify-center"
        title="Contáctanos por WhatsApp"
        aria-label="Contáctanos por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </motion.a>
    </>
  )
}
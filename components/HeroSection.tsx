'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PropertySearch } from "@/components/PropertySearch"

const heroImages = [
  '/castillo.jpg',
  '/clubnautico.jpg',
  '/iglesia_encina.jpg',
  '/castillo2.jpg',
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
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-12 md:pb-16 overflow-hidden">
        {/* Carrusel de imágenes de fondo */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[currentImageIndex]}
                alt={`Imagen de fondo ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                priority={currentImageIndex === 0}
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Overlay oscuro semi-transparente */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Contenido del Hero */}
        <div className="relative max-w-5xl mx-auto text-center text-white z-20">
          {/* Badge animado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Tu hogar, nuestra misión</span>
          </motion.div>

          {/* Título principal con animación */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 text-balance leading-tight px-2"
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
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-balance opacity-90 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Conectamos compradores, vendedores e inversores con las mejores oportunidades inmobiliarias
          </motion.p>

          {/* Buscador de propiedades */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-6 md:mb-8 px-2"
          >
            <PropertySearch />
          </motion.div>

          {/* Botones con animación */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full px-4"
          >
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-white text-green-900 hover:bg-green-50 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 md:py-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group w-full sm:w-auto min-h-[44px]"
            >
              Encuentra tu propiedad ideal
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={scrollToProperties}
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 md:py-6 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 w-full sm:w-auto min-h-[44px]"
            >
              Conoce nuestras propiedades
            </Button>
          </motion.div>

          {/* Stats con animación */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 mt-8 sm:mt-12 md:mt-16 max-w-2xl mx-auto px-4"
          >
          </motion.div>
        </div>

        {/* Indicadores del carrusel */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentImageIndex
                  ? 'w-3 h-3 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
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
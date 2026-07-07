"use client"

import { motion } from "framer-motion"
import { MapPin, Handshake, FileCheck2, MessageCircle } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: MapPin,
      title: "Conocemos El Bierzo",
      description:
        "Trabajamos en Ponferrada y los pueblos de la comarca. Sabemos lo que se paga en cada zona porque es donde vivimos.",
    },
    {
      icon: Handshake,
      title: "Trato directo",
      description:
        "Hablas siempre con la misma persona, sin centralitas ni vueltas. Te contamos las cosas como son, también cuando no es lo que quieres oír.",
    },
    {
      icon: FileCheck2,
      title: "Papeleo sin dolores de cabeza",
      description:
        "Nota simple, contratos, notaría... revisamos que todo esté en regla antes de firmar para que no te lleves sorpresas.",
    },
    {
      icon: MessageCircle,
      title: "Sin prisas ni presión",
      description:
        "Preferimos que encuentres la casa que te encaja a cerrar rápido una operación. Si algo no te conviene, te lo decimos.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>

      {/* Decorative Blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            Nuestra forma de trabajar
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Cercanía, claridad y conocimiento de la zona. Así entendemos este trabajo.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 border border-gray-100 hover:border-green-600/20"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-2xl mb-4 transition-colors duration-300 group-hover:bg-green-100">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-700" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-[15px]">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { Quote, Star, User } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      nombre: "Juan García",
      texto: "Excelente servicio, muy profesionales. Vendimos nuestro apartamento en menos de 2 meses. El equipo estuvo presente en cada paso del proceso.",
      cargo: "Vendedor",
      rating: 5,
      propiedad: "Apartamento en Zona Norte"
    },
    {
      nombre: "María López",
      texto: "Encontramos la casa de nuestros sueños gracias a su equipo. Totalmente recomendados. La atención personalizada fue excepcional.",
      cargo: "Compradora",
      rating: 5,
      propiedad: "Casa en Zona Centro"
    },
    {
      nombre: "Carlos Rodríguez",
      texto: "Proceso transparente y rápido. El mejor portafolio de propiedades que he visto. Sin duda volveré a trabajar con ellos.",
      cargo: "Inversor",
      rating: 5,
      propiedad: "Oficina en Centro Comercial"
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              💚 Testimonios
            </span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Miles de personas han encontrado su hogar ideal con nosotros
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-sm sm:text-base text-gray-700 italic mb-4 sm:mb-6 leading-relaxed">
                "{testimonial.texto}"
              </p>

              {/* Property Tag */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  {testimonial.propiedad}
                </span>
              </div>

              {/* Client Info - Sin imagen */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center ring-4 ring-green-50">
                    <User className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.nombre}</p>
                  <p className="text-sm text-gray-500">{testimonial.cargo}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-gray-200"
        >
          {[
            { value: "400+", label: "Clientes Satisfechos" },
            { value: "98%", label: "Tasa de Satisfacción" },
            { value: "150+", label: "Propiedades Vendidas" },
            { value: "4.9/5", label: "Rating Promedio" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Ver más testimonios
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
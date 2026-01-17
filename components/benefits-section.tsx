"use client"

import { motion } from "framer-motion"
import { 
  Building2, 
  Zap, 
  DollarSign, 
  Users, 
  Shield, 
  Clock,
  TrendingUp,
  Award
} from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: Building2,
      title: "Amplio Portafolio",
      description: "Acceso a más de 500 propiedades disponibles en las mejores ubicaciones",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Zap,
      title: "Proceso Rápido",
      description: "Trámites ágiles y sin complicaciones. Ahorra hasta 40% del tiempo",
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: DollarSign,
      title: "Mejores Precios",
      description: "Negocia directamente con propietarios y obtén las mejores ofertas",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      icon: Users,
      title: "Expertos Inmobiliarios",
      description: "Equipo profesional con más de 10 años de experiencia a tu disposición",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Transacciones Seguras",
      description: "Garantizamos la seguridad jurídica en cada operación inmobiliaria",
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: Clock,
      title: "Disponibilidad 24/7",
      description: "Atención continua para resolver todas tus dudas cuando lo necesites",
      color: "from-cyan-500 to-teal-600",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600"
    },
    {
      icon: TrendingUp,
      title: "Análisis de Mercado",
      description: "Informes detallados para tomar las mejores decisiones de inversión",
      color: "from-teal-500 to-green-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    {
      icon: Award,
      title: "Calidad Certificada",
      description: "Reconocidos por nuestra excelencia y compromiso con cada cliente",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              ⚡ Ventajas
            </span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Ofrecemos servicios de excelencia con el respaldo de años de experiencia
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${benefit.bgColor} rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${benefit.iconColor}`} />
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {benefit.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "+150", label: "Propiedades" },
              { value: "+100", label: "Clientes" },
              { value: "+4", label: "Años" },
              { value: "98%", label: "Satisfacción" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className="relative"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-green-100">{stat.label}</div>
                
                {/* Separator */}
                {idx < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/20" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-50"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Transacciones Seguras</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Certificados</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">+100 Clientes</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
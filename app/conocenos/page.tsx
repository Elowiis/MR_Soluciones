'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from 'next/image'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Award,
  Users,
  TrendingUp,
  Shield,
  Building2,
  MessageCircle,
  ArrowRight,
  X,
  Send,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

export default function ConocenosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, asunto: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(
        "https://primary-production-a806.up.railway.app/webhook-test/8669bb8a-bb73-4726-b8db-ac3a7e92a029",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            tipo: "Contacto Conócenos",
            fecha: new Date().toISOString(),
          }),
        }
      )

      if (response.ok) {
        toast({
          title: "¡Mensaje enviado!",
          description: "Nos pondremos en contacto contigo pronto",
        })
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          asunto: '',
          mensaje: '',
        })
        setIsModalOpen(false)
      } else {
        throw new Error("Error en la respuesta")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Compacto */}
      <section className="relative h-64 md:h-72 overflow-hidden">
        {/* Imagen de fondo */}
        <Image
          src="/clubnautico.jpg"
          alt="Fondo conócenos"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay verde */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-emerald-800/80" />
        
        {/* Contenido */}
        <div className="relative h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-white mb-3"
            >
              Conócenos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-white/85 max-w-xl"
            >
              Tu aliado de confianza en el mercado inmobiliario. Más de una década de experiencia conectando personas con sus hogares ideales.
            </motion.p>
          </div>
          
          {/* Logo */}
          <div className="hidden md:block">
            <div className="relative w-28 h-28 bg-white rounded-xl p-2 shadow-lg">
              <Image
                src="/logo.jpg"
                alt="MR Soluciones Inmobiliarias"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center mb-12 sm:mb-16">
            {/* Foto del dueño/equipo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center"
            >
              <div className="relative w-3/4 h-3/4">
                <Image
                  src="/logo.jpg"
                  alt="MR Soluciones Inmobiliarias"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Información */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-foreground">
                  Bienvenidos a M | R Soluciones Inmobiliarias
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  Hola, soy <strong className="text-foreground">Manuel Rodríguez Voces</strong>, gerente de esta agencia inmobiliaria en Ponferrada, y la persona que estará a tu lado para ayudarte a comprar, vender o alquilar tu vivienda con total confianza.
                </p>
                <p>
                  Con más de tres años de experiencia en el sector inmobiliario, y tras trabajar en diferentes ciudades, decidí fundar esta agencia en Ponferrada con un propósito claro: ofrecer un servicio inmobiliario profesional, honesto y transparente. Estos valores son nuestra base, y los aplicamos en cada operación para que tú solo tengas que preocuparte de tomar la mejor decisión.
                </p>
                <p>
                  Nos gusta hacer las cosas de forma clara, cercana y eficaz, sin letra pequeña ni sorpresas. Porque sabemos lo importante que es encontrar no solo una propiedad, sino un lugar donde construir futuro.
                </p>
                <p>
                  Si estás buscando una <strong className="text-foreground">inmobiliaria en Ponferrada</strong> de confianza, comprometida con tus intereses y con un trato realmente personalizado, estás en el sitio adecuado. Te ayudamos a comprar, vender o alquilar tu piso, casa o local en Ponferrada con todas las garantías.
                </p>
                <p>
                  Será un placer conocerte y acompañarte en este camino.
                </p>
                <p className="text-xl font-semibold text-primary italic">
                  Tu hogar, nuestra misión.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Estadísticas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {[
              { icon: Award, value: '3+', label: 'Años de experiencia', color: 'text-green-600' },
              { icon: Building2, value: '100+', label: 'Propiedades gestionadas', color: 'text-emerald-600' },
              { icon: Users, value: '200+', label: 'Clientes satisfechos', color: 'text-teal-600' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl border p-6 sm:p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} mx-auto mb-3 sm:mb-4`} />
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Nuestra Oficina Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              Nuestra Oficina
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Visítanos en nuestro espacio de trabajo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Información de contacto */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl border p-6 sm:p-8 space-y-4 sm:space-y-6"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">Dirección</h3>
                    <p className="text-muted-foreground">
                      Avenida de España, 37, 1ºA<br />
                      24400 Ponferrada, León
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">Teléfono</h3>
                    <a
                      href="tel:+34912345678"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +34 912 345 678
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">Email</h3>
                    <a
                      href="mailto:info@mrsoluciones.es"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@mrsoluciones.es
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">Horario de Atención</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Lunes - Viernes: 9:00 - 20:00</p>
                      <p>Sábados: 10:00 - 14:00</p>
                      <p>Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mapa */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl border overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2939.389611868167!2d-6.605739488328186!3d42.54701927105577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd30baf277a52fbb%3A0x42fd242d78dfe00!2sAv.%20Espa%C3%B1a%2C%2037%2C%2024400%20Ponferrada%2C%20Le%C3%B3n!5e0!3m2!1ses!2ses!4v1764878055619!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ minHeight: '250px', border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full sm:min-h-[350px] md:min-h-[400px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Lo que nos diferencia en el mercado inmobiliario
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Award,
                title: 'Experiencia',
                description: 'Más de 3 años de trayectoria en el sector inmobiliario, con un profundo conocimiento del mercado de Ponferrada y alrededores.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: Users,
                title: 'Trato Personalizado',
                description: 'Cada cliente es único. Ofrecemos atención personalizada adaptada a tus necesidades específicas y objetivos.',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: TrendingUp,
                title: 'Conocimiento del Mercado',
                description: 'Análisis constante de tendencias y valores para ofrecerte las mejores oportunidades de inversión y compra.',
                color: 'bg-teal-50 text-teal-600',
              },
              {
                icon: Shield,
                title: 'Transparencia',
                description: 'Procesos claros, comunicación honesta y sin sorpresas. La confianza es la base de todas nuestras relaciones.',
                color: 'bg-green-50 text-green-600',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-xl border p-5 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        {/* Imagen de fondo */}
        <Image
          src="/clubnautico.jpg"
          alt="Fondo contacto"
          fill
          className="object-cover"
        />
        {/* Overlay verde */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-emerald-800/85" />
        
        <div className="relative h-full max-w-4xl mx-auto px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Tienes alguna pregunta?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-white text-green-900 hover:bg-green-50 text-lg px-8 py-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Contáctanos ahora
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Modal de Contacto */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header del Modal */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image
                        src="/logo.jpg"
                        alt="MR Soluciones Inmobiliarias"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Contáctanos</h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Contenido del Modal */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 text-center">
                    Rellena el formulario y nos pondremos en contacto contigo lo antes posible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      name="nombre"
                      placeholder="Nombre completo *"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />

                    <Input
                      name="email"
                      type="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />

                    <Input
                      name="telefono"
                      placeholder="Teléfono *"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />

                    <Select onValueChange={handleSelectChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Asunto *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulta-general">Consulta general</SelectItem>
                        <SelectItem value="quiero-comprar">Quiero comprar</SelectItem>
                        <SelectItem value="quiero-vender">Quiero vender</SelectItem>
                        <SelectItem value="quiero-alquilar">Quiero alquilar</SelectItem>
                        <SelectItem value="valoracion">Solicitar valoración</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>

                    <textarea
                      name="mensaje"
                      placeholder="Mensaje *"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          Enviar mensaje
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
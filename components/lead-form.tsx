"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle2,
  Loader2,
  ShoppingCart,
  KeyRound,
  AlertCircle,
  User,
  Mail,
  Phone,
  Send,
  Euro,
  ShieldCheck,
} from "lucide-react"

type LeadType = "Comprador" | "Vendedor" | "Alquiler"

// Tipos de propiedad que requieren habitaciones y baños
const tiposConHabitaciones = ["piso", "casa", "chalet"]

export function LeadForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState("")
  const [leadType, setLeadType] = useState<LeadType | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    presupuesto: "",
    zona: "",
    zonaOtra: "",
    tipoPropiedad: "",
    habitaciones: "",
    banos: "",
    urgencia: "",
    zonaPropiedad: "",
    zonaPropiedadOtra: "",
    tipoVenta: "",
    metrosCuadrados: "",
    habitacionesVenta: "",
    banosVenta: "",
    precioEsperado: "",
    documentosRegla: "",
    urgenciaVenta: "",
    // Campos de Alquiler
    tipoAlquiler: "",
    zonaAlquiler: "",
    zonaAlquilerOtra: "",
    tipoPropiedadAlquiler: "",
    presupuestoAlquiler: "",
    urgenciaAlquiler: "",
    mensaje: "",
    aceptaTerminos: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      
      // Limpiar campos cuando cambia zona
      if (name === "zona" && value !== "otra") {
        newData.zonaOtra = ""
      }
      if (name === "zonaPropiedad" && value !== "otra") {
        newData.zonaPropiedadOtra = ""
      }
      if (name === "zonaAlquiler" && value !== "otra") {
        newData.zonaAlquilerOtra = ""
      }
      
      // Limpiar habitaciones/baños si cambia a un tipo que no los necesita (Comprador)
      if (name === "tipoPropiedad" && !tiposConHabitaciones.includes(value)) {
        newData.habitaciones = ""
        newData.banos = ""
      }
      
      // Limpiar habitaciones/baños si cambia a un tipo que no los necesita (Vendedor)
      if (name === "tipoVenta" && !tiposConHabitaciones.includes(value)) {
        newData.habitacionesVenta = ""
        newData.banosVenta = ""
      }
      
      return newData
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Introduce un email válido"
      }
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "El teléfono es obligatorio"
    }

    if (!leadType) {
      newErrors.leadType = "Selecciona un tipo de interés"
    }

    if (!formData.aceptaTerminos) {
      newErrors.aceptaTerminos = "Debes aceptar la Política de Privacidad"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll al primer error
      const firstError = document.querySelector('.error-field')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      
      toast({ 
        title: "⚠️ Formulario incompleto", 
        description: "Por favor, revisa los campos marcados en rojo",
      })
      return
    }
  
    setLoading(true)
    try {
      const zonaFinal = formData.zona === "otra" ? formData.zonaOtra : formData.zona
      const zonaPropiedadFinal = formData.zonaPropiedad === "otra" ? formData.zonaPropiedadOtra : formData.zonaPropiedad
      const zonaAlquilerFinal = formData.zonaAlquiler === "otra" ? formData.zonaAlquilerOtra : formData.zonaAlquiler

      const dataToSend = {
        tipo: leadType,
        nombre: formData.nombre,
        email: formData.email,
        whatsapp: formData.whatsapp,
        mensaje: formData.mensaje,
        fecha: new Date().toISOString(),
        ...(leadType === "Comprador" && {
          presupuesto: formData.presupuesto,
          zona: zonaFinal,
          tipoPropiedad: formData.tipoPropiedad,
          // Solo incluir habitaciones y baños si aplica
          ...(tiposConHabitaciones.includes(formData.tipoPropiedad) && {
            habitaciones: formData.habitaciones,
            banos: formData.banos,
          }),
          urgencia: formData.urgencia,
        }),
        ...(leadType === "Vendedor" && {
          zonaPropiedad: zonaPropiedadFinal,
          tipoVenta: formData.tipoVenta,
          metrosCuadrados: formData.metrosCuadrados,
          // Solo incluir habitaciones y baños si aplica
          ...(tiposConHabitaciones.includes(formData.tipoVenta) && {
            habitacionesVenta: formData.habitacionesVenta,
            banosVenta: formData.banosVenta,
          }),
          precioEsperado: formData.precioEsperado,
          documentosRegla: formData.documentosRegla,
          urgenciaVenta: formData.urgenciaVenta,
        }),
        ...(leadType === "Alquiler" && {
          tipoAlquiler: formData.tipoAlquiler,
          zonaAlquiler: zonaAlquilerFinal,
          tipoPropiedadAlquiler: formData.tipoPropiedadAlquiler,
          presupuestoAlquiler: formData.presupuestoAlquiler,
          urgenciaAlquiler: formData.urgenciaAlquiler,
        }),
      }
  
      const response = await fetch(
        "https://primary-production-a806.up.railway.app/webhook/8669bb8a-bb73-4726-b8db-ac3a7e92a029",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      )
  
      if (response.ok) {
        setSubmittedName(formData.nombre.split(" ")[0])
        setSubmitted(true)
        setFormData({
          nombre: "",
          email: "",
          whatsapp: "",
          presupuesto: "",
          zona: "",
          zonaOtra: "",
          tipoPropiedad: "",
          habitaciones: "",
          banos: "",
          urgencia: "",
          zonaPropiedad: "",
          zonaPropiedadOtra: "",
          tipoVenta: "",
          metrosCuadrados: "",
          habitacionesVenta: "",
          banosVenta: "",
          precioEsperado: "",
          documentosRegla: "",
          urgenciaVenta: "",
          tipoAlquiler: "",
          zonaAlquiler: "",
          zonaAlquilerOtra: "",
          tipoPropiedadAlquiler: "",
          presupuestoAlquiler: "",
          urgenciaAlquiler: "",
          mensaje: "",
          aceptaTerminos: false,
        })
        setLeadType(null)
        setErrors({})
      } else {
        throw new Error("Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error al enviar:", error)
      toast({
        title: "❌ Error",
        description: "Ocurrió un error al enviar la solicitud. Por favor, intenta de nuevo.",
      })
    } finally {
      setLoading(false)
    }
  }

  const leadTypes = [
    {
      type: "Comprador" as LeadType,
      description: "Busco comprar",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-500",
    },
    {
      type: "Vendedor" as LeadType,
      description: "Quiero vender",
      icon: Euro,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-500",
    },
    {
      type: "Alquiler" as LeadType,
      description: "Busco u ofrezco",
      icon: KeyRound,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      borderColor: "border-purple-500",
    },
  ]

  // Verificar si mostrar campos de habitaciones/baños
  const mostrarHabitacionesComprador = tiposConHabitaciones.includes(formData.tipoPropiedad)
  const mostrarHabitacionesVendedor = tiposConHabitaciones.includes(formData.tipoVenta)

  // Componente para mostrar error
  const ErrorMessage = ({ error }: { error?: string }) => (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5 text-red-600"
        >
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Pantalla de éxito tras el envío
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 p-8 sm:p-12 max-w-3xl mx-2 sm:mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {submittedName ? `¡Gracias, ${submittedName}!` : "¡Solicitud enviada!"}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Hemos recibido tu solicitud. Te contactaremos muy pronto por WhatsApp o email.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="rounded-full border-green-600/30 text-green-700 hover:bg-green-50 hover:border-green-600/50 px-6 min-h-[44px]"
        >
          Enviar otra solicitud
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 p-4 sm:p-6 md:p-8 max-w-3xl mx-2 sm:mx-auto"
    >
      {/* Header compacto: el título grande ya lo pone la sección de la home */}
      <div className="flex items-center gap-3 mb-5 sm:mb-6 md:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="shrink-0 rounded-xl overflow-hidden shadow-md"
        >
          <Image
            src="/logo.jpg"
            alt="MR Soluciones Inmobiliarias"
            width={48}
            height={48}
            className="object-contain w-10 h-10 sm:w-12 sm:h-12"
          />
        </motion.div>
        <div>
          <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
            Completa el formulario
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Te contactamos en cuanto lo recibamos</p>
        </div>
      </div>

      {/* Campos iniciales */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Nombre */}
          <div className={errors.nombre ? "error-field" : ""}>
            <div className="relative">
              <Input
                name="nombre"
                placeholder="Nombre completo *"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`pl-10 pr-3 h-11 transition-all text-sm placeholder:text-sm ${
                  errors.nombre 
                    ? "border-red-500 border-2 bg-red-50 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.nombre ? "text-red-500" : "text-gray-400"}`} />
            </div>
            <ErrorMessage error={errors.nombre} />
          </div>
          
          {/* Email */}
          <div className={errors.email ? "error-field" : ""}>
            <div className="relative">
              <Input
                name="email"
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 pr-3 h-11 transition-all text-sm placeholder:text-sm ${
                  errors.email 
                    ? "border-red-500 border-2 bg-red-50 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? "text-red-500" : "text-gray-400"}`} />
            </div>
            <ErrorMessage error={errors.email} />
          </div>
        </div>

        {/* WhatsApp */}
        <div className={errors.whatsapp ? "error-field" : ""}>
          <div className="relative">
            <Input
              name="whatsapp"
              placeholder="WhatsApp (+34 600 000 000) *"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className={`pl-10 pr-3 h-11 transition-all text-sm placeholder:text-sm ${
                errors.whatsapp 
                  ? "border-red-500 border-2 bg-red-50 focus:border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:border-green-500 focus:ring-green-500"
              }`}
            />
            <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.whatsapp ? "text-red-500" : "text-gray-400"}`} />
          </div>
          <ErrorMessage error={errors.whatsapp} />
        </div>
      </motion.div>

      {/* Tipo de interés */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 sm:mb-8"
      >
        <label className="block text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
          ¿Qué te interesa? *
        </label>
        
        {/* Error de tipo de interés */}
        <AnimatePresence>
          {errors.leadType && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{errors.leadType}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {leadTypes.map(({ type, description, icon: Icon, color, bgColor, borderColor }) => (
            <motion.button
              key={type}
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setLeadType(type)
                if (errors.leadType) {
                  setErrors((prev) => ({ ...prev, leadType: "" }))
                }
              }}
              className={`relative p-2 sm:p-3 md:p-4 lg:p-5 rounded-xl sm:rounded-2xl border-2 transition-all min-h-[44px] flex flex-col items-center justify-center ${
                leadType === type
                  ? `${borderColor} ${bgColor} shadow-lg`
                  : errors.leadType
                    ? "border-red-300 bg-red-50 hover:border-red-400"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className={`inline-flex p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} mb-1.5 sm:mb-2 shadow-sm`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 text-center leading-tight">{type}</div>
              <div className="hidden sm:block text-[10px] md:text-xs text-gray-500 text-center mt-0.5">{description}</div>

              {leadType === type && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-500 rounded-full p-0.5 sm:p-1 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Campos condicionales */}
      <AnimatePresence mode="wait">
        {leadType === "Comprador" && (
          <motion.div
            key="comprador"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl border border-blue-200">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Información del comprador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <Select onValueChange={(value) => handleSelectChange("presupuesto", value)}>
                <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                  <SelectValue placeholder="Presupuesto" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos-50.000">Menos de 50.000€</SelectItem>
                    <SelectItem value="50.000-100.000">50.000€ - 100.000€</SelectItem>
                    <SelectItem value="100.000-150.000">100.000€ - 150.000€</SelectItem>
                    <SelectItem value="150.000-200.000">150.000€ - 200.000€</SelectItem>
                    <SelectItem value="mas-200.000">Más de 200.000€</SelectItem>
                    <SelectItem value="no-se">No lo sé</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleSelectChange("zona", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="Zona preferida" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ponferrada">Ponferrada</SelectItem>
                    <SelectItem value="Vega de Espinareda">Vega de Espinareda</SelectItem>
                    <SelectItem value="Camponaraya">Camponaraya</SelectItem>
                    <SelectItem value="Fabero">Fabero</SelectItem>
                    <SelectItem value="Bembibre">Bembibre</SelectItem>
                    <SelectItem value="Molinaseca">Molinaseca</SelectItem>
                    <SelectItem value="Carucedo">Carucedo</SelectItem>
                    <SelectItem value="otra">Otra zona</SelectItem>
                  </SelectContent>
                </Select>

                {/* Campo de texto para "Otra zona" - Comprador */}
                <AnimatePresence>
                  {formData.zona === "otra" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="md:col-span-2"
                    >
                      <Input
                        name="zonaOtra"
                        placeholder="Indica la zona que te interesa"
                        value={formData.zonaOtra}
                        onChange={handleInputChange}
                        className="h-10 sm:h-11 md:h-12 bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm px-3"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Select onValueChange={(value) => handleSelectChange("tipoPropiedad", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Piso">Piso</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Chalet">Chalet</SelectItem>
                    <SelectItem value="Local comercial">Local comercial</SelectItem>
                    <SelectItem value="Terreno">Terreno</SelectItem>
                    <SelectItem value="Garaje">Garaje</SelectItem>
                  </SelectContent>
                </Select>

                {/* Habitaciones - Solo si aplica */}
                <AnimatePresence>
                  {mostrarHabitacionesComprador && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select onValueChange={(value) => handleSelectChange("habitaciones", value)}>
                        <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                          <SelectValue placeholder="Habitaciones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 habitación</SelectItem>
                          <SelectItem value="2">2 habitaciones</SelectItem>
                          <SelectItem value="3">3 habitaciones</SelectItem>
                          <SelectItem value="4+">4+ habitaciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Baños - Solo si aplica */}
                <AnimatePresence>
                  {mostrarHabitacionesComprador && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select onValueChange={(value) => handleSelectChange("banos", value)}>
                        <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                          <SelectValue placeholder="Baños" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 baño</SelectItem>
                          <SelectItem value="2">2 baños</SelectItem>
                          <SelectItem value="3+">3+ baños</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={mostrarHabitacionesComprador ? "" : "md:col-span-2"}>
                  <Select onValueChange={(value) => handleSelectChange("urgencia", value)}>
                    <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                      <SelectValue placeholder="¿Cuándo necesitas la propiedad?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Urgente (menos 1 mes)</SelectItem>
                      <SelectItem value="Media">1-3 meses</SelectItem>
                      <SelectItem value="Baja">Más de 3 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {leadType === "Vendedor" && (
          <motion.div
            key="vendedor"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl border border-green-200">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Euro className="w-4 h-4 sm:w-5 sm:h-5" />
                Información de la propiedad a vender
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <Select onValueChange={(value) => handleSelectChange("zonaPropiedad", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="Zona de la propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ponferrada">Ponferrada</SelectItem>
                    <SelectItem value="Vega de Espinareda">Vega de Espinareda</SelectItem>
                    <SelectItem value="Camponaraya">Camponaraya</SelectItem>
                    <SelectItem value="Fabero">Fabero</SelectItem>
                    <SelectItem value="Bembibre">Bembibre</SelectItem>
                    <SelectItem value="Molinaseca">Molinaseca</SelectItem>
                    <SelectItem value="Carucedo">Carucedo</SelectItem>
                    <SelectItem value="otra">Otra zona</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleSelectChange("tipoVenta", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Piso">Piso</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Chalet">Chalet</SelectItem>
                    <SelectItem value="Local comercial">Local comercial</SelectItem>
                    <SelectItem value="Terreno">Terreno</SelectItem>
                    <SelectItem value="Garaje">Garaje</SelectItem>
                  </SelectContent>
                </Select>

                {/* Campo de texto para "Otra zona" - Vendedor */}
                <AnimatePresence>
                  {formData.zonaPropiedad === "otra" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="md:col-span-2"
                    >
                      <Input
                        name="zonaPropiedadOtra"
                        placeholder="Indica la zona de tu propiedad"
                        value={formData.zonaPropiedadOtra}
                        onChange={handleInputChange}
                        className="h-10 sm:h-11 md:h-12 bg-white border-green-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm px-3"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Input
                  name="metrosCuadrados"
                  type="number"
                  placeholder="Metros cuadrados"
                  value={formData.metrosCuadrados}
                  onChange={handleInputChange}
                  className="h-10 sm:h-11 md:h-12 bg-white border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm px-3"
                />

                {/* Habitaciones - Solo si aplica */}
                <AnimatePresence>
                  {mostrarHabitacionesVendedor && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select onValueChange={(value) => handleSelectChange("habitacionesVenta", value)}>
                        <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                          <SelectValue placeholder="Habitaciones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 habitación</SelectItem>
                          <SelectItem value="2">2 habitaciones</SelectItem>
                          <SelectItem value="3">3 habitaciones</SelectItem>
                          <SelectItem value="4">4 habitaciones</SelectItem>
                          <SelectItem value="5+">5+ habitaciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Baños - Solo si aplica */}
                <AnimatePresence>
                  {mostrarHabitacionesVendedor && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select onValueChange={(value) => handleSelectChange("banosVenta", value)}>
                        <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                          <SelectValue placeholder="Baños" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 baño</SelectItem>
                          <SelectItem value="2">2 baños</SelectItem>
                          <SelectItem value="3+">3+ baños</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Select onValueChange={(value) => handleSelectChange("precioEsperado", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="Precio esperado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos-50.000">Menos de 50.000€</SelectItem>
                    <SelectItem value="50.000-100.000">50.000€ - 100.000€</SelectItem>
                    <SelectItem value="100.000-150.000">100.000€ - 150.000€</SelectItem>
                    <SelectItem value="150.000-200.000">150.000€ - 200.000€</SelectItem>
                    <SelectItem value="mas-200.000">Más de 200.000€</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleSelectChange("documentosRegla", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="¿Documentos al día?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, todo en regla</SelectItem>
                    <SelectItem value="Necesito ayuda">Necesito ayuda</SelectItem>
                    <SelectItem value="no-seguro">No estoy seguro</SelectItem>
                  </SelectContent>
                </Select>

                <div className="md:col-span-2">
                  <Select onValueChange={(value) => handleSelectChange("urgenciaVenta", value)}>
                    <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                      <SelectValue placeholder="¿Cuándo necesitas vender?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Urgente (menos 1 mes)</SelectItem>
                      <SelectItem value="Media">1-3 meses</SelectItem>
                      <SelectItem value="Baja">Más de 3 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {leadType === "Alquiler" && (
          <motion.div
            key="alquiler"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl border border-purple-200">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-900 mb-3 sm:mb-4 flex items-center gap-2">
                <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
                Información de alquiler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <Select onValueChange={(value) => handleSelectChange("tipoAlquiler", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="¿Qué necesitas?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="busco">Busco alquilar</SelectItem>
                    <SelectItem value="ofrezco">Quiero poner en alquiler</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleSelectChange("zonaAlquiler", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="Zona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ponferrada">Ponferrada</SelectItem>
                    <SelectItem value="vega-espinareda">Vega de Espinareda</SelectItem>
                    <SelectItem value="camponaraya">Camponaraya</SelectItem>
                    <SelectItem value="fabero">Fabero</SelectItem>
                    <SelectItem value="bembibre">Bembibre</SelectItem>
                    <SelectItem value="molinaseca">Molinaseca</SelectItem>
                    <SelectItem value="carucedo">Carucedo</SelectItem>
                    <SelectItem value="otra">Otra zona</SelectItem>
                  </SelectContent>
                </Select>

                {/* Campo de texto para "Otra zona" - Alquiler */}
                <AnimatePresence>
                  {formData.zonaAlquiler === "otra" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="md:col-span-2"
                    >
                      <Input
                        name="zonaAlquilerOtra"
                        placeholder="Indica la zona"
                        value={formData.zonaAlquilerOtra}
                        onChange={handleInputChange}
                        className="h-10 sm:h-11 md:h-12 bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm px-3"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Select onValueChange={(value) => handleSelectChange("tipoPropiedadAlquiler", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piso">Piso</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="local">Local comercial</SelectItem>
                    <SelectItem value="garaje">Garaje</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleSelectChange("presupuestoAlquiler", value)}>
                  <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                    <SelectValue placeholder="Presupuesto mensual" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos-300">Menos de 300€/mes</SelectItem>
                    <SelectItem value="300-500">300€ - 500€/mes</SelectItem>
                    <SelectItem value="500-700">500€ - 700€/mes</SelectItem>
                    <SelectItem value="mas-700">Más de 700€/mes</SelectItem>
                  </SelectContent>
                </Select>

                <div className="md:col-span-2">
                  <Select onValueChange={(value) => handleSelectChange("urgenciaAlquiler", value)}>
                    <SelectTrigger className="bg-white h-10 sm:h-11 md:h-12 text-sm min-h-[40px] sm:min-h-[44px]">
                      <SelectValue placeholder="¿Cuándo lo necesitas?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Urgente (menos 1 mes)</SelectItem>
                      <SelectItem value="Media">1-3 meses</SelectItem>
                      <SelectItem value="Baja">Más de 3 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-4 sm:mb-6"
      >
        <textarea
          name="mensaje"
          placeholder="Cuéntanos más detalles (opcional)"
          value={formData.mensaje}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-xl px-3 py-3 sm:px-4 sm:py-3 text-sm text-gray-700 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none transition-all resize-none"
          rows={3}
        />
      </motion.div>

      {/* Términos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-4 sm:mb-6"
      >
        <label 
          className={`flex items-start gap-2 sm:gap-3 cursor-pointer group p-2 sm:p-3 rounded-lg transition-all ${
            errors.aceptaTerminos ? "bg-red-50 border border-red-200" : ""
          }`}
        >
          <input
            type="checkbox"
            name="aceptaTerminos"
            checked={formData.aceptaTerminos}
            onChange={(e) => {
              handleInputChange(e)
              if (errors.aceptaTerminos) {
                setErrors((prev) => ({ ...prev, aceptaTerminos: "" }))
              }
            }}
            className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded cursor-pointer flex-shrink-0 accent-green-600 ${
              errors.aceptaTerminos
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          <span className={`text-xs sm:text-sm group-hover:text-gray-900 transition-colors leading-relaxed ${
            errors.aceptaTerminos ? "text-red-700" : "text-gray-600"
          }`}>
            He leído y acepto la{" "}
            <Link href="/legal/aviso-legal" className="text-green-600 hover:text-green-700 font-medium underline">
              Política de Privacidad
            </Link>{" "}
            *
          </span>
        </label>
        <ErrorMessage error={errors.aceptaTerminos} />
      </motion.div>

      {/* Botón de envío */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-base font-semibold rounded-full shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/35 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              Enviando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Enviar solicitud
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
          )}
        </Button>
        <p className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          Solo usaremos tus datos para responderte. Nada de spam.
        </p>
      </motion.div>
    </motion.form>
  )
}
'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  Coins,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const zonas = [
  { value: 'todas', label: 'Todas las zonas' },
  { value: 'ponferrada', label: 'Ponferrada' },
  { value: 'bembibre', label: 'Bembibre' },
  { value: 'camponaraya', label: 'Camponaraya' },
  { value: 'carracedelo', label: 'Carracedelo' },
  { value: 'cacabelos', label: 'Cacabelos' },
  { value: 'villafranca', label: 'Villafranca del Bierzo' },
  { value: 'toral', label: 'Toral de los Vados' },
  { value: 'molinaseca', label: 'Molinaseca' },
]

const tiposPropiedad = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'piso', label: 'Piso' },
  { value: 'casa', label: 'Casa' },
  { value: 'garaje', label: 'Garaje' },
  { value: 'ático', label: 'Ático' },
  { value: 'local', label: 'Local' },
  { value: 'terreno', label: 'Terreno' },
]

const operaciones = [
  { value: 'todos', label: 'Todo' },
  { value: 'comprar', label: 'Comprar' },
  { value: 'alquilar', label: 'Alquilar' },
]

const precios = [
  { value: 'sin-limite', label: 'Sin límite' },
  { value: '50000', label: '50.000€' },
  { value: '100000', label: '100.000€' },
  { value: '150000', label: '150.000€' },
  { value: '200000', label: '200.000€' },
  { value: '300000', label: '300.000€+' },
]

// Campo del buscador: chip gris que se "enciende" al interactuar
function SearchField({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <div className="bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-left transition-colors duration-200 hover:bg-white hover:border-green-500/40 focus-within:bg-white focus-within:border-green-500/60 focus-within:ring-2 focus-within:ring-green-500/15">
      <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
        <Icon className="w-3 h-3 text-green-600/70" />
        {label}
      </label>
      {children}
    </div>
  )
}

const selectTriggerClass =
  'w-full border-0 bg-transparent hover:bg-transparent focus:bg-transparent h-8 text-sm sm:text-[15px] font-medium text-gray-900 p-0 focus:ring-0 shadow-none'

export function PropertySearch() {
  const router = useRouter()
  const [operacion, setOperacion] = useState('todos')
  const [tipo, setTipo] = useState<string>('todos')
  const [zona, setZona] = useState<string>('todas')
  const [precioMax, setPrecioMax] = useState<string>('sin-limite')
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()

    // Solo incluir filtros que el usuario realmente seleccionó
    if (operacion && operacion !== 'todos') {
      params.set('operacion', operacion)
    }

    if (tipo && tipo !== 'todos') {
      params.set('tipo', tipo)
    }

    if (zona && zona !== 'todas') {
      params.set('zona', zona)
    }

    if (precioMax && precioMax !== 'sin-limite') {
      params.set('precioMax', precioMax)
    }

    const queryString = params.toString()
    const url = queryString ? `/propiedades?${queryString}` : '/propiedades'

    router.push(url)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      {/* Tarjeta glass del buscador */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-[1.75rem] shadow-2xl shadow-black/25 ring-1 ring-black/5 p-2.5 sm:p-3">
        {/* Tabs de operación con píldora deslizante */}
        <div className="flex items-center justify-between gap-2 px-1 pb-2.5 sm:px-2 sm:pb-3">
          <div className="flex items-center rounded-full bg-gray-100 p-1">
            {operaciones.map((op) => {
              const active = operacion === op.value
              return (
                <button
                  key={op.value}
                  type="button"
                  onClick={() => setOperacion(op.value)}
                  className={cn(
                    'relative px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200',
                    active ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="search-operacion"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 shadow-md shadow-green-600/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{op.label}</span>
                </button>
              )
            })}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-400 pr-1">
            <MapPin className="w-3.5 h-3.5 text-green-600/60" />
            <span>El Bierzo, León</span>
          </div>
        </div>

        {/* Vista móvil: Ubicación + Más filtros + Buscar */}
        <div className="block sm:hidden space-y-2">
          <SearchField icon={MapPin} label="Ubicación">
            <Select value={zona} onValueChange={setZona}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Todas las zonas" />
              </SelectTrigger>
              <SelectContent>
                {zonas.map((z) => (
                  <SelectItem key={z.value} value={z.value}>
                    {z.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SearchField>

          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="w-full min-h-[40px] flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {showMoreFilters ? 'Ocultar filtros' : 'Más filtros'}
            {showMoreFilters ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showMoreFilters && (
            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
              <SearchField icon={Building2} label="Tipo">
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposPropiedad.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SearchField>

              <SearchField icon={Coins} label="Precio máx.">
                <Select value={precioMax} onValueChange={setPrecioMax}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Sin límite" />
                  </SelectTrigger>
                  <SelectContent>
                    {precios.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SearchField>
            </div>
          )}

          <Button
            onClick={handleSearch}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/35 transition-all duration-300"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar propiedades
          </Button>
        </div>

        {/* Vista desktop/tablet */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-2">
          <SearchField icon={Building2} label="Tipo">
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                {tiposPropiedad.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SearchField>

          <SearchField icon={MapPin} label="Ubicación">
            <Select value={zona} onValueChange={setZona}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Todas las zonas" />
              </SelectTrigger>
              <SelectContent>
                {zonas.map((z) => (
                  <SelectItem key={z.value} value={z.value}>
                    {z.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SearchField>

          <SearchField icon={Coins} label="Precio máximo">
            <Select value={precioMax} onValueChange={setPrecioMax}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Sin límite" />
              </SelectTrigger>
              <SelectContent>
                {precios.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SearchField>

          <Button
            onClick={handleSearch}
            className="h-full min-h-[56px] px-6 lg:px-8 col-span-2 lg:col-span-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-base shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/35 hover:-translate-y-0.5 transition-all duration-300"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Buscar
          </Button>
        </div>
      </div>
    </div>
  )
}

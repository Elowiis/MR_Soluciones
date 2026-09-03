'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PropertyGrid } from '@/components/PropertyGrid'
import { Property, PropertyType, PropertyStatus } from '@/types/property'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Filter,
  X,
  MapPin,
  Coins,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const propertyTypes: { value: PropertyType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'piso', label: 'Piso' },
  { value: 'casa', label: 'Casa' },
  { value: 'ático', label: 'Ático' },
  { value: 'garaje', label: 'Garaje' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'estudio', label: 'Estudio' },
  { value: 'local', label: 'Local' },
  { value: 'oficina', label: 'Oficina' },
]

const statusTabs: { value: PropertyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: 'en venta', label: 'En venta' },
  { value: 'alquiler', label: 'Alquiler' },
]

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

const precios = [
  { value: 'sin-limite', label: 'Cualquier precio' },
  { value: '50000', label: 'Hasta 50.000€' },
  { value: '100000', label: 'Hasta 100.000€' },
  { value: '150000', label: 'Hasta 150.000€' },
  { value: '200000', label: 'Hasta 200.000€' },
  { value: '300000', label: '300.000€ o más' },
]

const sortOptions = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
]

function PropertiesContent({ properties }: { properties: Property[] }) {
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus | 'all'>('all')
  const [selectedZona, setSelectedZona] = useState<string>('todas')
  const [precioMax, setPrecioMax] = useState<string>('sin-limite')
  const [sortBy, setSortBy] = useState<string>('recientes')
  const [showFilters, setShowFilters] = useState(false)

  const formatPrecioDisplay = (precio: string) => {
    if (!precio || precio === 'sin-limite') return ''
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(parseInt(precio))
  }

  // Inicializar filtros desde la URL (llegada desde el buscador de la home)
  useEffect(() => {
    const tipo = searchParams.get('tipo')
    const zona = searchParams.get('zona')
    const precioMaxParam = searchParams.get('precioMax')
    const operacion = searchParams.get('operacion')

    if (tipo && tipo !== 'todos') {
      setSelectedType(tipo as PropertyType)
    } else {
      setSelectedType('all')
    }

    if (zona && zona !== 'todas') {
      setSelectedZona(zona)
    } else {
      setSelectedZona('todas')
    }

    if (precioMaxParam && precioMaxParam !== 'sin-limite') {
      setPrecioMax(precioMaxParam)
    } else {
      setPrecioMax('sin-limite')
    }

    if (operacion && operacion !== 'todos') {
      if (operacion === 'comprar') {
        setSelectedStatus('en venta')
      } else if (operacion === 'alquilar') {
        setSelectedStatus('alquiler')
      }
    } else {
      setSelectedStatus('all')
    }
  }, [searchParams])

  const filteredProperties = useMemo(() => {
    let filtered = [...properties]

    if (selectedType !== 'all') {
      filtered = filtered.filter((prop) => prop.propertyType === selectedType)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((prop) => prop.status === selectedStatus)
    }

    if (selectedZona !== 'todas') {
      filtered = filtered.filter((prop) =>
        prop.location?.toLowerCase().includes(selectedZona.toLowerCase())
      )
    }

    if (precioMax !== 'sin-limite') {
      if (precioMax === '300000') {
        filtered = filtered.filter((prop) => prop.price >= 300000)
      } else {
        const precioMaxNum = parseInt(precioMax)
        filtered = filtered.filter((prop) => prop.price <= precioMaxNum)
      }
    }

    if (sortBy === 'precio-asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'precio-desc') {
      filtered.sort((a, b) => b.price - a.price)
    }
    // 'recientes': la query ya viene ordenada por createdAt desc

    return filtered
  }, [properties, selectedType, selectedStatus, selectedZona, precioMax, sortBy])

  const clearFilters = () => {
    setSelectedType('all')
    setSelectedStatus('all')
    setSelectedZona('todas')
    setPrecioMax('sin-limite')
  }

  const activeFiltersCount =
    (selectedType !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (selectedZona !== 'todas' ? 1 : 0) +
    (precioMax !== 'sin-limite' ? 1 : 0)

  // Chips de tipo de propiedad, reutilizados en desktop y móvil
  const typeChips = (
    <>
      {propertyTypes.map((type) => {
        const active = selectedType === type.value
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => setSelectedType(type.value)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200',
              active
                ? 'border-green-600 bg-green-600 text-white shadow-sm shadow-green-600/30'
                : 'border-border bg-background text-muted-foreground hover:border-green-600/40 hover:text-foreground'
            )}
          >
            {type.label}
          </button>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Cabecera */}
      <div className="relative h-44 sm:h-52 md:h-64 overflow-hidden">
        <Image
          src="/clubnautico.jpg"
          alt="Propiedades en El Bierzo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/80 to-emerald-800/70" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-medium text-white mb-2 sm:mb-3">
              <MapPin className="w-3 h-3 text-green-300" />
              El Bierzo, León
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              Encuentra tu próxima{' '}
              <span className="bg-gradient-to-r from-green-200 to-emerald-300 bg-clip-text text-transparent">
                propiedad
              </span>
            </h1>
            <p className="text-white/80 text-xs sm:text-sm md:text-base">
              Pisos, casas, locales y más, en venta y alquiler
              <span className="ml-2 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">
                {properties.length} disponibles
              </span>
            </p>
          </div>

          <div className="hidden md:block">
            <div className="relative w-24 h-24 bg-white rounded-2xl p-2 shadow-xl">
              <Image
                src="/logo.jpg"
                alt="MR Soluciones Inmobiliarias"
                fill
                className="object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar de filtros: fija bajo el navbar mientras se navega el listado */}
      <div className="sticky top-16 md:top-20 z-30 bg-background/90 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          {/* Fila 1: operación + orden + filtros (móvil) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center rounded-full bg-muted p-1">
              {statusTabs.map((tab) => {
                const active = selectedStatus === tab.value
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setSelectedStatus(tab.value)}
                    className={cn(
                      'relative px-3 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 whitespace-nowrap',
                      active ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="propiedades-operacion"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 shadow-md shadow-green-600/30"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              {/* Ordenar */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-auto max-w-[11rem] rounded-full border-border/70 text-xs sm:text-sm gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-green-600/70 shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botón filtros (solo móvil) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden h-9 gap-1.5 rounded-full text-xs"
              >
                <Filter className="w-3.5 h-3.5" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
                {showFilters ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Fila 2 (desktop): tipo + zona + precio + limpiar */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0 py-0.5">
              {typeChips}
            </div>

            <Select value={selectedZona} onValueChange={setSelectedZona}>
              <SelectTrigger className="h-9 w-[11.5rem] shrink-0 rounded-full border-border/70 text-sm gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-green-600/70 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {zonas.map((zona) => (
                  <SelectItem key={zona.value} value={zona.value}>
                    {zona.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={precioMax} onValueChange={setPrecioMax}>
              <SelectTrigger className="h-9 w-[11rem] shrink-0 rounded-full border-border/70 text-sm gap-1.5">
                <Coins className="w-3.5 h-3.5 text-green-600/70 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {precios.map((precio) => (
                  <SelectItem key={precio.value} value={precio.value}>
                    {precio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="shrink-0 gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Panel móvil colapsable */}
          {showFilters && (
            <div className="md:hidden space-y-3 animate-in slide-in-from-top-2 duration-200 pb-1">
              <div className="flex flex-wrap gap-2">{typeChips}</div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedZona} onValueChange={setSelectedZona}>
                  <SelectTrigger className="h-10 rounded-xl border-border/70 text-xs gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-green-600/70 shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zonas.map((zona) => (
                      <SelectItem key={zona.value} value={zona.value}>
                        {zona.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={precioMax} onValueChange={setPrecioMax}>
                  <SelectTrigger className="h-10 rounded-xl border-border/70 text-xs gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-green-600/70 shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {precios.map((precio) => (
                      <SelectItem key={precio.value} value={precio.value}>
                        {precio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full gap-1.5 rounded-xl text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                  Limpiar todos los filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Contador + chips de filtros activos */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="font-bold text-foreground">{filteredProperties.length}</span>{' '}
            {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedType !== 'all' && (
                <FilterChip
                  label={propertyTypes.find((t) => t.value === selectedType)?.label || ''}
                  onRemove={() => setSelectedType('all')}
                />
              )}
              {selectedStatus !== 'all' && (
                <FilterChip
                  label={statusTabs.find((s) => s.value === selectedStatus)?.label || ''}
                  onRemove={() => setSelectedStatus('all')}
                />
              )}
              {selectedZona !== 'todas' && (
                <FilterChip
                  label={
                    zonas.find((z) => z.value === selectedZona)?.label ||
                    selectedZona.charAt(0).toUpperCase() + selectedZona.slice(1)
                  }
                  onRemove={() => setSelectedZona('todas')}
                />
              )}
              {precioMax !== 'sin-limite' && (
                <FilterChip
                  label={`Máx. ${formatPrecioDisplay(precioMax)}`}
                  onRemove={() => setPrecioMax('sin-limite')}
                />
              )}
            </div>
          )}
        </div>

        <PropertyGrid
          properties={filteredProperties}
          emptyMessage="No se encontraron propiedades con los filtros seleccionados"
          searchCriteria={{
            operacion: searchParams.get('operacion') || undefined,
            tipo: selectedType !== 'all' ? selectedType : undefined,
            zona: selectedZona !== 'todas' ? selectedZona : undefined,
            precioMax: precioMax !== 'sin-limite' ? precioMax : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
          }}
        />
      </div>
    </div>
  )
}

// Chip de filtro activo con botón de borrado
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-600/25 bg-green-50 pl-3 pr-1.5 py-1 text-xs font-medium text-green-800">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-green-600/15 transition-colors"
        aria-label={`Quitar filtro ${label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

export default function PropertiesClient({
  initialProperties,
}: {
  initialProperties: Property[]
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" aria-label="Cargando" />
        </div>
      }
    >
      <PropertiesContent properties={initialProperties} />
    </Suspense>
  )
}

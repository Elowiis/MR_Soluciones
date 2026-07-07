'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Property } from '@/types/property'
import { PropertyCard } from './PropertyCard'
import { PropertyAlertModal } from './PropertyAlertModal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Bell, SearchX } from 'lucide-react'

interface SearchCriteria {
  operacion?: string
  tipo?: string
  zona?: string
  precioMax?: string
  status?: string
}

interface PropertyGridProps {
  properties: Property[]
  className?: string
  loading?: boolean
  emptyMessage?: string
  searchCriteria?: SearchCriteria
}

export function PropertyGrid({
  properties,
  className,
  loading = false,
  emptyMessage = 'No se encontraron propiedades',
  searchCriteria = {},
}: PropertyGridProps) {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)

  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6', className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl ring-1 ring-gray-200/80 bg-white"
            aria-label="Cargando propiedad"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 animate-pulse bg-muted rounded-md" />
              <div className="h-4 w-1/2 animate-pulse bg-muted rounded-md" />
              <div className="flex gap-2">
                <div className="h-8 w-20 animate-pulse bg-muted rounded-lg" />
                <div className="h-8 w-20 animate-pulse bg-muted rounded-lg" />
                <div className="h-8 w-20 animate-pulse bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <>
        <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-gray-300 bg-gray-50/60 px-6 py-12 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
            <SearchX className="h-8 w-8 text-green-700" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">{emptyMessage}</p>
            <p className="text-sm text-muted-foreground">
              ¿Quieres que te avisemos cuando encontremos propiedades que coincidan con tu búsqueda?
            </p>
          </div>
          <Button
            onClick={() => setIsAlertModalOpen(true)}
            className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-green-600/25 px-7 py-6 h-auto transition-all duration-300 hover:shadow-xl hover:shadow-green-600/35"
          >
            <Bell className="w-5 h-5 mr-2" />
            Avísame
          </Button>
        </div>
        <PropertyAlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          searchCriteria={searchCriteria}
        />
      </>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6',
        className
      )}
      role="list"
      aria-label="Lista de propiedades"
    >
      {properties.map((property, index) => (
        <motion.div
          key={property._id}
          role="listitem"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          // Escalonado por columna, con tope para listas largas
          transition={{ duration: 0.45, delay: Math.min(index % 3, index) * 0.08, ease: 'easeOut' }}
          className="h-full"
        >
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </div>
  )
}

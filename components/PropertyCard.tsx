'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/types/property'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import { MapPin, Bed, Bath, Square, Star, ArrowRight } from 'lucide-react'

interface PropertyCardProps {
  property: Property
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Chip de estado: color propio por estado para lectura inmediata
const statusStyles: Record<Property['status'], { label: string; className: string }> = {
  'en venta': { label: 'En venta', className: 'bg-green-600 text-white' },
  alquiler: { label: 'Alquiler', className: 'bg-sky-600 text-white' },
  reservado: { label: 'Reservado', className: 'bg-amber-500 text-white' },
  vendido: { label: 'Vendido', className: 'bg-gray-900/85 text-white' },
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.mainImage?.asset
    ? urlFor(property.mainImage).width(600).height(400).url()
    : '/placeholder-property.jpg'

  const imageAlt = property.mainImage?.alt || property.title
  const status = statusStyles[property.status] ?? {
    label: property.status,
    className: 'bg-gray-700 text-white',
  }
  const isVendido = property.status === 'vendido'
  const isAlquiler = property.status === 'alquiler'

  return (
    <Link href={`/propiedades/${property.slug.current}`} className="group block h-full">
      <article className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-green-900/10 hover:ring-green-500/30 hover:-translate-y-1.5">
        {/* Imagen con precio y tipo superpuestos */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-105',
              isVendido && 'saturate-50'
            )}
            priority={false}
          />
          {/* Degradado inferior para legibilidad del precio */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          {/* Estado (arriba izquierda) */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-md',
                status.className
              )}
            >
              {status.label}
            </span>
          </div>

          {/* Destacado (arriba derecha) */}
          {property.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-md">
                <Star className="w-3 h-3 fill-amber-950" />
                Destacado
              </span>
            </div>
          )}

          {/* Precio + tipo (abajo, sobre la imagen) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <p className="text-white text-xl sm:text-2xl font-bold drop-shadow-md leading-none">
              {formatPrice(property.price)}
              {isAlquiler && (
                <span className="text-sm font-medium text-white/80"> /mes</span>
              )}
            </p>
            {property.propertyType && (
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm">
                {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col flex-1 gap-3 p-4 sm:p-5">
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-semibold leading-tight line-clamp-2 min-h-[2.5rem] text-gray-900 transition-colors group-hover:text-green-700">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-4 w-4 shrink-0 text-green-600/70" aria-hidden="true" />
              <span className="line-clamp-1">
                {property.location}
                {property.neighborhood && `, ${property.neighborhood}`}
              </span>
            </div>
          </div>

          {/* Specs en chips: lo que el visitante escanea primero */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <span
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1.5"
                aria-label={`${property.bedrooms} habitaciones`}
              >
                <Bed className="h-4 w-4 text-green-600/70" aria-hidden="true" />
                {property.bedrooms} hab.
              </span>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <span
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1.5"
                aria-label={`${property.bathrooms} baños`}
              >
                <Bath className="h-4 w-4 text-green-600/70" aria-hidden="true" />
                {property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}
              </span>
            )}
            <span
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1.5"
              aria-label={`${property.squareMeters} metros cuadrados`}
            >
              <Square className="h-4 w-4 text-green-600/70" aria-hidden="true" />
              {property.squareMeters} m²
            </span>
          </div>

          {/* Features extra, discretas */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {property.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="rounded-full border border-green-600/20 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 2 && (
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                  +{property.features.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Pie: CTA que responde al hover de toda la tarjeta */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-end">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700">
              Ver detalles
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

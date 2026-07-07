'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/types/property'
import { urlFor } from '@/sanity/lib/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Home, MapPin, Bed, Bath, Square } from 'lucide-react'

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

const getStatusBadgeVariant = (status: Property['status']) => {
  switch (status) {
    case 'en venta':
      return 'success'
    case 'vendido':
      return 'destructive'
    case 'reservado':
      return 'warning'
    default:
      return 'default'
  }
}

const getStatusLabel = (status: Property['status']) => {
  switch (status) {
    case 'en venta':
      return 'En Venta'
    case 'vendido':
      return 'Vendido'
    case 'reservado':
      return 'Reservado'
    case 'alquiler':
      return 'Alquiler'
    default:
      return status
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.mainImage?.asset
    ? urlFor(property.mainImage).width(600).height(400).url()
    : '/placeholder-property.jpg'

  const imageAlt = property.mainImage?.alt || property.title

  return (
    <Link href={`/propiedades/${property.slug.current}`} className="block h-full">
      <Card
        className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        hover="lift"
        interactive
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-110"
            priority={false}
          />
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 z-10">
            {property.isFeatured && (
              <Badge variant="gradient" className="shadow-lg text-xs sm:text-sm py-1 px-2">
                ⭐ Destacado
              </Badge>
            )}
            <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs sm:text-sm py-1 px-2">
              {getStatusLabel(property.status)}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="line-clamp-1 text-sm">
                {property.location}
                {property.neighborhood && `, ${property.neighborhood}`}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5" aria-label={`${property.bedrooms} habitaciones`}>
                <Bed className="h-4 w-4" aria-hidden="true" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5" aria-label={`${property.bathrooms} baños`}>
                <Bath className="h-4 w-4" aria-hidden="true" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5" aria-label={`${property.squareMeters} metros cuadrados`}>
              <Square className="h-4 w-4" aria-hidden="true" />
              <span>{property.squareMeters} m²</span>
            </div>
          </div>

          {property.propertyType && (
            <div className="flex items-center gap-1.5 text-sm">
              <Home className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Badge variant="outline" size="sm">
                {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
              </Badge>
            </div>
          )}

          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {property.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{property.features.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}


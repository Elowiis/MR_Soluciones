import { notFound } from 'next/navigation'
import Link from 'next/link'
import { clientForISR } from '@/sanity/lib/client'
import { getPropertyBySlug, getAllProperties } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Property } from '@/types/property'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Home, 
  MessageCircle,
  CheckCircle2
} from 'lucide-react'
import { PortableText } from '@/lib/portable-text'
import type { Metadata } from 'next'
import { PropertyGallery } from '@/components/PropertyGallery'
import { PropertyMap } from '@/components/PropertyMap'

interface PageProps {
  params: Promise<{ slug: string }>
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
    default:
      return status
  }
}


export async function generateStaticParams() {
  const properties = await clientForISR.fetch<Property[]>(getAllProperties)
  
  return properties.map((property) => ({
    slug: property.slug.current,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await clientForISR.fetch<Property | null>(
    getPropertyBySlug,
    { slug }
  )

  if (!property) {
    return {
      title: 'Propiedad no encontrada',
    }
  }

  const imageUrl = property.mainImage?.asset
    ? urlFor(property.mainImage).width(1200).height(630).url()
    : undefined

  // Extraer texto del contenido portable text para la descripción
  let description = `Propiedad en ${property.location} - ${property.squareMeters}m²`
  if (property.description && Array.isArray(property.description)) {
    const textBlocks = property.description
      .filter((block: any) => block._type === 'block' && block.children)
      .map((block: any) =>
        block.children
          .map((child: any) => child.text || '')
          .join('')
      )
      .join(' ')
      .trim()
    
    if (textBlocks) {
      description = textBlocks.slice(0, 160) + (textBlocks.length > 160 ? '...' : '')
    }
  }

  return {
    title: `${property.title} - ${formatPrice(property.price)}`,
    description,
    openGraph: {
      title: property.title,
      description: `Propiedad en ${property.location} - ${formatPrice(property.price)}`,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params
  const property = await clientForISR.fetch<Property | null>(
    getPropertyBySlug,
    { slug }
  )

  if (!property) {
    notFound()
  }

  const mainImageUrl = property.mainImage?.asset
    ? urlFor(property.mainImage).width(1200).height(800).url()
    : '/placeholder-property.jpg'

  const galleryImages = property.gallery?.map((img) => ({
    url: urlFor(img).width(800).height(600).url(),
    alt: img.alt || property.title,
  })) || []

  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado en la propiedad: ${property.title} - ${property.location}`
  )
  const whatsappUrl = `https://wa.me/573000000000?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-background">
      {/* Header con botón volver */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Link href="/propiedades">
            <Button variant="ghost" className="gap-2 text-sm sm:text-base min-h-[44px]">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver a propiedades</span>
              <span className="sm:hidden">Volver</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-20 md:pb-8">
        {/* Título y badges */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {property.isFeatured && (
              <Badge variant="gradient">⭐ Destacado</Badge>
            )}
            <Badge variant={getStatusBadgeVariant(property.status)}>
              {getStatusLabel(property.status)}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Home className="w-3 h-3" />
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">{property.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mb-3 sm:mb-4">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base md:text-lg">
              {property.location}
              {property.neighborhood && `, ${property.neighborhood}`}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Galería de imágenes */}
        <PropertyGallery
          mainImage={{
            url: mainImageUrl,
            alt: property.mainImage?.alt || property.title,
          }}
          gallery={galleryImages}
        />

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Características principales */}
            <div className="bg-card rounded-lg border p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {property.bedrooms !== undefined && property.bedrooms > 0 && (
                  <div className="flex flex-col items-center gap-2">
                    <Bed className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Habitaciones</div>
                    </div>
                  </div>
                )}
                {property.bathrooms !== undefined && property.bathrooms > 0 && (
                  <div className="flex flex-col items-center gap-2">
                    <Bath className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Baños</div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <Square className="w-8 h-8 text-primary" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">{property.squareMeters}</div>
                    <div className="text-sm text-muted-foreground">m²</div>
                  </div>
                </div>
                {property.propertyType && (
                  <div className="flex flex-col items-center gap-2">
                    <Home className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="text-lg font-bold capitalize">{property.propertyType}</div>
                      <div className="text-sm text-muted-foreground">Tipo</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {property.description && (
              <div className="bg-card rounded-lg border p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Descripción</h2>
                <div className="prose prose-slate max-w-none text-sm sm:text-base">
                  <PortableText value={property.description} />
                </div>
              </div>
            )}

            {/* Características adicionales */}
            {property.features && property.features.length > 0 && (
              <div className="bg-card rounded-lg border p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Características adicionales</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="capitalize">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ubicación en el mapa */}
            {property.geoLocation && property.geoLocation.lat && property.geoLocation.lng && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
                <PropertyMap lat={property.geoLocation.lat} lng={property.geoLocation.lng} />
              </div>
            )}
          </div>

          {/* Sidebar con botón de contacto */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-4 sm:p-6 sticky top-20 md:top-24">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">¿Interesado en esta propiedad?</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Contáctanos para más información o agendar una visita
              </p>
              <div className="space-y-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 min-h-[44px] text-sm sm:text-base">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Contactar por WhatsApp
                  </Button>
                </a>
                <Link href="/#lead-form">
                  <Button variant="outline" className="w-full min-h-[44px] text-sm sm:text-base">
                    Solicitar información
                  </Button>
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t space-y-3 text-sm">
                <div>
                  <div className="font-semibold mb-1">Ubicación</div>
                  <div className="text-muted-foreground">
                    {property.location}
                    {property.neighborhood && `, ${property.neighborhood}`}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Estado</div>
                  <Badge variant={getStatusBadgeVariant(property.status)}>
                    {getStatusLabel(property.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Fijo Móvil */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background border-t border-border p-4 shadow-lg">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 min-h-[44px] text-base font-semibold">
            <MessageCircle className="w-5 h-5" />
            Contactar por WhatsApp
          </Button>
        </a>
      </div>
    </div>
  )
}


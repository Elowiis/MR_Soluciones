import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProperties, getPropertyBySlug } from '@/lib/inmovilla/queries'
import type { Property, PropertyStatus } from '@/types/property'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Home,
  MessageCircle,
  CheckCircle2,
  Star,
  FileText,
  Sparkles,
} from 'lucide-react'
import { PropertyGallery } from '@/components/PropertyGallery'
import { PropertyMap } from '@/components/PropertyMap'

interface PageProps {
  params: Promise<{ slug: string }>
}

// El importador corre una vez al día: 60 s de desfase máximo es suficiente.
export const revalidate = 60

// Explícito aunque sea el valor por defecto: una propiedad nueva genera su
// página bajo demanda sin esperar al siguiente deploy.
export const dynamicParams = true

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Chip de estado con color semántico (mismo lenguaje que PropertyCard)
const statusStyles: Record<PropertyStatus, { label: string; className: string }> = {
  'en venta': { label: 'En venta', className: 'bg-green-600 text-white' },
  alquiler: { label: 'Alquiler', className: 'bg-sky-600 text-white' },
}

function priceLabel(property: Property): string {
  return property.price == null ? 'Consultar precio' : formatPrice(property.price)
}

function detailRows(property: Property): { label: string; value: string }[] {
  const rows: { label: string; value: string | number | null }[] = [
    { label: 'Referencia', value: property.referencia },
    { label: 'Conservación', value: property.conservacion },
    { label: 'Orientación', value: property.orientacion },
    { label: 'Año de construcción', value: property.anyoConstruccion },
    { label: 'Planta', value: property.planta },
    { label: 'Superficie útil', value: property.usableSquareMeters != null ? `${property.usableSquareMeters} m²` : null },
    { label: 'Parcela', value: property.plotSquareMeters != null ? `${property.plotSquareMeters} m²` : null },
    { label: 'Habitaciones simples', value: property.singleBedrooms },
    { label: 'Habitaciones dobles', value: property.doubleBedrooms },
    { label: 'Aseos', value: property.toilets },
    { label: 'Cocina', value: property.tipoCocina },
    { label: 'Electrodomésticos', value: property.electrodomesticos },
    { label: 'Parking', value: property.parking },
    { label: 'Garaje', value: property.plazaGaraje },
    { label: 'Exterior / interior', value: property.exteriorInterior },
    { label: 'Certificado energético', value: property.energiaLetra },
    { label: 'Código postal', value: property.postalCode },
  ]
  return rows
    .filter((row) => row.value != null && row.value !== '')
    .map((row) => ({ label: row.label, value: String(row.value) }))
}

export async function generateStaticParams() {
  // getProperties ya captura los fallos de Supabase, pero un build no debe
  // romperse por nada: sin rutas pregeneradas, dynamicParams las resuelve.
  try {
    const properties = await getProperties()
    return properties.map((property) => ({ slug: property.slug }))
  } catch (error) {
    console.error('[propiedades] generateStaticParams sin rutas:', error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    return {
      title: 'Propiedad no encontrada',
    }
  }

  const priceText = priceLabel(property)
  const plain = property.description?.replace(/\s+/g, ' ').trim()
  const description = plain
    ? plain.slice(0, 160) + (plain.length > 160 ? '...' : '')
    : `Propiedad en ${property.location}`

  return {
    title: `${property.title} - ${priceText}`,
    description,
    openGraph: {
      title: property.title,
      description: `Propiedad en ${property.location} - ${priceText}`,
      images: property.mainImageUrl ? [{ url: property.mainImageUrl }] : [],
    },
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  const mainImageUrl = property.mainImageUrl ?? '/placeholder-property.jpg'
  const priceText = priceLabel(property)
  const rentText = property.rentPrice != null ? formatPrice(property.rentPrice) : null
  const details = detailRows(property)

  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado en la propiedad: ${property.title} - ${property.location}`
  )
  const whatsappUrl = `https://wa.me/34638441042?text=${whatsappMessage}`

  const status = statusStyles[property.status]
  const isAlquiler = property.status === 'alquiler'
  const pricePerM2 =
    !isAlquiler && property.price != null && property.squareMeters != null && property.squareMeters > 0
      ? Math.round(property.price / property.squareMeters)
      : null

  return (
    <div className="min-h-screen bg-background">
      {/* Barra sticky: volver + precio siempre a la vista (queda bajo el navbar) */}
      <div className="sticky top-16 md:top-20 z-30 bg-background/90 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a propiedades</span>
            <span className="sm:hidden">Volver</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                status.className
              )}
            >
              {status.label}
            </span>
            <span className="text-base sm:text-lg font-bold text-green-700">
              {priceText}
              {isAlquiler && <span className="text-xs font-medium text-muted-foreground">/mes</span>}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-24 lg:pb-8">
        {/* Cabecera: título/ubicación a la izquierda, precio a la derecha */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm',
                  status.className
                )}
              >
                {status.label}
              </span>
              {property.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-sm">
                  <Star className="w-3 h-3 fill-amber-950" />
                  Destacado
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Home className="w-3 h-3" />
                {property.propertyType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-balance">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600/70" />
              <span className="text-sm sm:text-base md:text-lg">
                {property.location}
                {property.neighborhood && `, ${property.neighborhood}`}
              </span>
            </div>
          </div>

          <div className="md:text-right shrink-0">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              {priceText}
              {isAlquiler && <span className="text-lg font-semibold">/mes</span>}
            </div>
            {pricePerM2 && (
              <p className="text-sm text-muted-foreground mt-1">
                {new Intl.NumberFormat('es-ES').format(pricePerM2)} €/m²
              </p>
            )}
            {rentText && (
              <p className="text-sm text-muted-foreground mt-1">
                o {rentText}/mes en alquiler
              </p>
            )}
          </div>
        </div>

        {/* Galería de imágenes */}
        <PropertyGallery
          mainImage={{ url: mainImageUrl, alt: property.title }}
          gallery={property.gallery}
        />

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Características principales: tiles con icono */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {property.bedrooms != null && property.bedrooms > 0 && (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                    <Bed className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold leading-none">{property.bedrooms}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">Habitaciones</div>
                  </div>
                </div>
              )}
              {property.bathrooms != null && property.bathrooms > 0 && (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                    <Bath className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold leading-none">{property.bathrooms}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {property.bathrooms === 1 ? 'Baño' : 'Baños'}
                    </div>
                  </div>
                </div>
              )}
              {property.squareMeters != null && (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                    <Square className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold leading-none">{property.squareMeters}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">m²</div>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <Home className="w-5 h-5 text-green-700" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg font-bold leading-none">{property.propertyType}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Tipo</div>
                </div>
              </div>
            </div>

            {/* Descripción: texto plano con saltos de línea */}
            {property.description && (
              <div className="bg-card rounded-2xl border border-border/70 p-5 sm:p-7">
                <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <FileText className="w-4 h-4 text-green-700" />
                  </span>
                  Descripción
                </h2>
                <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-foreground/90">
                  {property.description}
                </p>
              </div>
            )}

            {/* Características adicionales */}
            {property.features.length > 0 && (
              <div className="bg-card rounded-2xl border border-border/70 p-5 sm:p-7">
                <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <Sparkles className="w-4 h-4 text-green-700" />
                  </span>
                  Características adicionales
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {property.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 rounded-xl bg-green-50/60 border border-green-600/10 px-3 py-2.5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ubicación en el mapa */}
            {property.geoLocation && (
              <div className="bg-card rounded-2xl border border-border/70 p-5 sm:p-7">
                <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <MapPin className="w-4 h-4 text-green-700" />
                  </span>
                  Ubicación
                </h2>
                <div className="overflow-hidden rounded-xl">
                  <PropertyMap lat={property.geoLocation.lat} lng={property.geoLocation.lng} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar de contacto */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden bg-card rounded-2xl border border-border/70 shadow-sm sticky top-32 md:top-36">
              {/* Recap de precio */}
              <div className="bg-gradient-to-br from-green-700 to-emerald-600 px-5 sm:px-6 py-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-100 mb-1">
                  {isAlquiler ? 'Alquiler mensual' : 'Precio de venta'}
                </p>
                <p className="text-2xl sm:text-3xl font-bold leading-none">
                  {priceText}
                  {isAlquiler && <span className="text-base font-medium text-green-100">/mes</span>}
                </p>
                {pricePerM2 && (
                  <p className="text-sm text-green-100/90 mt-1.5">
                    {new Intl.NumberFormat('es-ES').format(pricePerM2)} €/m²
                  </p>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2">¿Te interesa esta propiedad?</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Escríbenos para más información o para agendar una visita, sin compromiso
                </p>
                <div className="space-y-3">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/35 min-h-[46px] text-sm sm:text-base font-semibold transition-all duration-300">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Contactar por WhatsApp
                    </Button>
                  </a>
                  <Link href="/#lead-form" className="block">
                    <Button
                      variant="outline"
                      className="w-full rounded-full min-h-[46px] text-sm sm:text-base border-green-600/30 text-green-700 hover:bg-green-50 hover:border-green-600/50"
                    >
                      Solicitar información
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-border/70 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Ubicación</span>
                    <span className="font-medium text-right">
                      {property.location}
                      {property.neighborhood && `, ${property.neighborhood}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Estado</span>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                        status.className
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  {details.map((detail) => (
                    <div key={detail.label} className="flex items-start justify-between gap-3">
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className="font-medium text-right">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra fija móvil: precio + WhatsApp */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-none mb-0.5">
              {isAlquiler ? 'Alquiler /mes' : 'Precio'}
            </p>
            <p className="text-lg font-bold text-green-700 leading-none truncate">
              {priceText}
            </p>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 min-h-[46px] text-sm font-semibold shadow-lg shadow-green-600/25">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

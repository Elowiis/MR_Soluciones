export type PropertyStatus = 'en venta' | 'alquiler'

export interface PropertyImage {
  url: string
  alt: string
}

/**
 * Propiedad tal y como la sirve la web. Única fuente: Supabase, alimentada por
 * el XML de Inmovilla. Imágenes como URL absoluta, descripción en texto plano
 * con saltos `\n`, tipo de inmueble como texto libre.
 */
export interface Property {
  id: string
  referencia: string
  title: string
  slug: string
  mainImageUrl: string | null
  gallery: PropertyImage[]
  /** Precio principal según `accion`; null si Inmovilla no lo informa. */
  price: number | null
  /** Solo en 'Vender o Alquilar': precio de alquiler además del de venta. */
  rentPrice: number | null
  accion: string
  status: PropertyStatus
  location: string
  neighborhood: string | null
  postalCode: string | null
  geoLocation: { lat: number; lng: number } | null
  bedrooms: number | null
  singleBedrooms: number | null
  doubleBedrooms: number | null
  bathrooms: number | null
  toilets: number | null
  squareMeters: number | null
  usableSquareMeters: number | null
  plotSquareMeters: number | null
  description: string | null
  features: string[]
  propertyType: string
  isFeatured: boolean
  conservacion: string | null
  orientacion: string | null
  anyoConstruccion: number | null
  planta: number | null
  tipoCocina: string | null
  parking: string | null
  plazaGaraje: string | null
  exteriorInterior: string | null
  electrodomesticos: string | null
  energiaLetra: string | null
  energiaValor: number | null
  createdAt: string
}

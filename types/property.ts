import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface SanityImage {
  asset: {
    _ref?: string
    _type?: string
  }
  alt?: string
}

export interface Property {
  _id: string
  title: string
  slug: {
    current: string
  }
  mainImage: SanityImage
  gallery?: SanityImage[]
  price: number
  location: string
  neighborhood?: string
  geoLocation?: { lat: number; lng: number } | null
  bedrooms?: number
  bathrooms?: number
  squareMeters: number
  description?: any // Portable text (blockContent) from Sanity
  features?: string[]
  propertyType: 'piso' | 'casa' | 'chalet' | 'ático' | 'garaje' | 'estudio' | 'local' | 'oficina' | 'terreno'
  status: 'en venta' | 'vendido' | 'reservado' | 'alquiler'
  isFeatured?: boolean
  createdAt: string
}

export type PropertyType = Property['propertyType']
export type PropertyStatus = Property['status']


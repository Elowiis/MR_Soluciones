import type { Metadata } from 'next'
import { clientForISR } from '@/sanity/lib/client'
import { getAllProperties } from '@/sanity/lib/queries'
import type { Property } from '@/types/property'
import PropertiesClient from './PropertiesClient'

// Red de seguridad si el webhook de Sanity no está configurado o falla:
// como mucho 60 s de desfase. Con el webhook la purga es instantánea.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Propiedades en El Bierzo',
  description:
    'Pisos, casas, locales y más, en venta y alquiler en Ponferrada y toda la comarca del Bierzo.',
}

export default async function PropertiesPage() {
  // Fetch en servidor (SSR + SEO). Cacheado con el tag 'property', que
  // /api/revalidate invalida en cuanto se toca una propiedad en el Studio.
  const properties = await clientForISR.fetch<Property[]>(
    getAllProperties,
    {},
    { next: { revalidate: 60, tags: ['property'] } }
  )

  return <PropertiesClient initialProperties={properties} />
}

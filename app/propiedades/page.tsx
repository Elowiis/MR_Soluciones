import type { Metadata } from 'next'
import { getProperties } from '@/lib/inmovilla/queries'
import PropertiesClient from './PropertiesClient'

// El importador corre una vez al día: 60 s de desfase máximo es suficiente.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Propiedades en El Bierzo',
  description:
    'Pisos, casas, locales y más, en venta y alquiler en Ponferrada y toda la comarca del Bierzo.',
}

export default async function PropertiesPage() {
  // Si Supabase falla, getProperties devuelve [] y la página pinta el estado vacío.
  const properties = await getProperties()

  return <PropertiesClient initialProperties={properties} />
}

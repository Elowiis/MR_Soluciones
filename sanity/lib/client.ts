import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Cliente para uso general con CDN (mejor rendimiento)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: false,
  },
})

// Cliente para ISR/revalidación (sin CDN para datos siempre actualizados)
export const clientForISR = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Sin CDN para ISR/revalidación
  perspective: 'published',
  stega: {
    enabled: false,
  },
})

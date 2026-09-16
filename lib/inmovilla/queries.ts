import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Property } from '@/types/property'
import {
  COLUMNAS_EXTRAS,
  COLUMNAS_PROPIEDAD,
  toProperty,
  type FilaPropiedadConExtras,
} from './adapter'

const HOME_LIMIT = 6

// Cliente anon: respeta el RLS, que solo permite leer `activa = true`.
// La service_role queda reservada al importador y nunca llega aquí.
let anon: SupabaseClient | null = null

function getSupabaseAnon(): SupabaseClient {
  if (anon) return anon

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  anon = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      // Red de seguridad de 60 s: el importador corre una vez al día.
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: 60, tags: ['inmovilla'] } }),
    },
  })
  return anon
}

const SELECT = [
  ...COLUMNAS_PROPIEDAD,
  ...Object.keys(COLUMNAS_EXTRAS),
  'propiedad_fotos(orden,url,etiqueta)',
].join(',')

/**
 * Todas las propiedades activas con sus fotos, más recientes primero.
 * Si Supabase falla por lo que sea, devuelve [] para que la página pinte un
 * estado vacío en vez de reventar.
 */
export async function getProperties(): Promise<Property[]> {
  try {
    const { data, error } = await getSupabaseAnon()
      .from('propiedades')
      .select(SELECT)
      .eq('activa', true)
      .order('fecha_importacion', { ascending: false })
      .order('orden', { referencedTable: 'propiedad_fotos', ascending: true })

    if (error) throw new Error(error.message)

    return ((data ?? []) as unknown as FilaPropiedadConExtras[]).map(toProperty)
  } catch (error) {
    console.error('[inmovilla] No se pudieron leer las propiedades de Supabase:', error)
    return []
  }
}

/**
 * Busca por slug entre las activas. Comparte la entrada de caché de la
 * lista, así que no supone una consulta extra en la mayoría de casos.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const properties = await getProperties()
  return properties.find((property) => property.slug === slug) ?? null
}

/** Para la home: destacadas primero y, detrás, las más recientes; máximo 6. */
export async function getHomeProperties(): Promise<Property[]> {
  const properties = await getProperties()
  return [...properties]
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, HOME_LIMIT)
}

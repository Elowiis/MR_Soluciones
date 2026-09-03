import { curatedReviews } from '@/lib/curated-reviews'

// Este módulo solo debe usarse desde Server Components / rutas de API:
// lee la API key de variables de entorno sin prefijo NEXT_PUBLIC_.
const PLACES_BASE = 'https://places.googleapis.com/v1'

// Google permite cachear contenido de Places hasta 30 días. Refrescamos a diario.
const REVALIDATE_SECONDS = 60 * 60 * 24

export interface GoogleReview {
  id: string
  rating: number
  text: string
  relativeTime: string
  authorName: string
  authorPhoto?: string
  authorUri?: string
}

/**
 * Reseña copiada a mano en lib/curated-reviews.ts.
 *
 * Guarda la fecha absoluta en vez del texto "Hace N meses": ese texto se
 * calcula en cada render, así que envejece solo y nunca se queda congelado.
 */
export type CuratedReview = Omit<GoogleReview, 'relativeTime'> & {
  /** Fecha aproximada de publicación en formato ISO (YYYY-MM-DD). */
  publishedAt: string
}

export interface GooglePlaceReviews {
  rating: number
  totalRatings: number
  /** Enlace a la ficha del negocio en Google Maps. */
  googleMapsUri: string
  /** Enlace directo a la pestaña de reseñas. */
  reviewsUri: string
  /** Enlace directo al formulario de Google para escribir una reseña. */
  writeReviewUri: string
  reviews: GoogleReview[]
}

/** Número máximo de reseñas que se muestran en la web (grid simétrico 3x2 en desktop). */
const MAX_REVIEWS = 6

interface PlacesApiReview {
  name?: string
  rating?: number
  relativePublishTimeDescription?: string
  text?: { text?: string }
  originalText?: { text?: string }
  authorAttribution?: {
    displayName?: string
    photoUri?: string
    uri?: string
  }
}

interface PlacesApiPlace {
  id?: string
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  googleMapsLinks?: {
    placeUri?: string
    reviewsUri?: string
    writeAReviewUri?: string
  }
  reviews?: PlacesApiReview[]
}

/**
 * Convierte una fecha en el texto relativo que usa Google en español
 * ("Hace 3 meses", "Hace un año"...). Se recalcula en cada render, por lo que
 * las reseñas manuales envejecen solas sin tocar el código.
 */
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim())
  if (!match) return ''

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return ''

  // Comparamos días de calendario, no instantes: así el resultado no depende
  // de la hora ni de la zona horaria del servidor.
  const published = Date.UTC(year, month - 1, day)
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())

  const days = Math.floor((today - published) / 86_400_000)
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`

  let months = (now.getFullYear() - year) * 12 + (now.getMonth() - (month - 1))
  // Aún no se ha cumplido el mes si no hemos llegado al día del aniversario.
  if (now.getDate() < day) months -= 1

  // Menos de un mes cumplido: Google habla en semanas.
  if (months < 1) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'Hace una semana' : `Hace ${weeks} semanas`
  }

  if (months < 12) return months === 1 ? 'Hace un mes' : `Hace ${months} meses`

  const years = Math.floor(months / 12)
  return years === 1 ? 'Hace un año' : `Hace ${years} años`
}

/** Añade el texto relativo, calculado ahora mismo, a una reseña manual. */
function withRelativeTime({ publishedAt, ...review }: CuratedReview): GoogleReview {
  return { ...review, relativeTime: formatRelativeTime(publishedAt) }
}

function getApiKey(): string | undefined {
  return process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
}

/**
 * Resuelve el Place ID a partir de una búsqueda de texto.
 * Solo se usa si no está definido GOOGLE_PLACE_ID, y el resultado se cachea
 * de forma indefinida porque los Place IDs son estables.
 */
async function resolvePlaceId(apiKey: string, query: string): Promise<string | null> {
  const response = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'es' }),
    next: { revalidate: false, tags: ['google-place-id'] },
  })

  if (!response.ok) {
    console.error('[google-reviews] searchText falló:', response.status, await response.text())
    return null
  }

  const data = (await response.json()) as { places?: PlacesApiPlace[] }
  return data.places?.[0]?.id ?? null
}

/**
 * Devuelve la valoración global y las reseñas destacadas del negocio en Google.
 *
 * La API de Places devuelve como máximo 5 reseñas (las que Google considera
 * más relevantes), no el total del perfil.
 *
 * Devuelve null ante cualquier fallo para que la sección simplemente no se
 * renderice en vez de romper la página.
 */
export async function getGoogleReviews(): Promise<GooglePlaceReviews | null> {
  const apiKey = getApiKey()

  if (!apiKey) {
    console.warn('[google-reviews] Falta GOOGLE_PLACES_API_KEY')
    return null
  }

  try {
    const placeId =
      process.env.GOOGLE_PLACE_ID ||
      (await resolvePlaceId(
        apiKey,
        process.env.GOOGLE_PLACE_QUERY || 'M R Soluciones Inmobiliarias Ponferrada'
      ))

    if (!placeId) {
      console.warn('[google-reviews] No se pudo resolver el Place ID')
      return null
    }

    const response = await fetch(`${PLACES_BASE}/places/${placeId}?languageCode=es`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,rating,userRatingCount,googleMapsUri,googleMapsLinks,reviews',
      },
      next: { revalidate: REVALIDATE_SECONDS, tags: ['google-reviews'] },
    })

    if (!response.ok) {
      console.error('[google-reviews] places.get falló:', response.status, await response.text())
      return null
    }

    const place = (await response.json()) as PlacesApiPlace

    const apiReviews: GoogleReview[] = (place.reviews ?? [])
      .map((review, index) => ({
        id: review.name ?? `review-${index}`,
        rating: review.rating ?? 5,
        text: review.text?.text ?? review.originalText?.text ?? '',
        relativeTime: review.relativePublishTimeDescription ?? '',
        authorName: review.authorAttribution?.displayName ?? 'Cliente de Google',
        authorPhoto: review.authorAttribution?.photoUri,
        authorUri: review.authorAttribution?.uri,
      }))
      .filter((review) => review.text.length > 0)

    // Ojo: el campo `reviews` pertenece al SKU Places API Enterprise + Atmosphere.
    // Si el proyecto no tiene acceso, Google lo omite sin devolver error y solo
    // llegan la valoración global y el número de reseñas. En ese caso usamos las
    // reseñas copiadas manualmente en lib/curated-reviews.ts, si las hay.
    const source = apiReviews.length > 0 ? apiReviews : curatedReviews.map(withRelativeTime)

    // Las mejor valoradas primero, y como mucho MAX_REVIEWS.
    const reviews = [...source].sort((a, b) => b.rating - a.rating).slice(0, MAX_REVIEWS)

    if (!place.rating || !place.userRatingCount) return null

    const links = place.googleMapsLinks
    const mapsUri = place.googleMapsUri ?? links?.placeUri ?? ''

    return {
      rating: place.rating ?? 0,
      totalRatings: place.userRatingCount ?? 0,
      googleMapsUri: mapsUri,
      reviewsUri: links?.reviewsUri ?? mapsUri,
      writeReviewUri:
        links?.writeAReviewUri ??
        (placeId ? `https://search.google.com/local/writereview?placeid=${placeId}` : ''),
      reviews,
    }
  } catch (error) {
    console.error('[google-reviews] Error inesperado:', error)
    return null
  }
}

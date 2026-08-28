import { getGoogleReviews } from "@/lib/google-reviews"
import { GoogleReviewsGrid } from "@/components/GoogleReviewsGrid"

/**
 * Server Component: obtiene las reseñas de Google en el servidor (la API key
 * nunca llega al navegador) y las pasa al grid interactivo.
 *
 * Si la API falla o no está configurada, la sección no se renderiza.
 */
export async function GoogleReviewsSection() {
  const data = await getGoogleReviews()

  if (!data) return null

  return <GoogleReviewsGrid data={data} />
}

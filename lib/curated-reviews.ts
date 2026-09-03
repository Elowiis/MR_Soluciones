import type { CuratedReview } from '@/lib/google-reviews'

/**
 * Reseñas copiadas a mano desde el perfil de Google del negocio.
 *
 * Solo se usan cuando la Places API no devuelve reseñas (el campo `reviews`
 * pertenece al SKU "Enterprise + Atmosphere" y hoy está bloqueado en el
 * proyecto de Google Cloud). En cuanto Google lo desbloquee, las reseñas de la
 * API tienen prioridad y este archivo deja de usarse automáticamente.
 *
 * Se muestran las 5 mejor valoradas, ordenadas por puntuación.
 *
 * Cómo rellenarlo:
 *   1. Abrir el perfil de Google del negocio → pestaña "Reseñas".
 *   2. Copiar textualmente el nombre del autor y el texto de la reseña.
 *      No reescribir ni inventar el contenido: son opiniones reales de clientes.
 *   3. Anotar la fecha de publicación en `publishedAt` (YYYY-MM-DD). El texto
 *      relativo ("Hace 3 meses") se calcula en cada render, así que las reseñas
 *      envejecen solas sin tocar el código.
 *   4. Añadir un objeto por reseña siguiendo los ejemplos de abajo.
 */
export const curatedReviews: CuratedReview[] = [
  {
    id: 'curated-alicia-cp',
    authorName: 'Alicia C.P.',
    rating: 5,
    publishedAt: '2026-05-28',
    text: 'Quiero destacar el excelente trabajo de Manuel. Desde el primer momento mostró gran profesionalidad y cercanía. Nos acompañó en todo el proceso resolviendo dudas rápidamente y haciendo que todo fuera mucho más fácil de lo esperado. Muy agradecidas.',
  },
  {
    id: 'curated-gemma-gl',
    authorName: 'Gemma G.L',
    rating: 5,
    publishedAt: '2026-06-28',
    text: 'Manuel es maravilloso, solo nos hizo falta ver dos casas para coger una de ellas, supo lo que queríamos enseguida y su trato insuperable. Tengo que decir que es totalmente transparente en la cuestión del contrato y te lo explica todo al dedillo. Gracias Manuel.',
  },
  {
    id: 'curated-cristina-sanchez',
    authorName: 'Cristina Sanchez',
    rating: 5,
    publishedAt: '2026-06-28',
    text: 'Manuel es muy profesional,rápido y eficaz,además de ser familiar y ayuda en todo lo que puede, no podría estar más contenta con esta inmobiliaria. 100% recomendable.',
  },
  {
    id: 'curated-oscar-villa',
    authorName: 'Oscar Villa',
    rating: 5,
    publishedAt: '2026-06-28',
    text: 'Desde mi experiencia como comprador, el acompañamiento ha sido excelente en todo momento. La transparencia, la calidad de la gestión y la profesionalidad demostrada, tanto antes como después de la compra, han sido excepcionales.',
  },
  {
    id: 'curated-elena-bd',
    authorName: 'Elena BD',
    rating: 5,
    publishedAt: '2026-03-28',
    text: 'Un 10/10. Inmobiliaria de total confianza. Manuel es un chico profesional, que transmite seguridad y muy eficiente. Además, es muy simpático. Volvería a contactar con ellos sin duda!',
  },
]

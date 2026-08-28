import type { GoogleReview } from '@/lib/google-reviews'

/**
 * Reseñas copiadas a mano desde el perfil de Google del negocio.
 *
 * Solo se usan cuando la Places API no devuelve reseñas (el campo `reviews`
 * pertenece al SKU "Enterprise + Atmosphere" y hoy está bloqueado en el
 * proyecto de Google Cloud). En cuanto Google lo desbloquee, las reseñas de la
 * API tienen prioridad y este archivo deja de usarse automáticamente.
 *
 * Se muestran las 6 mejor valoradas, ordenadas por puntuación (grid 3x2 en desktop).
 *
 * Cómo rellenarlo:
 *   1. Abrir el perfil de Google del negocio → pestaña "Reseñas".
 *   2. Copiar textualmente el nombre del autor y el texto de la reseña.
 *      No reescribir ni inventar el contenido: son opiniones reales de clientes.
 *   3. Añadir un objeto por reseña siguiendo el ejemplo comentado de abajo.
 */
export const curatedReviews: GoogleReview[] = [
  {
    id: 'curated-alicia-cp',
    authorName: 'Alicia C.P.',
    rating: 5,
    relativeTime: 'Hace 3 meses',
    text: 'Quiero destacar el excelente trabajo de Manuel. Desde el primer momento mostró gran profesionalidad y cercanía. Nos acompañó en todo el proceso resolviendo dudas rápidamente y haciendo que todo fuera mucho más fácil de lo esperado. Muy agradecidas.',
  },
  {
    id: 'curated-gemma-gl',
    authorName: 'Gemma G.L',
    rating: 5,
    relativeTime: 'Hace 2 meses',
    text: 'Manuel es maravilloso, solo nos hizo falta ver dos casas para coger una de ellas, supo lo que queríamos enseguida y su trato insuperable. Tengo que decir que es totalmente transparente en la cuestión del contrato y te lo explica todo al dedillo. Gracias Manuel.',
  },
  {
    id: 'curated-cristina-sanchez',
    authorName: 'Cristina Sanchez',
    rating: 5,
    relativeTime: 'Hace 2 meses',
    text: 'Manuel es muy profesional,rápido y eficaz,además de ser familiar y ayuda en todo lo que puede, no podría estar más contenta con esta inmobiliaria. 100% recomendable.',
  },
  {
    id: 'curated-oscar-villa',
    authorName: 'Oscar Villa',
    rating: 5,
    relativeTime: 'Hace 2 meses',
    text: 'Desde mi experiencia como comprador, el acompañamiento ha sido excelente en todo momento. La transparencia, la calidad de la gestión y la profesionalidad demostrada, tanto antes como después de la compra, han sido excepcionales.',
  },
  {
    id: 'curated-elena-bd',
    authorName: 'Elena BD',
    rating: 5,
    relativeTime: 'Hace 5 meses',
    text: 'Un 10/10. Inmobiliaria de total confianza. Manuel es un chico profesional, que transmite seguridad y muy eficiente. Además, es muy simpático. Volvería a contactar con ellos sin duda!',
  },
  {
    id: 'curated-clara-canedo',
    authorName: 'Clara Canedo',
    rating: 5,
    relativeTime: 'Hace un mes',
    text: 'Una inmobiliaria de 10.\nNo todo fue fácil por problemas externos, pero Manuel nos ayudó a gestionarlos y estuvo siempre pendiente de todo. Es un chico muy majo y atento.\nSin ninguna duda recomendaría MR soluciones inmobiliarias al 100%.\nMuchas gracias por todo',
  },
]

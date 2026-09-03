import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// parseBody valida la firma con crypto de Node, así que este handler no puede
// correr en el runtime edge.
export const runtime = 'nodejs'

/**
 * Cuerpo mínimo que proyectamos en el webhook de Sanity.
 * El filtro del webhook es `_type == "property"`, pero no damos por hecho nada:
 * el `_type` que llegue es el tag que revalidamos.
 */
interface SanityWebhookBody {
  _type?: string
  _id?: string
  slug?: { current?: string }
}

/**
 * Revalidación bajo demanda disparada por Sanity.
 *
 * Configuración en sanity.io/manage → API → Webhooks (ver README).
 * El secreto debe coincidir con SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  try {
    // Sin secreto configurado, parseBody devuelve isValidSignature === null y
    // la petición se rechaza: preferimos fallar cerrado a revalidar a ciegas.
    const { isValidSignature, body } = await parseBody<SanityWebhookBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { revalidated: false, message: 'Firma del webhook inválida' },
        { status: 401 }
      )
    }

    if (!body?._type) {
      return NextResponse.json(
        { revalidated: false, message: 'Falta _type en el cuerpo del webhook' },
        { status: 400 }
      )
    }

    // Tag global: todas las queries de propiedades comparten el tag 'property'.
    // Next 16 exige un perfil de caducidad: { expire: 0 } purga la entrada al
    // momento, en vez del stale-while-revalidate de 'max' (que serviría el
    // contenido antiguo una vez más antes de regenerar).
    revalidateTag(body._type, { expire: 0 })

    // Red de seguridad por si algún fetch se quedara sin etiquetar.
    revalidatePath('/')
    revalidatePath('/propiedades')
    revalidatePath('/propiedades/[slug]', 'page')

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
      now: Date.now(),
    })
  } catch (error) {
    console.error('[revalidate] Error inesperado:', error)
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ revalidated: false, message }, { status: 500 })
  }
}

import { createHash, timingSafeEqual } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { sincronizarInmovilla } from '@/lib/inmovilla/sync'

export const runtime = 'nodejs'
export const maxDuration = 300

function sha256(s: string): Buffer {
  return createHash('sha256').update(s).digest()
}

// Se comparan los hashes para que timingSafeEqual reciba buffers de igual
// longitud y no revele nada aunque las cadenas difieran en tamaño.
function secretoValido(auth: string | null, esperado: string | undefined): boolean {
  if (!esperado) return false
  const recibido = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''
  return timingSafeEqual(sha256(recibido), sha256(esperado))
}

async function sincronizar(force: boolean) {
  try {
    const salida = await sincronizarInmovilla({ force })
    return NextResponse.json(salida, { status: salida.ok ? 200 : 409 })
  } catch (error) {
    console.error('[sync] Error inesperado:', error)
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ ok: false, message }, { status: 500 })
  }
}

/**
 * Cron diario de Vercel (ver vercel.json). Vercel envía
 * `Authorization: Bearer <CRON_SECRET>`. Nunca salta la salvaguarda.
 */
export async function GET(req: NextRequest) {
  if (!secretoValido(req.headers.get('authorization'), process.env.CRON_SECRET)) {
    return NextResponse.json({ ok: false, message: 'No autorizado' }, { status: 401 })
  }
  return sincronizar(false)
}

/**
 * Importación manual del feed XML de Inmovilla a Supabase.
 * Requiere `Authorization: Bearer <SYNC_SECRET>`. `?force=true` salta la
 * salvaguarda del 50% (solo para el primer arranque con la tabla vacía).
 */
export async function POST(req: NextRequest) {
  if (!secretoValido(req.headers.get('authorization'), process.env.SYNC_SECRET)) {
    return NextResponse.json({ ok: false, message: 'No autorizado' }, { status: 401 })
  }
  return sincronizar(req.nextUrl.searchParams.get('force') === 'true')
}

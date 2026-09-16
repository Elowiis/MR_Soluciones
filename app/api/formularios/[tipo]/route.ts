import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Las URLs de los webhooks de n8n viven solo en el servidor: si el navegador
// llamara directamente a n8n, cualquiera podría leerlas en el JavaScript.
const WEBHOOKS = {
  contacto: 'N8N_WEBHOOK_CONTACTO',
  alerta: 'N8N_WEBHOOK_ALERTA',
} as const

type TipoFormulario = keyof typeof WEBHOOKS

const MAX_BODY_BYTES = 20_000

function esTipoValido(tipo: string): tipo is TipoFormulario {
  return Object.hasOwn(WEBHOOKS, tipo)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tipo: string }> }
) {
  const { tipo } = await params
  if (!esTipoValido(tipo)) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const webhookUrl = process.env[WEBHOOKS[tipo]]
  if (!webhookUrl) {
    console.error(`[formularios] Falta la variable ${WEBHOOKS[tipo]}`)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`[formularios] n8n respondió ${res.status} para "${tipo}"`)
      return NextResponse.json({ ok: false }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(`[formularios] No se pudo contactar con n8n para "${tipo}":`, error)
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}

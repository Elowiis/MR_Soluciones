import { mapPropiedad, type FichaOmitida, type MappedPropiedad } from './mapper'
import { fetchFeed, parseFeed, tagText } from './parser'
import { getSupabaseAdmin } from './supabase'

const LOTE_PROPIEDADES = 200
const LOTE_MEDIA = 500
const LOTE_IDS = 200
const PAGINA_LECTURA = 1000
const UMBRAL_SALVAGUARDA = 0.5
const MAX_AVISOS_RESPUESTA = 200

export interface SyncResultado {
  ok: true
  total_xml: number
  upsertadas: number
  omitidas: FichaOmitida[]
  desactivadas: number
  fotos_insertadas: number
  panoramicas_insertadas: number
  videos_insertados: number
  duracion_ms: number
  avisos: string[]
  avisos_totales: number
}

export interface SyncAbortado {
  ok: false
  abortado: true
  motivo: string
  total_xml: number
  activas_en_supabase: number
  duracion_ms: number
}

export type SyncSalida = SyncResultado | SyncAbortado

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

async function contarActivas(): Promise<number> {
  const { count, error } = await getSupabaseAdmin()
    .from('propiedades')
    .select('id_inmovilla', { count: 'exact', head: true })
    .eq('activa', true)
  if (error) throw new Error(`Contando activas: ${error.message}`)
  return count ?? 0
}

async function leerIdsActivas(): Promise<string[]> {
  const ids: string[] = []
  for (let desde = 0; ; desde += PAGINA_LECTURA) {
    const { data, error } = await getSupabaseAdmin()
      .from('propiedades')
      .select('id_inmovilla')
      .eq('activa', true)
      .range(desde, desde + PAGINA_LECTURA - 1)
    if (error) throw new Error(`Leyendo activas: ${error.message}`)
    for (const fila of data ?? []) ids.push(String(fila.id_inmovilla))
    if (!data || data.length < PAGINA_LECTURA) break
  }
  return ids
}

async function upsertLote(lote: MappedPropiedad[], ahora: string): Promise<void> {
  const sb = getSupabaseAdmin()
  const filas = lote.map((p) => ({
    ...p.row,
    activa: true,
    fecha_importacion: ahora,
    fecha_desaparicion: null,
  }))

  const { error } = await sb
    .from('propiedades')
    .upsert(filas, { onConflict: 'id_inmovilla' })
  if (error) throw new Error(`Upsert propiedades: ${error.message}`)

  // Multimedia: borrar y reinsertar. Más simple y fiable que diferenciar.
  const ids = lote.map((p) => p.id)
  for (const tabla of ['propiedad_fotos', 'propiedad_panoramicas', 'propiedad_videos']) {
    const { error: errBorrado } = await sb.from(tabla).delete().in('id_inmovilla', ids)
    if (errBorrado) throw new Error(`Borrando ${tabla}: ${errBorrado.message}`)
  }

  const inserciones: [tabla: string, filas: object[]][] = [
    ['propiedad_fotos', lote.flatMap((p) => p.fotos)],
    ['propiedad_panoramicas', lote.flatMap((p) => p.panoramicas)],
    ['propiedad_videos', lote.flatMap((p) => p.videos)],
  ]
  for (const [tabla, filasMedia] of inserciones) {
    for (const parte of chunk(filasMedia, LOTE_MEDIA)) {
      const { error: errInsert } = await sb.from(tabla).insert(parte)
      if (errInsert) throw new Error(`Insertando ${tabla}: ${errInsert.message}`)
    }
  }
}

async function desactivar(ids: string[], ahora: string): Promise<number> {
  const sb = getSupabaseAdmin()
  let total = 0
  for (const parte of chunk(ids, LOTE_IDS)) {
    const { data, error } = await sb
      .from('propiedades')
      .update({ activa: false, fecha_desaparicion: ahora })
      .in('id_inmovilla', parte)
      .eq('activa', true)
      .select('id_inmovilla')
    if (error) throw new Error(`Desactivando: ${error.message}`)
    total += data?.length ?? 0
  }
  return total
}

export async function sincronizarInmovilla(opciones: { force: boolean }): Promise<SyncSalida> {
  const inicio = Date.now()

  const url = process.env.INMOVILLA_XML_URL
  if (!url) throw new Error('Falta INMOVILLA_XML_URL')

  const xml = await fetchFeed(url)
  const crudas = parseFeed(xml)

  const avisos: string[] = []
  const propiedades: MappedPropiedad[] = []
  const omitidas: FichaOmitida[] = []
  // Incluye también las omitidas por fotos descuadradas: siguen en el feed,
  // así que no deben marcarse como baja.
  const idsEnXml = new Set<string>()

  for (const cruda of crudas) {
    const { propiedad, omitida, avisos: avisosFicha } = mapPropiedad(cruda)
    avisos.push(...avisosFicha)
    const id = tagText(cruda.id)
    if (id !== '') idsEnXml.add(id)
    if (propiedad) propiedades.push(propiedad)
    if (omitida) omitidas.push(omitida)
  }

  const activas = await contarActivas()
  if (!opciones.force && activas > 0 && crudas.length < activas * UMBRAL_SALVAGUARDA) {
    return {
      ok: false,
      abortado: true,
      motivo:
        `El XML trae ${crudas.length} propiedades y en Supabase hay ${activas} activas ` +
        `(menos del ${UMBRAL_SALVAGUARDA * 100}%). No se ha escrito nada. ` +
        `Si el feed es correcto, repite con ?force=true.`,
      total_xml: crudas.length,
      activas_en_supabase: activas,
      duracion_ms: Date.now() - inicio,
    }
  }

  const ahora = new Date().toISOString()

  for (const lote of chunk(propiedades, LOTE_PROPIEDADES)) {
    await upsertLote(lote, ahora)
  }

  const idsActivas = await leerIdsActivas()
  const idsBaja = idsActivas.filter((id) => !idsEnXml.has(id))
  const desactivadas = await desactivar(idsBaja, ahora)

  for (const aviso of avisos) console.warn('[sync]', aviso)
  for (const o of omitidas) console.warn('[sync] Omitida', o.id ?? '(sin id)', '-', o.motivo)

  return {
    ok: true,
    total_xml: crudas.length,
    upsertadas: propiedades.length,
    omitidas,
    desactivadas,
    fotos_insertadas: propiedades.reduce((n, p) => n + p.fotos.length, 0),
    panoramicas_insertadas: propiedades.reduce((n, p) => n + p.panoramicas.length, 0),
    videos_insertados: propiedades.reduce((n, p) => n + p.videos.length, 0),
    duracion_ms: Date.now() - inicio,
    avisos: avisos.slice(0, MAX_AVISOS_RESPUESTA),
    avisos_totales: avisos.length,
  }
}

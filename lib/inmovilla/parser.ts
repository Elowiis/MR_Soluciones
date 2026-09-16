import { XMLParser } from 'fast-xml-parser'

/**
 * Una <propiedad> tal cual la entrega el parser: etiquetas planas con valor
 * string (o array si la etiqueta se repite, u objeto si lleva atributos).
 */
export type RawPropiedad = Record<string, unknown>

export interface RawFoto {
  orden: number
  url: string
  etiqueta: string | null
}

export interface RawMedia {
  orden: number
  url: string
}

const ATTR_PREFIX = '@_'
const TEXT_KEY = '#text'

// parseTagValue: false → todo llega como string. Sin esto el parser convierte
// el código postal "09007" en el número 9007.
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ATTR_PREFIX,
  textNodeName: TEXT_KEY,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  ignoreDeclaration: true,
})

export async function fetchFeed(url: string): Promise<string> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Inmovilla respondió ${res.status} ${res.statusText}`)
  }
  return res.text()
}

export function parseFeed(xml: string): RawPropiedad[] {
  const doc = parser.parse(xml) as { propiedades?: { propiedad?: unknown } }
  const root = doc?.propiedades
  if (!root || typeof root !== 'object') {
    throw new Error('El XML no tiene raíz <propiedades>')
  }

  const items = root.propiedad
  if (items === undefined || items === '') return []
  const list = Array.isArray(items) ? items : [items]

  return list.filter(
    (p): p is RawPropiedad => typeof p === 'object' && p !== null
  )
}

/**
 * Valor de texto de una etiqueta plana. Contempla las tres formas en que el
 * parser puede entregarla: string, array (etiqueta repetida → primer elemento)
 * u objeto (etiqueta con atributos → nodo de texto).
 */
export function tagText(value: unknown): string {
  if (Array.isArray(value)) return tagText(value[0])
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    const text = (value as Record<string, unknown>)[TEXT_KEY]
    return typeof text === 'string' ? text : ''
  }
  return String(value)
}

function tagAttr(value: unknown, name: string): string | null {
  if (Array.isArray(value)) return tagAttr(value[0], name)
  if (value === null || typeof value !== 'object') return null
  const attr = (value as Record<string, unknown>)[ATTR_PREFIX + name]
  return typeof attr === 'string' && attr !== '' ? attr : null
}

/**
 * Recoge etiquetas numeradas (foto1, foto2, …) y las ordena numéricamente.
 * Ordenar como texto pondría foto10 antes que foto2.
 */
function numberedTags(raw: RawPropiedad, pattern: RegExp): { orden: number; value: unknown }[] {
  const found: { orden: number; value: unknown }[] = []
  for (const key of Object.keys(raw)) {
    const m = pattern.exec(key)
    if (!m) continue
    found.push({ orden: Number.parseInt(m[1], 10), value: raw[key] })
  }
  return found.sort((a, b) => a.orden - b.orden)
}

export function extractFotos(raw: RawPropiedad): RawFoto[] {
  return numberedTags(raw, /^foto(\d+)$/)
    .map(({ orden, value }) => ({
      orden,
      url: tagText(value),
      etiqueta: tagAttr(value, 'eti'),
    }))
    .filter((f) => f.url !== '')
}

export function extractPanoramicas(raw: RawPropiedad): RawMedia[] {
  return numberedTags(raw, /^panoramica(\d+)$/)
    .map(({ orden, value }) => ({ orden, url: tagText(value) }))
    .filter((p) => p.url !== '')
}

/**
 * <videos> llega vacío ("" tras el parser) o como <videos><video1>URL</video1></videos>.
 */
export function extractVideos(raw: RawPropiedad): RawMedia[] {
  const videos = raw.videos
  if (!videos || typeof videos !== 'object' || Array.isArray(videos)) return []
  return numberedTags(videos as RawPropiedad, /^video(\d+)$/)
    .map(({ orden, value }) => ({ orden, url: tagText(value) }))
    .filter((v) => v.url !== '')
}

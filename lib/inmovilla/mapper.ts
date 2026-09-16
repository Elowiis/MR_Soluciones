import {
  extractFotos,
  extractPanoramicas,
  extractVideos,
  tagText,
  type RawPropiedad,
} from './parser'

export type PropiedadRow = Record<string, string | number | boolean | null>

export interface FotoRow {
  id_inmovilla: string
  orden: number
  url: string
  etiqueta: string | null
}

export interface MediaRow {
  id_inmovilla: string
  orden: number
  url: string
}

export interface MappedPropiedad {
  id: string
  row: PropiedadRow
  fotos: FotoRow[]
  panoramicas: MediaRow[]
  videos: MediaRow[]
}

export interface FichaOmitida {
  id: string | null
  motivo: string
}

export interface MapResult {
  propiedad: MappedPropiedad | null
  omitida: FichaOmitida | null
  avisos: string[]
}

// ---------------------------------------------------------------------------
// Conversión de valores. "0", "0.00", "" y "0000-00-00" significan "sin dato".
// ---------------------------------------------------------------------------

const SIN_DATO = new Set(['', '0', '0.00', '0000-00-00'])

function isSinDato(s: string): boolean {
  return SIN_DATO.has(s)
}

function asText(v: unknown): string | null {
  const s = tagText(v)
  return isSinDato(s) ? null : s
}

function asMultiline(v: unknown): string | null {
  const s = asText(v)
  return s === null ? null : s.replace(/~/g, '\n')
}

function asNumber(v: unknown): number | null {
  const s = tagText(v)
  if (isSinDato(s)) return null
  const n = Number(s)
  if (!Number.isFinite(n) || n === 0) return null
  return n
}

function asInt(v: unknown): number | null {
  const n = asNumber(v)
  return n === null ? null : Math.round(n)
}

function asRoundedNumber(v: unknown): number | null {
  const n = asNumber(v)
  return n === null ? null : Math.round(n)
}

function asBool(v: unknown): boolean | null {
  const s = tagText(v)
  if (s === '1') return true
  if (s === '0') return false
  return null
}

function asDate(v: unknown): string | null {
  const s = asText(v)
  if (s === null) return null
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

// ---------------------------------------------------------------------------
// Traducción de códigos (documento ENUMS de Inmovilla). Ningún valor más.
// ---------------------------------------------------------------------------

type Enum = Record<string, string | null>

const ENUMS: Record<string, { columna: string; valores: Enum }> = {
  cocina_inde: {
    columna: 'tipo_cocina',
    valores: {
      '0': null,
      '1': 'Independiente',
      '2': 'Exterior',
      '3': 'Americana',
      '4': 'Salón Cocina',
      '5': 'Francesa',
      '6': 'Cocina Office',
      '7': 'Con isla',
    },
  },
  electro: {
    columna: 'electrodomesticos',
    valores: { '0': null, '1': 'Equipada', '2': 'Vacía', '3': 'Sólo muebles' },
  },
  parking: {
    columna: 'parking',
    valores: { '0': 'Sin Parking', '1': 'Parking Opcional', '2': 'Parking Incluido' },
  },
  plaza_gara: {
    columna: 'plaza_garaje',
    valores: { '0': 'Sin Garaje', '1': 'Garaje Opcional', '2': 'Garaje Incluido' },
  },
  todoext: {
    columna: 'exterior_interior',
    valores: { '0': null, '1': 'Todo exterior', '2': 'Exterior', '3': 'Interior', '4': 'Mixto' },
  },
}

// ---------------------------------------------------------------------------
// Mapeo XML → columna. Las columnas existen ya en Supabase con estos nombres.
// ---------------------------------------------------------------------------

type Conv = (v: unknown) => string | number | boolean | null

const CAMPOS: [xml: string, columna: string, conv: Conv][] = [
  ['numagencia', 'num_agencia', asInt],
  ['ref', 'referencia', asText],
  ['accion', 'accion', asText],
  ['tipo_ofer', 'tipo_inmueble', asText],
  ['keypromo', 'id_promocion', asText],
  ['opcioncompra', 'opcion_compra', asBool],
  ['destacado', 'destacado', asInt],
  ['precioinmo', 'precio_venta', asRoundedNumber],
  ['precioalq', 'precio_alquiler', asNumber],
  ['gastos_com', 'gastos_comunidad', asNumber],
  ['comunidadincluida', 'comunidad_incluida', asBool],
  ['ciudad', 'ciudad', asText],
  ['zona', 'zona', asText],
  ['cp', 'codigo_postal', asText],
  ['latitud', 'latitud', asNumber],
  // <altitud> trae la LONGITUD, no la altitud.
  ['altitud', 'longitud', asNumber],
  ['distmar', 'distancia_mar', asInt],
  ['rcatastral', 'ref_catastral', asText],
  ['m_cons', 'm2_construidos', asNumber],
  ['m_uties', 'm2_utiles', asNumber],
  ['m_parcela', 'm2_parcela', asNumber],
  ['m_cocina', 'm2_cocina', asNumber],
  ['m_comedor', 'm2_comedor', asNumber],
  ['m_terraza', 'm2_terraza', asNumber],
  ['habitaciones', 'habitaciones_simples', asInt],
  ['habdobles', 'habitaciones_dobles', asInt],
  ['banyos', 'banyos', asInt],
  ['aseos', 'aseos', asInt],
  ['numplanta', 'planta', asInt],
  ['antiguedad', 'anyo_construccion', asInt],
  ['conservacion', 'conservacion', asText],
  ['orientacion', 'orientacion', asText],
  ['energialetra', 'energia_letra', asText],
  ['energiavalor', 'energia_valor', asNumber],
  ['emisionesletra', 'emisiones_letra', asText],
  ['emisionesvalor', 'emisiones_valor', asNumber],
  ['refcertificado', 'ref_certificado', asText],
  ['fecha_caducidad', 'caducidad_certificado', asDate],
  ['titulo1', 'titulo_es', asMultiline],
  ['descrip1', 'descripcion_es', asMultiline],
  ['titulo2', 'titulo_en', asMultiline],
  ['descrip2', 'descripcion_en', asMultiline],
  ['tinterior', 'texto_interior', asMultiline],
  ['tbano', 'texto_banos', asText],
  ['tcocina', 'texto_cocina', asText],
  ['tfachada', 'texto_fachada', asText],
  ['tpostigo', 'texto_portal', asText],
]

const BOOLEANOS: Record<string, string> = {
  adaptadominus: 'adaptado_minusvalidos',
  airecentral: 'aire_central',
  aire_con: 'aire_acondicionado',
  alarma: 'alarma',
  alarmaincendio: 'alarma_incendio',
  alarmarobo: 'alarma_robo',
  arma_empo: 'armarios_empotrados',
  ascensor: 'ascensor',
  balcon: 'balcon',
  bar: 'bar',
  barbacoa: 'barbacoa',
  cajafuerte: 'caja_fuerte',
  calefacentral: 'calefaccion_central',
  calefaccion: 'calefaccion',
  chimenea: 'chimenea',
  depoagua: 'deposito_agua',
  descalcificador: 'descalcificador',
  despensa: 'despensa',
  diafano: 'diafano',
  esquina: 'esquina',
  galeria: 'galeria',
  garajedoble: 'garaje_doble',
  gasciudad: 'gas_ciudad',
  gimnasio: 'gimnasio',
  habjuegos: 'sala_juegos',
  hidromasaje: 'hidromasaje',
  jacuzzi: 'jacuzzi',
  lavanderia: 'lavanderia',
  linea_tlf: 'linea_telefono',
  luminoso: 'luminoso',
  luz: 'luz',
  muebles: 'amueblado',
  ojobuey: 'ojo_buey',
  patio: 'patio',
  piscina_com: 'piscina_comunitaria',
  piscina_prop: 'piscina_propia',
  preinstaacc: 'preinstalacion_aire',
  primera_line: 'primera_linea_playa',
  puerta_blin: 'puerta_blindada',
  satelite: 'satelite',
  sauna: 'sauna',
  solarium: 'solarium',
  sotano: 'sotano',
  tv: 'tv',
  terraza: 'terraza',
  terrazaacris: 'terraza_acristalada',
  trastero: 'trastero',
  urbanizacion: 'urbanizacion',
  vestuarios: 'vestuarios',
  vistasalmar: 'vistas_al_mar',
}

// ---------------------------------------------------------------------------

export function mapPropiedad(raw: RawPropiedad): MapResult {
  const avisos: string[] = []

  const id = tagText(raw.id)
  if (id === '') {
    return { propiedad: null, omitida: { id: null, motivo: 'Sin <id>' }, avisos }
  }

  const fotos = extractFotos(raw)

  // numfotos solo se usa como control: si no cuadra, el XML llegó truncado y
  // no guardamos una ficha a medias.
  const numfotos = asInt(raw.numfotos) ?? 0
  if (numfotos !== fotos.length) {
    return {
      propiedad: null,
      omitida: {
        id,
        motivo: `numfotos=${numfotos} pero hay ${fotos.length} etiquetas foto`,
      },
      avisos,
    }
  }

  const row: PropiedadRow = { id_inmovilla: id }

  for (const [xml, columna, conv] of CAMPOS) {
    row[columna] = conv(raw[xml])
  }

  for (const [xml, columna] of Object.entries(BOOLEANOS)) {
    row[columna] = asBool(raw[xml])
  }

  for (const [xml, { columna, valores }] of Object.entries(ENUMS)) {
    const codigo = tagText(raw[xml])
    if (codigo === '') {
      row[columna] = null
    } else if (codigo in valores) {
      row[columna] = valores[codigo]
    } else {
      row[columna] = null
      avisos.push(`Propiedad ${id}: código desconocido ${xml}=${codigo}`)
    }
  }

  return {
    propiedad: {
      id,
      row,
      fotos: fotos.map((f) => ({ id_inmovilla: id, ...f })),
      panoramicas: extractPanoramicas(raw).map((p) => ({ id_inmovilla: id, ...p })),
      videos: extractVideos(raw).map((v) => ({ id_inmovilla: id, ...v })),
    },
    omitida: null,
    avisos,
  }
}

import type { Property } from '@/types/property'

export const COLUMNAS_EXTRAS = {
  adaptado_minusvalidos: 'Adaptado a minusválidos',
  aire_central: 'Aire central',
  aire_acondicionado: 'Aire acondicionado',
  alarma: 'Alarma',
  alarma_incendio: 'Alarma de incendio',
  alarma_robo: 'Alarma antirrobo',
  armarios_empotrados: 'Armarios empotrados',
  ascensor: 'Ascensor',
  balcon: 'Balcón',
  bar: 'Bar',
  barbacoa: 'Barbacoa',
  caja_fuerte: 'Caja fuerte',
  calefaccion_central: 'Calefacción central',
  calefaccion: 'Calefacción',
  chimenea: 'Chimenea',
  deposito_agua: 'Depósito de agua',
  descalcificador: 'Descalcificador',
  despensa: 'Despensa',
  diafano: 'Diáfano',
  esquina: 'Esquina',
  galeria: 'Galería',
  garaje_doble: 'Garaje doble',
  gas_ciudad: 'Gas ciudad',
  gimnasio: 'Gimnasio',
  sala_juegos: 'Sala de juegos',
  hidromasaje: 'Hidromasaje',
  jacuzzi: 'Jacuzzi',
  lavanderia: 'Lavandería',
  linea_telefono: 'Línea de teléfono',
  luminoso: 'Luminoso',
  luz: 'Luz',
  amueblado: 'Amueblado',
  ojo_buey: 'Ojo de buey',
  patio: 'Patio',
  piscina_comunitaria: 'Piscina comunitaria',
  piscina_propia: 'Piscina propia',
  preinstalacion_aire: 'Preinstalación de aire acondicionado',
  primera_linea_playa: 'Primera línea de playa',
  puerta_blindada: 'Puerta blindada',
  satelite: 'Antena satélite',
  sauna: 'Sauna',
  solarium: 'Solárium',
  sotano: 'Sótano',
  tv: 'TV',
  terraza: 'Terraza',
  terraza_acristalada: 'Terraza acristalada',
  trastero: 'Trastero',
  urbanizacion: 'Urbanización',
  vestuarios: 'Vestuarios',
  vistas_al_mar: 'Vistas al mar',
} as const

export type ColumnaExtra = keyof typeof COLUMNAS_EXTRAS

export const COLUMNAS_PROPIEDAD = [
  'id_inmovilla',
  'referencia',
  'accion',
  'tipo_inmueble',
  'precio_venta',
  'precio_alquiler',
  'ciudad',
  'zona',
  'codigo_postal',
  'latitud',
  'longitud',
  'm2_construidos',
  'm2_utiles',
  'm2_parcela',
  'habitaciones_total',
  'habitaciones_simples',
  'habitaciones_dobles',
  'banyos',
  'aseos',
  'titulo_es',
  'descripcion_es',
  'conservacion',
  'orientacion',
  'anyo_construccion',
  'destacado',
  'planta',
  'tipo_cocina',
  'parking',
  'plaza_garaje',
  'exterior_interior',
  'electrodomesticos',
  'energia_letra',
  'energia_valor',
  'fecha_importacion',
] as const

export interface FilaFoto {
  orden: number
  url: string
  etiqueta: string | null
}

export interface FilaPropiedad {
  id_inmovilla: string
  referencia: string | null
  accion: string | null
  tipo_inmueble: string | null
  precio_venta: number | null
  precio_alquiler: number | null
  ciudad: string | null
  zona: string | null
  codigo_postal: string | null
  latitud: number | null
  longitud: number | null
  m2_construidos: number | null
  m2_utiles: number | null
  m2_parcela: number | null
  habitaciones_total: number | null
  habitaciones_simples: number | null
  habitaciones_dobles: number | null
  banyos: number | null
  aseos: number | null
  titulo_es: string | null
  descripcion_es: string | null
  conservacion: string | null
  orientacion: string | null
  anyo_construccion: number | null
  destacado: number | null
  planta: number | null
  tipo_cocina: string | null
  parking: string | null
  plaza_garaje: string | null
  exterior_interior: string | null
  electrodomesticos: string | null
  energia_letra: string | null
  energia_valor: number | null
  fecha_importacion: string | null
  propiedad_fotos: FilaFoto[] | null
}

export type FilaPropiedadConExtras = FilaPropiedad & Partial<Record<ColumnaExtra, boolean | null>>

// Los cinco valores documentados de `accion`. Los que no son de alquiler → venta.
const ACCIONES_ALQUILER = new Set(['Alquilar', 'Traspasar y Alquilar', 'Alquiler Vacacional'])

export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * `tipo-ciudad-referencia`. La referencia va siempre al final y es lo que
 * hace el slug único y estable; si falta, se usa id_inmovilla.
 */
export function slugPropiedad(
  fila: Pick<FilaPropiedad, 'id_inmovilla' | 'referencia' | 'tipo_inmueble' | 'ciudad'>
): string {
  const referencia = slugify(fila.referencia ?? '') || slugify(fila.id_inmovilla)
  return [slugify(fila.tipo_inmueble ?? ''), slugify(fila.ciudad ?? ''), referencia]
    .filter(Boolean)
    .join('-')
}

function texto(valor: string | null | undefined): string | null {
  const limpio = valor?.trim()
  return limpio ? limpio : null
}

function tituloRespaldo(tipo: string, ciudad: string | null): string {
  return ciudad ? `${tipo} en ${ciudad}` : tipo
}

export function toProperty(fila: FilaPropiedadConExtras): Property {
  const accion = fila.accion ?? 'Vender'
  const esAlquiler = ACCIONES_ALQUILER.has(accion)
  const ventaYAlquiler = accion === 'Vender o Alquilar'

  const fotos = [...(fila.propiedad_fotos ?? [])].sort((a, b) => a.orden - b.orden)
  const [principal, ...resto] = fotos

  const propertyType = texto(fila.tipo_inmueble) ?? 'Otros'
  const location = texto(fila.ciudad) ?? ''
  const title = texto(fila.titulo_es) ?? tituloRespaldo(propertyType, texto(fila.ciudad))

  const features = (Object.keys(COLUMNAS_EXTRAS) as ColumnaExtra[])
    .filter((columna) => fila[columna] === true)
    .map((columna) => COLUMNAS_EXTRAS[columna])

  return {
    id: fila.id_inmovilla,
    referencia: texto(fila.referencia) ?? fila.id_inmovilla,
    title,
    slug: slugPropiedad(fila),
    mainImageUrl: principal?.url ?? null,
    gallery: resto.map((foto) => ({ url: foto.url, alt: foto.etiqueta || title })),
    price: esAlquiler ? fila.precio_alquiler : fila.precio_venta,
    rentPrice: ventaYAlquiler ? fila.precio_alquiler : null,
    accion,
    status: esAlquiler ? 'alquiler' : 'en venta',
    location,
    neighborhood: texto(fila.zona),
    postalCode: texto(fila.codigo_postal),
    geoLocation:
      fila.latitud != null && fila.longitud != null
        ? { lat: fila.latitud, lng: fila.longitud }
        : null,
    bedrooms: fila.habitaciones_total,
    singleBedrooms: fila.habitaciones_simples,
    doubleBedrooms: fila.habitaciones_dobles,
    bathrooms: fila.banyos,
    toilets: fila.aseos,
    squareMeters: fila.m2_construidos,
    usableSquareMeters: fila.m2_utiles,
    plotSquareMeters: fila.m2_parcela,
    description: texto(fila.descripcion_es),
    features,
    propertyType,
    isFeatured: fila.destacado != null && fila.destacado > 0,
    conservacion: texto(fila.conservacion),
    orientacion: texto(fila.orientacion),
    anyoConstruccion: fila.anyo_construccion,
    planta: fila.planta,
    tipoCocina: texto(fila.tipo_cocina),
    parking: texto(fila.parking),
    plazaGaraje: texto(fila.plaza_garaje),
    exteriorInterior: texto(fila.exterior_interior),
    electrodomesticos: texto(fila.electrodomesticos),
    energiaLetra: texto(fila.energia_letra),
    energiaValor: fila.energia_valor,
    createdAt: fila.fecha_importacion ?? '',
  }
}

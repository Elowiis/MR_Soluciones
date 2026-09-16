This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Contenido de Sanity: caché y actualización instantánea

Las propiedades se editan en el Studio embebido (`/studio`) y se sirven desde
páginas cacheadas por Next. Para que un alta, edición o borrado se vea en la web
en segundos, Sanity avisa a la app por webhook y la app purga la caché.

### Estrategia de caché

| Ruta | Render | Fuente de datos | Invalidación |
|---|---|---|---|
| `/` (bloque de propiedades) | estática (ISR) | `clientForISR.fetch(getHomeProperties)` | tag `property` + `revalidate: 60` |
| `/propiedades` | Server Component + isla cliente para los filtros | `clientForISR.fetch(getAllProperties)` | tag `property` + `revalidate: 60` |
| `/propiedades/[slug]` | SSG con `dynamicParams: true` | `clientForISR.fetch(getPropertyBySlug)` | tag `property` + `revalidate = 60` |

Puntos clave:

- Todos los fetches de servidor usan **`clientForISR`** (`useCdn: false`). La
  caché la controla Next, así que el CDN de Sanity solo añadiría latencia.
- Todos pasan `{ next: { revalidate: 60, tags: ['property'] } }`. El tag es la
  vía rápida (webhook, purga instantánea); los 60 s son la red de seguridad para
  cuando el webhook no está configurado o falla. **Sin webhook el desfase máximo
  es de un minuto**, no de una hora.
- `dynamicParams: true` en el detalle: una propiedad nueva genera su página bajo
  demanda en la primera visita, sin esperar a un deploy.
- Los filtros de `/propiedades` viven en `app/propiedades/PropertiesClient.tsx`
  y reciben los datos ya resueltos en servidor por props (SSR + SEO).
- La home usa `getHomeProperties`, que ordena por `isFeatured` y limita a 6
  resultados. `FeaturedPropertiesSection` los parte en dos bloques:
  "Destacadas" y "Más propiedades". Si solo hay de un tipo, se pinta una
  única rejilla sin subtítulos.

### Variable de entorno

Añadir en **Vercel → Settings → Environment Variables** (y en `.env.local` para
desarrollo):

| Variable | Valor |
|---|---|
| `SANITY_REVALIDATE_SECRET` | cadena aleatoria larga; debe coincidir exactamente con el secreto del webhook |

Generar una:

```bash
openssl rand -base64 32
```

Sin esta variable el endpoint responde **401 a todo**: falla cerrado a propósito.
Tras añadirla en Vercel hay que **redesplegar** para que quede disponible.

### Configurar el webhook en Sanity

En [sanity.io/manage](https://sanity.io/manage) → el proyecto → pestaña **API** →
**Webhooks** → *Create webhook*:

| Campo | Valor |
|---|---|
| Name | `Revalidar web (Next.js)` |
| URL | `https://<tu-dominio>/api/revalidate` |
| Dataset | `production` (el mismo de `NEXT_PUBLIC_SANITY_DATASET`) |
| Trigger on | **Create**, **Update** y **Delete** |
| Filter | `_type == "property"` |
| Projection | vacío (se envía el documento entero) |
| HTTP method | `POST` |
| API version | `v2021-03-25` o posterior |
| Secret | el mismo valor que `SANITY_REVALIDATE_SECRET` |

El endpoint está en `app/api/revalidate/route.ts`. Valida la firma con
`parseBody` de `next-sanity/webhook`, purga el tag del `_type` recibido
(`revalidateTag('property', { expire: 0 })`, purga inmediata) y, como refuerzo,
llama a `revalidatePath` sobre `/`, `/propiedades` y `/propiedades/[slug]`.

Respuestas: `401` firma inválida o secreto ausente, `400` cuerpo sin `_type`,
`500` error inesperado.

### Si un cambio no aparece

Cada ruta tiene su propia entrada de caché, así que sin webhook pueden quedar
desincronizadas hasta 60 s (la home mostrando una propiedad que `/propiedades`
ya no lista, por ejemplo). Con el webhook configurado se purgan todas juntas.

- **En local**, la caché de fetch vive en `.next/cache` y **sobrevive entre
  builds**. Para forzar borrón y cuenta nueva: `rm -rf .next && pnpm build`.
- **En Vercel**, un redeploy regenera las páginas. Si aun así persiste, usar
  *Redeploy* desmarcando "Use existing Build Cache".

### Comprobarlo

1. Editar el título de una propiedad en `/studio` y publicar.
2. En sanity.io/manage → Webhooks → *Delivery log*, el envío debe salir en verde
   (200) con `{"revalidated": true, "type": "property"}`.
3. Recargar la home y `/propiedades`: el cambio ya está.

Si el log muestra 401, el secreto del webhook y `SANITY_REVALIDATE_SECRET` no
coinciden (o falta el redeploy tras añadir la variable).

## Importador de Inmovilla a Supabase

`POST /api/sync` descarga el feed XML diario de Inmovilla y deja la tabla
`propiedades` de Supabase igual que el XML. Corre en paralelo a Sanity y no
toca nada de él: por ahora solo llena la base de datos, la web sigue leyendo de
Sanity.

Código en `lib/inmovilla/`: `parser.ts` (descarga y parseo), `mapper.ts`
(XML → columnas, traducción de códigos), `sync.ts` (lotes, salvaguarda,
bajas) y `supabase.ts` (cliente con service role).

### Variables de entorno

Añadir en **Vercel → Settings → Environment Variables** y en `.env.local`:

| Variable | Valor |
|---|---|
| `INMOVILLA_XML_URL` | URL del XML. Ahora la del **demo** (`https://procesos.apinmo.com/xml/xml2demo/2-web.xml`); la de producción la facilitará Inmovilla |
| `SUPABASE_URL` | Supabase → Project Settings → API → *Project URL* |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → *service_role*. **Solo servidor**: salta el RLS. Nunca con prefijo `NEXT_PUBLIC_` ni importada desde un componente cliente |
| `SYNC_SECRET` | cadena aleatoria larga (`openssl rand -base64 32`). Sin ella la ruta responde 401 a todo |

### Cómo funciona

El XML no es incremental: cada noche trae el catálogo completo y solo incluye
propiedades con "Publicar web" + "Libre" en el CRM. Una propiedad vendida o
despublicada simplemente desaparece del feed.

1. Descarga y parsea el XML (todo como texto: el CP `09007` no se convierte en `9007`).
2. **Salvaguarda**: si el XML trae menos del 50 % de las propiedades `activa = true`
   que hay en Supabase, aborta sin escribir nada (409). Protege contra un feed
   defectuoso que vaciaría el catálogo. `?force=true` la salta: úsalo solo en el
   primer arranque.
3. Upsert por lotes de 200 con `activa = true` y `fecha_importacion = now()`.
   `habitaciones_total` es una columna generada: no se escribe.
4. Multimedia (`propiedad_fotos`, `propiedad_panoramicas`, `propiedad_videos`):
   se borran las filas de cada propiedad y se reinsertan.
5. **Bajas**: toda propiedad de Supabase que no venga en el XML pasa a
   `activa = false` con `fecha_desaparicion = now()`. **Nunca se borran filas**:
   si vuelve al feed, se reactiva sola.

Una ficha cuyo `numfotos` no cuadre con sus etiquetas `fotoN` (XML truncado) se
omite con aviso, pero **no** se da de baja: sigue en el feed.

### Probarlo en local

```bash
pnpm dev

curl -X POST "http://localhost:3000/api/sync?force=true" \
  -H "Authorization: Bearer $SYNC_SECRET"
```

`?force=true` solo la primera vez (tabla vacía). Después, sin parámetro.

Respuestas: `200` con `{ total_xml, upsertadas, omitidas[], desactivadas,
fotos_insertadas, panoramicas_insertadas, videos_insertados, duracion_ms,
avisos[] }`; `409` abortado por la salvaguarda (`motivo` lo explica); `401`
secreto ausente o incorrecto; `405` si no es POST; `500` error inesperado.
`omitidas` lista las fichas no guardadas como `{ id, motivo }`; `avisos` lista
códigos no documentados.

El cron de Vercel se configurará después de validar la importación a mano.

### La web lee las propiedades de Supabase

Desde septiembre de 2026 **Sanity ya no es fuente de propiedades**: `/`,
`/propiedades` y `/propiedades/[slug]` leen únicamente de Supabase, alimentado
por el importador de Inmovilla. Lo que no está en el XML no está en la web.

Sanity sigue en el repo sin cambios (Studio en `/studio`, esquema, webhook de
`/api/revalidate`) por si hay que volver atrás, pero ninguna página lo consulta.
Su esquema solo define el tipo `property`; no sirve otro contenido.

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → *Project URL* (la misma que `SUPABASE_URL`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → *anon* / *publishable*. Clave pública: respeta el RLS, que solo deja leer `activa = true` |

`SUPABASE_SERVICE_ROLE_KEY` sigue siendo solo del importador: no se usa para leer
desde la web ni aparece en código que llegue al navegador.

Código: `lib/inmovilla/queries.ts` (lectura con clave anon, `revalidate: 60` con
tag `inmovilla`; `getProperties`, `getPropertyBySlug`, `getHomeProperties`),
`lib/inmovilla/adapter.ts` (fila de Supabase → `Property`, slug, etiquetas de
extras) y `types/property.ts`.

- Si Supabase falla, `getProperties` captura el error, lo loguea y devuelve `[]`:
  `/propiedades` muestra "No hay propiedades disponibles en este momento" y la
  home omite la sección. Nunca una excepción sin controlar.
- Slugs: `tipo-ciudad-referencia` (`piso-ponferrada-00226`). La referencia va
  siempre al final; si falta se usa `id_inmovilla`.
- Los chips de tipo de `/propiedades` se derivan de los tipos presentes en el
  catálogo (los 8 más frecuentes; el resto bajo "Otros"), así ninguna propiedad
  queda fuera de todos los filtros aunque Inmovilla añada tipos nuevos.
- Las fotos vienen de `*.apinmo.com`, autorizado en `next.config.ts`.

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

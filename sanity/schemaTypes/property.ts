import { defineField, defineType } from 'sanity'

export const propertyType = defineType({
  name: 'property',
  title: 'Propiedad',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
          description: 'Descripción de la imagen para accesibilidad',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Precio (€)',
      type: 'number',
      validation: (Rule) => Rule.required().positive().min(0),
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'neighborhood',
      title: 'Barrio',
      type: 'string',
    }),
    defineField({
      name: 'geoLocation',
      title: 'Ubicación en el mapa',
      type: 'geopoint',
      description: 'Haz clic en el mapa para seleccionar la ubicación exacta de la propiedad',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Habitaciones',
      type: 'number',
      validation: (Rule) => Rule.positive().integer().min(0).max(20),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Baños',
      type: 'number',
      validation: (Rule) => Rule.positive().integer().min(0).max(20),
    }),
    defineField({
      name: 'squareMeters',
      title: 'Metros Cuadrados (m²)',
      type: 'number',
      validation: (Rule) => Rule.required().positive().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'features',
      title: 'Características',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Ascensor', value: 'ascensor' },
          { title: 'Parking', value: 'parking' },
          { title: 'Terraza', value: 'terraza' },
          { title: 'Piscina', value: 'piscina' },
          { title: 'Aire Acondicionado', value: 'aire acondicionado' },
          { title: 'Calefacción', value: 'calefacción' },
          { title: 'Trastero', value: 'trastero' },
          { title: 'Portero', value: 'portero' },
          { title: 'Jardín', value: 'jardín' },
          { title: 'Amueblado', value: 'amueblado' },
        ],
      },
    }),
    defineField({
      name: 'propertyType',
      title: 'Tipo de Propiedad',
      type: 'string',
      options: {
        list: [
          { title: 'Piso', value: 'piso' },
          { title: 'Casa', value: 'casa' },
          { title: 'Chalet', value: 'chalet' },
          { title: 'Ático', value: 'ático' },
          { title: 'Garaje', value: 'garaje' },
          { title: 'Estudio', value: 'estudio' },
          { title: 'Local', value: 'local' },
          { title: 'Oficina', value: 'oficina' },
          { title: 'Terreno', value: 'terreno' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'En Venta', value: 'en venta' },
          { title: 'Vendido', value: 'vendido' },
          { title: 'Reservado', value: 'reservado' },
          { title: 'Alquiler', value: 'alquiler' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      type: 'boolean',
      description: 'Marca esta propiedad como destacada para mostrarla en la página principal',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de Creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'mainImage',
      status: 'status',
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title,
        subtitle: `${subtitle} - ${status}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Fecha de creación (nuevo primero)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Fecha de creación (antiguo primero)',
      name: 'createdAtAsc',
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
    {
      title: 'Precio (mayor primero)',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Precio (menor primero)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
})


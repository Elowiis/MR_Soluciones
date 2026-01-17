import { groq } from 'next-sanity'

// Query para obtener todas las propiedades ordenadas por fecha de creación
export const getAllProperties = groq`
  *[_type == "property"] | order(createdAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset,
      alt
    },
    gallery[] {
      asset,
      alt
    },
    price,
    location,
    neighborhood,
    geoLocation {
      lat,
      lng
    },
    bedrooms,
    bathrooms,
    squareMeters,
    description,
    features,
    propertyType,
    status,
    isFeatured,
    createdAt
  }
`

// Query para obtener solo las propiedades destacadas
export const getFeaturedProperties = groq`
  *[_type == "property" && isFeatured == true] | order(createdAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset,
      alt
    },
    gallery[] {
      asset,
      alt
    },
    price,
    location,
    neighborhood,
    geoLocation {
      lat,
      lng
    },
    bedrooms,
    bathrooms,
    squareMeters,
    description,
    features,
    propertyType,
    status,
    isFeatured,
    createdAt
  }
`

// Query para obtener una propiedad específica por slug
export const getPropertyBySlug = groq`
  *[_type == "property" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage {
      asset,
      alt
    },
    gallery[] {
      asset,
      alt
    },
    price,
    location,
    neighborhood,
    geoLocation {
      lat,
      lng
    },
    bedrooms,
    bathrooms,
    squareMeters,
    description,
    features,
    propertyType,
    status,
    isFeatured,
    createdAt
  }
`

// Query para obtener propiedades filtradas por tipo
export const getPropertiesByType = groq`
  *[_type == "property" && propertyType == $type] | order(createdAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset,
      alt
    },
    gallery[] {
      asset,
      alt
    },
    price,
    location,
    neighborhood,
    geoLocation {
      lat,
      lng
    },
    bedrooms,
    bathrooms,
    squareMeters,
    description,
    features,
    propertyType,
    status,
    isFeatured,
    createdAt
  }
`

// Query para obtener propiedades por estado
export const getPropertiesByStatus = groq`
  *[_type == "property" && status == $status] | order(createdAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset,
      alt
    },
    gallery[] {
      asset,
      alt
    },
    price,
    location,
    neighborhood,
    geoLocation {
      lat,
      lng
    },
    bedrooms,
    bathrooms,
    squareMeters,
    description,
    features,
    propertyType,
    status,
    isFeatured,
    createdAt
  }
`


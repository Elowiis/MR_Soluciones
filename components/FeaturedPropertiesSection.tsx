import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { getHomeProperties } from '@/lib/inmovilla/queries'
import { PropertyGrid } from './PropertyGrid'

export async function FeaturedPropertiesSection() {
  // Destacadas primero, como mucho 6. Si Supabase falla llega [] y la
  // sección no se pinta.
  const properties = await getHomeProperties()

  if (properties.length === 0) {
    return null
  }

  const featured = properties.filter((property) => property.isFeatured)
  const rest = properties.filter((property) => !property.isFeatured)

  // Con un solo bloque los títulos intermedios sobran: la cabecera ya lo dice.
  const showBlockTitles = featured.length > 0 && rest.length > 0

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-green-600 text-green-600" />
            Propiedades disponibles
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Descubre tu próximo{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              hogar
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Selección exclusiva de propiedades con las mejores ubicaciones y características
          </p>
        </div>

        {featured.length > 0 && (
          <div className={rest.length > 0 ? 'mb-10 sm:mb-12' : undefined}>
            {showBlockTitles && (
              <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
                <Star className="w-5 h-5 fill-green-600 text-green-600" />
                Destacadas
              </h3>
            )}
            <PropertyGrid
              properties={featured}
              emptyMessage="No hay propiedades destacadas disponibles en este momento"
            />
          </div>
        )}

        {rest.length > 0 && (
          <div>
            {showBlockTitles && (
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
                Más propiedades
              </h3>
            )}
            <PropertyGrid
              properties={rest}
              emptyMessage="No hay más propiedades disponibles en este momento"
            />
          </div>
        )}

        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-white px-6 py-3 text-sm sm:text-base font-semibold text-green-700 shadow-sm hover:bg-green-50 hover:border-green-600/50 hover:shadow-md transition-all duration-300"
          >
            Ver todas las propiedades
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

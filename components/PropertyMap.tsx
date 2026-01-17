'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface PropertyMapProps {
  lat: number
  lng: number
}

export function PropertyMap({ lat, lng }: PropertyMapProps) {
  // Calcular el bounding box para el mapa (área visible alrededor del punto)
  const bbox = `${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}`
  
  // URL del iframe de OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
  
  // URL de Google Maps
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border shadow-sm">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
          title="Mapa de ubicación de la propiedad"
        />
      </div>
      <div className="flex justify-center">
        <Link
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Ver en Google Maps
        </Link>
      </div>
    </div>
  )
}


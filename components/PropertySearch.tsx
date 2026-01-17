'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const zonas = [
  { value: 'todas', label: 'Todas las zonas' },
  { value: 'ponferrada', label: 'Ponferrada' },
  { value: 'bembibre', label: 'Bembibre' },
  { value: 'camponaraya', label: 'Camponaraya' },
  { value: 'carracedelo', label: 'Carracedelo' },
  { value: 'cacabelos', label: 'Cacabelos' },
  { value: 'villafranca', label: 'Villafranca del Bierzo' },
  { value: 'toral', label: 'Toral de los Vados' },
  { value: 'molinaseca', label: 'Molinaseca' },
]

const tiposPropiedad = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'piso', label: 'Piso' },
  { value: 'casa', label: 'Casa' },
  { value: 'garaje', label: 'Garaje' },
  { value: 'ático', label: 'Ático' },
  { value: 'local', label: 'Local' },
  { value: 'terreno', label: 'Terreno' },
]

const precios = [
  { value: 'sin-limite', label: 'Sin límite' },
  { value: '50000', label: '50.000€' },
  { value: '100000', label: '100.000€' },
  { value: '150000', label: '150.000€' },
  { value: '200000', label: '200.000€' },
  { value: '300000', label: '300.000€+' },
]

export function PropertySearch() {
  const router = useRouter()
  const [operacion, setOperacion] = useState('comprar')
  const [tipo, setTipo] = useState<string>('all')
  const [zona, setZona] = useState<string>('todas')
  const [precioMax, setPrecioMax] = useState<string>('sin-limite')

  const handleSearch = () => {
    const params = new URLSearchParams()

    // Siempre enviar la operación seleccionada para filtrar por venta/alquiler
    if (operacion) {
      params.set('operacion', operacion)
    }

    if (tipo && tipo !== 'all') {
      params.set('tipo', tipo)
    }

    if (zona && zona !== 'todas') {
      params.set('zona', zona)
    }

    if (precioMax && precioMax !== 'sin-limite') {
      params.set('precioMax', precioMax)
    }

    const queryString = params.toString()
    const url = queryString ? `/propiedades?${queryString}` : '/propiedades'

    router.push(url)
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-2">
      {/* Contenedor principal del buscador */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 p-2 md:p-3">
        {/* Header del buscador */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <div className="p-2 bg-green-100 rounded-xl">
            <Search className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Buscar propiedades</span>
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Filtros</span>
          </div>
        </div>

        {/* Campos de búsqueda */}
        <div className="p-2 md:p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3 items-stretch">
            
            {/* Operación */}
            <div className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200/70 transition-colors">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Operación
              </label>
              <Select value={operacion} onValueChange={setOperacion}>
                <SelectTrigger className="w-full border-0 bg-transparent hover:bg-transparent focus:bg-transparent h-8 text-gray-900 font-medium p-0 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprar">Comprar</SelectItem>
                  <SelectItem value="alquilar">Alquilar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200/70 transition-colors">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Tipo
              </label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="w-full border-0 bg-transparent hover:bg-transparent focus:bg-transparent h-8 text-gray-900 font-medium p-0 focus:ring-0">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPropiedad.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ubicación */}
            <div className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200/70 transition-colors">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Ubicación
              </label>
              <Select value={zona} onValueChange={setZona}>
                <SelectTrigger className="w-full border-0 bg-transparent hover:bg-transparent focus:bg-transparent h-8 text-gray-900 font-medium p-0 focus:ring-0">
                  <SelectValue placeholder="Todas las zonas" />
                </SelectTrigger>
                <SelectContent>
                  {zonas.map((zona) => (
                    <SelectItem key={zona.value} value={zona.value}>
                      {zona.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Precio */}
            <div className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200/70 transition-colors">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Precio máximo
              </label>
              <Select value={precioMax} onValueChange={setPrecioMax}>
                <SelectTrigger className="w-full border-0 bg-transparent hover:bg-transparent focus:bg-transparent h-8 text-gray-900 font-medium p-0 focus:ring-0">
                  <SelectValue placeholder="Sin límite" />
                </SelectTrigger>
                <SelectContent>
                  {precios.map((precio) => (
                    <SelectItem key={precio.value} value={precio.value}>
                      {precio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón Buscar */}
            <div className="md:col-span-2 lg:col-span-1 flex">
              <Button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl text-base shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 h-full min-h-[60px]"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
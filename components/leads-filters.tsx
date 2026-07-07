"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Filter, TrendingUp, Users, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

interface LeadsFiltersProps {
  searchTerm: string
  selectedType: string
  selectedState: string
  selectedScore: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onStateChange: (value: string) => void
  onScoreChange: (value: string) => void
  onClearFilters: () => void
}

export function LeadsFilters({
  searchTerm,
  selectedType,
  selectedState,
  selectedScore,
  onSearchChange,
  onTypeChange,
  onStateChange,
  onScoreChange,
  onClearFilters,
}: LeadsFiltersProps) {
  const hasActiveFilters = selectedType || selectedState || selectedScore || searchTerm

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        
        {hasActiveFilters && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
          >
            Filtros activos
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all rounded-xl"
          />
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Type Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Tipo de lead
            </label>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:border-gray-400"
            >
              <option value="">Todos los tipos</option>
              <option value="Comprador">🛒 Comprador</option>
              <option value="Vendedor">💰 Vendedor</option>
              <option value="Arriendo">🔑 Arriendo</option>
            </select>
            <div className="absolute right-4 top-11 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>

          {/* State Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Estado
            </label>
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:border-gray-400"
            >
              <option value="">Todos los estados</option>
              <option value="Nuevo">🆕 Nuevo</option>
              <option value="Contactado">📞 Contactado</option>
              <option value="Calificado">✅ Calificado</option>
              <option value="Visitando">🏠 Visitando</option>
              <option value="Negociando">💼 Negociando</option>
              <option value="Cerrado">🎉 Cerrado</option>
              <option value="Perdido">❌ Perdido</option>
            </select>
            <div className="absolute right-4 top-11 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>

          {/* Score Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              Score
            </label>
            <select
              value={selectedScore}
              onChange={(e) => onScoreChange(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:border-gray-400"
            >
              <option value="">Todos los scores</option>
              <option value="hot">🔥 Caliente (70+)</option>
              <option value="warm">☀️ Tibio (40-69)</option>
              <option value="cold">❄️ Frío (0-39)</option>
            </select>
            <div className="absolute right-4 top-11 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>

          {/* Clear Filters Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-end"
          >
            <Button 
              onClick={onClearFilters} 
              variant="outline"
              disabled={!hasActiveFilters}
              className={`w-full h-12 rounded-xl font-medium transition-all ${
                hasActiveFilters 
                  ? "border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400" 
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar filtros
            </Button>
          </motion.div>
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 pt-4 border-t border-gray-200"
          >
            {searchTerm && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                <Search className="w-3 h-3" />
                <span>"{searchTerm}"</span>
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            {selectedType && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                <Users className="w-3 h-3" />
                <span>{selectedType}</span>
                <button
                  onClick={() => onTypeChange("")}
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            {selectedState && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                <TrendingUp className="w-3 h-3" />
                <span>{selectedState}</span>
                <button
                  onClick={() => onStateChange("")}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            {selectedScore && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
              >
                <BarChart3 className="w-3 h-3" />
                <span>
                  {selectedScore === "hot" && "Caliente"}
                  {selectedScore === "warm" && "Tibio"}
                  {selectedScore === "cold" && "Frío"}
                </span>
                <button
                  onClick={() => onScoreChange("")}
                  className="ml-1 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
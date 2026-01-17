"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminSidebar } from "@/components/admin-sidebar"
import { LeadsFilters } from "@/components/leads-filters"
import { LeadsTable } from "@/components/leads-table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Lead } from "@/lib/lead-utils"
import { Download } from "lucide-react"
import { LeadDetailModal } from "@/components/lead-detail-modal"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <LeadsContent />
    </ProtectedRoute>
  )
}

function LeadsContent() {
  const { toast } = useToast()
  const { data: leads = [], mutate } = useSWR<Lead[]>("/api/leads", fetcher, {
    revalidateOnFocus: false,
  })

  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedScore, setSelectedScore] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let filtered = [...leads]

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.nombre.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.whatsapp.includes(search),
      )
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter((lead) => lead.tipo === selectedType)
    }

    // State filter
    if (selectedState) {
      filtered = filtered.filter((lead) => lead.estado === selectedState)
    }

    // Score filter
    if (selectedScore === "hot") {
      filtered = filtered.filter((lead) => lead.score >= 70)
    } else if (selectedScore === "warm") {
      filtered = filtered.filter((lead) => lead.score >= 40 && lead.score < 70)
    } else if (selectedScore === "cold") {
      filtered = filtered.filter((lead) => lead.score < 40)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, selectedType, selectedState, selectedScore])

  const handleDelete = async (leadId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este lead?")) return

    try {
      await fetch(`/api/leads/${leadId}`, { method: "DELETE" })
      mutate()
      toast({ title: "Éxito", description: "Lead eliminado correctamente" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el lead" })
    }
  }

  const handleExportExcel = () => {
    if (filteredLeads.length === 0) {
      toast({ title: "Error", description: "No hay leads para exportar" })
      return
    }

    const csvContent = [
      ["Nombre", "Email", "WhatsApp", "Tipo", "Score", "Estado", "Zona", "Fecha"],
      ...filteredLeads.map((lead) => [
        lead.nombre,
        lead.email,
        lead.whatsapp,
        lead.tipo,
        lead.score,
        lead.estado,
        lead.zona || lead.zonaPropiedad || "-",
        new Date(lead.createdAt).toLocaleDateString("es-ES"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({ title: "Éxito", description: "Leads exportados a Excel" })
  }

  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  const handleSaveLead = async (updatedLead: Lead) => {
    try {
      await fetch(`/api/leads/${updatedLead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLead),
      })
      mutate()
      setIsModalOpen(false)
      toast({ title: "Éxito", description: "Lead actualizado correctamente" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar el lead" })
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Leads</h1>
              <p className="text-muted-foreground mt-1">Total: {filteredLeads.length} leads</p>
            </div>
            <Button onClick={handleExportExcel} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Excel
            </Button>
          </div>

          <LeadsFilters
            searchTerm={searchTerm}
            selectedType={selectedType}
            selectedState={selectedState}
            selectedScore={selectedScore}
            onSearchChange={setSearchTerm}
            onTypeChange={setSelectedType}
            onStateChange={setSelectedState}
            onScoreChange={setSelectedScore}
            onClearFilters={() => {
              setSearchTerm("")
              setSelectedType("")
              setSelectedState("")
              setSelectedScore("")
            }}
          />

          <LeadsTable leads={filteredLeads} onViewDetail={handleViewDetail} onDelete={handleDelete} />

          <LeadDetailModal
            lead={selectedLead}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveLead}
          />
        </div>
      </main>
    </div>
  )
}

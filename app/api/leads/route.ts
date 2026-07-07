import { type NextRequest, NextResponse } from "next/server"

// Mock database for leads
const leadsStore: any[] = []

// Calculate score based on lead data
function calculateScore(lead: any) {
  let score = 0

  if (lead.tipo === "Comprador") {
    if (lead.presupuesto && lead.presupuesto !== "No lo sé") score += 20

    if (lead.urgencia === "Menos de 1 mes") score += 30
    else if (lead.urgencia === "1-3 meses") score += 20
    else if (lead.urgencia === "3-6 meses") score += 10

    const zonasPremium = ["Norte", "Centro"]
    if (lead.zona && zonasPremium.includes(lead.zona)) score += 15

    if (lead.tipoPropiedad) score += 10
    if (lead.habitaciones) score += 5
  } else if (lead.tipo === "Vendedor") {
    if (lead.documentosRegla === "Sí todo en regla") score += 20
    if (lead.urgenciaVenta === "Urgente (menos 1 mes)") score += 25
    else if (lead.urgenciaVenta === "1-3 meses") score += 15

    if (lead.metrosCuadrados) score += 10
    if (lead.precioEsperado && lead.precioEsperado !== "No lo sé") score += 15

    if (lead.habitacionesVenta) score += 5
  }

  if (lead.whatsapp && lead.email) score += 10

  return Math.min(score, 100)
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(leadsStore)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newLead = {
      id: Date.now().toString(),
      ...body,
      score: calculateScore(body),
      estado: "Nuevo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    leadsStore.push(newLead)

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

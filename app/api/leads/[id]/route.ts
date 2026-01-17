import { type NextRequest, NextResponse } from "next/server"

// Mock database for leads
const leadsStore: any[] = []

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lead = leadsStore.find((l) => l.id === id)

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const leadIndex = leadsStore.findIndex((l) => l.id === id)
    if (leadIndex === -1) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    leadsStore[leadIndex] = {
      ...leadsStore[leadIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(leadsStore[leadIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const leadIndex = leadsStore.findIndex((l) => l.id === id)

    if (leadIndex === -1) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    leadsStore.splice(leadIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

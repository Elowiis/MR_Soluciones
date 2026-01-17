-- Create tables
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Lead" (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  tipo TEXT NOT NULL,
  presupuesto TEXT,
  zona TEXT,
  "tipoPropiedad" TEXT,
  habitaciones TEXT,
  urgencia TEXT,
  "zonaPropiedad" TEXT,
  "tipoVenta" TEXT,
  "metrosCuadrados" INTEGER,
  "habitacionesVenta" TEXT,
  "precioEsperado" TEXT,
  "documentosRegla" TEXT,
  "urgenciaVenta" TEXT,
  mensaje TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'Nuevo',
  "agenteAsignado" TEXT,
  notas TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "Lead_email_idx" ON "Lead"(email);
CREATE INDEX IF NOT EXISTS "Lead_tipo_idx" ON "Lead"(tipo);
CREATE INDEX IF NOT EXISTS "Lead_estado_idx" ON "Lead"(estado);
CREATE INDEX IF NOT EXISTS "Lead_score_idx" ON "Lead"(score);

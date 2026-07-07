import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conócenos - MR Soluciones Inmobiliarias',
  description: 'Conoce más sobre MR Soluciones Inmobiliarias, nuestro equipo y nuestra experiencia en el mercado inmobiliario.',
}

export default function ConocenosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


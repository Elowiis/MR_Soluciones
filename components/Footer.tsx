import Link from 'next/link'
import { Building2, Phone, Mail, MapPin, Instagram } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/conocenos', label: 'Conócenos' },
    { href: '/#lead-form', label: 'Contacto' },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
            >
              <Building2 className="w-6 h-6 text-primary" />
              <span>MR Soluciones Inmobiliarias</span>
            </Link>
            <p className="text-sm text-background/80 leading-relaxed">
              Tu aliado de confianza en el mercado inmobiliario. Conectamos compradores, vendedores e inversores con las mejores oportunidades.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-1 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-sm text-background/80 hover:text-background transition-colors min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div className="min-h-[44px] flex flex-col justify-center">
                  <p className="text-sm text-background/80">Teléfono</p>
                  <a
                    href="tel:+573001234567"
                    className="text-sm text-background hover:underline"
                  >
                    +57 300 123 4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div className="min-h-[44px] flex flex-col justify-center">
                  <p className="text-sm text-background/80">Email</p>
                  <a
                    href="mailto:info@mrsoluciones.com"
                    className="text-sm text-background hover:underline break-all"
                  >
                    info@mrsoluciones.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div className="min-h-[44px] flex flex-col justify-center">
                  <p className="text-sm text-background/80">Dirección</p>
                  <p className="text-sm text-background">
                    Avenida de España, 37, 1ºA
                    <br />
                    24400 Ponferrada, León
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://www.instagram.com/mr_solucionesinmobiliarias?igsh=MTllZGdpdzVyNmI2Nw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/20 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-background/80 text-center md:text-left">
              &copy; {currentYear} MR Soluciones Inmobiliarias. Todos los derechos reservados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs sm:text-sm text-background/80">
              <Link href="#" className="hover:text-background transition-colors min-h-[44px] flex items-center justify-center">
                Términos y Condiciones
              </Link>
              <Link href="#" className="hover:text-background transition-colors min-h-[44px] flex items-center justify-center">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
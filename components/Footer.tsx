import Link from 'next/link'
import { Building2, Phone, Mail, MapPin, Instagram, ArrowUpRight } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/conocenos', label: 'Conócenos' },
    { href: '/#lead-form', label: 'Contacto' },
  ]

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Decorative accent line at top */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Main grid — 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Column 1: Brand + Social */}
          <div className="space-y-6 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group"
            >
              <Building2 className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold tracking-tight">
                MR Soluciones
                <br />
                <span className="text-primary">Inmobiliarias</span>
              </span>
            </Link>

            <p className="text-sm text-background/60 leading-relaxed max-w-xs">
              Tu aliado de confianza en el mercado inmobiliario. Conectamos compradores, vendedores e inversores con las mejores oportunidades.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/mr_solucionesinmobiliarias?igsh=MTllZGdpdzVyNmI2Nw=="
                target="_blank"
                rel="noopener noreferrer"
                className="group/icon flex items-center gap-2 px-4 py-2.5 rounded-full border border-background/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-background/70 group-hover/icon:text-primary transition-colors" />
                <span className="text-xs text-background/70 group-hover/icon:text-primary transition-colors">
                  @mr_solucionesinmobiliarias
                </span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation + Legal */}
          <div className="grid grid-cols-2 gap-8">
            {/* Nav links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-5">
                Navegación
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group/link inline-flex items-center gap-1.5 text-sm text-background/70 hover:text-background transition-colors"
                    >
                      <span className="w-0 group-hover/link:w-2 h-px bg-primary transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-5">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/legal/aviso-legal"
                    className="group/link inline-flex items-center gap-1.5 text-sm text-background/70 hover:text-background transition-colors"
                  >
                    <span className="w-0 group-hover/link:w-2 h-px bg-primary transition-all duration-300" />
                    Aviso Legal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/politica-cookies"
                    className="group/link inline-flex items-center gap-1.5 text-sm text-background/70 hover:text-background transition-colors"
                  >
                    <span className="w-0 group-hover/link:w-2 h-px bg-primary transition-all duration-300" />
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-5">
              Contacto
            </h3>
            <ul className="space-y-5">
              <li>
                <a
                  href="tel:+573001234567"
                  className="group/contact flex items-center gap-3 hover:translate-x-1 transition-transform duration-300"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover/contact:bg-primary/20 transition-colors">
                    <Phone className="w-4 h-4 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs text-background/40">Teléfono</p>
                    <p className="text-sm text-background/80 group-hover/contact:text-background transition-colors">
                      +57 300 123 4567
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@mrsoluciones.com"
                  className="group/contact flex items-center gap-3 hover:translate-x-1 transition-transform duration-300"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover/contact:bg-primary/20 transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs text-background/40">Email</p>
                    <p className="text-sm text-background/80 group-hover/contact:text-background transition-colors break-all">
                      info@mrsoluciones.com
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <MapPin className="w-4 h-4 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs text-background/40">Dirección</p>
                    <p className="text-sm text-background/80">
                      Avenida de España, 37, 1ºA
                      <br />
                      24400 Ponferrada, León
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 mt-12 sm:mt-16 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-background/40 text-center sm:text-left">
              &copy; {currentYear} MR Soluciones Inmobiliarias. Todos los derechos reservados.
            </p>
            <p className="text-xs text-background/30">
              Ponferrada, León — España
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
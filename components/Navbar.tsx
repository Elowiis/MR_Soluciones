'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Building2, Users, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Memoizar el handler del scroll para mejor rendimiento
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Verificar estado inicial
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Cerrar menú con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/propiedades', label: 'Propiedades', icon: Building2 },
    { href: '/conocenos', label: 'Conócenos', icon: Users },
    { href: '/#lead-form', label: 'Contacto', icon: Mail },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    if (href.startsWith('/#')) {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isOpen
            ? 'bg-background shadow-lg border-b border-border'
            : isScrolled
              ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border'
              : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
              onClick={closeMenu}
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="MR Soluciones Inmobiliarias"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <span className="hidden sm:inline truncate">MR Soluciones Inmobiliarias</span>
              <span className="sm:hidden font-bold">MR</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.href)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={cn(
                'md:hidden p-2.5 rounded-xl transition-all duration-200 touch-manipulation',
                isOpen 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-accent active:scale-95'
              )}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={cn(
                    'w-6 h-6 absolute inset-0 transition-all duration-300',
                    isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                  )} 
                />
                <X 
                  className={cn(
                    'w-6 h-6 absolute inset-0 transition-all duration-300',
                    isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                  )} 
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden fixed top-16 left-0 right-0 bottom-0 z-40 bg-background transition-all duration-300 ease-out',
          isOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-4'
        )}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Navigation Links */}
          <nav className="px-4 pt-6 pb-4 space-y-2 flex-1" role="navigation">
            {navLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    'flex items-center gap-4 px-5 py-4 rounded-xl text-lg font-medium transition-all duration-200 active:scale-[0.98]',
                    isActive(link.href)
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground bg-muted/50'
                  )}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-10px)',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer del menú */}
          <div className="px-4 pb-8 pt-4 border-t border-border mt-auto">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Tu hogar ideal te espera
            </p>
            <button
              onClick={closeMenu}
              className="w-full px-6 py-3.5 rounded-xl text-base font-medium bg-muted hover:bg-muted/80 text-foreground transition-all duration-200 active:scale-[0.98]"
            >
              Cerrar menú
            </button>
          </div>
        </div>
      </div>

      {/* Spacer para evitar que el contenido quede debajo del navbar */}
      <div className="h-16 md:h-20" />
    </>
  )
}
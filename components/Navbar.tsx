'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Building2, Users, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
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
      // Los anchors no marcan estado activo (evita doble resaltado con Inicio)
      return false
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Geometría fija (posición/tamaño nunca cambian): solo animan color,
          borde y sombra → la transición barra↔pill es un fundido, sin saltos */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3 lg:px-8">
        <div
          className={cn(
            'mx-auto max-w-7xl rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500 ease-out',
            isOpen
              ? 'bg-background border-border shadow-lg'
              : isScrolled
                ? 'bg-background/90 backdrop-blur-md border-border/70 shadow-lg shadow-black/5'
                : 'bg-transparent border-transparent'
          )}
        >
          <div className="flex items-center justify-between h-14 md:h-16 px-3 sm:px-5">
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

            {/* Desktop Navigation - segmented control glass con indicador deslizante */}
            <div
              className={cn(
                'hidden md:flex items-center gap-1 rounded-full p-1 border transition-colors duration-500',
                isScrolled || isOpen
                  ? 'border-border/60 bg-muted/50'
                  : 'border-border/40 bg-background/50 backdrop-blur-sm'
              )}
            >
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200',
                      active
                        ? 'text-primary-foreground'
                        : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/30"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={cn(
                'md:hidden p-2.5 rounded-full border transition-colors duration-300 touch-manipulation',
                isOpen
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'text-foreground border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent active:scale-95'
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
          'md:hidden fixed top-[4.5rem] inset-x-2 bottom-2 z-40 bg-background rounded-2xl border border-border shadow-2xl transition-all duration-300 ease-out',
          isOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-4'
        )}
      >
        <div className="h-full flex flex-col overflow-y-auto rounded-2xl">
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
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'text-foreground bg-muted/50 hover:bg-accent hover:text-accent-foreground'
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
              className="w-full px-6 py-3.5 rounded-xl text-base font-medium border border-border bg-muted hover:bg-muted/80 text-foreground transition-all duration-200 active:scale-[0.98]"
            >
              Cerrar menú
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
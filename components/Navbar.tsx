'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/conocenos', label: 'Conócenos' },
    { href: '/#lead-form', label: 'Contacto' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-md border-b border-border'
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
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
              <Image
                src="/logo.jpg"
                alt="MR Soluciones Inmobiliarias"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <span className="hidden sm:inline">MR Soluciones Inmobiliarias</span>
            <span className="sm:hidden">MR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
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
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Fullscreen */}
      <div
        className={cn(
          'md:hidden fixed inset-0 top-16 z-50 bg-background transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        )}
      >
        <div className="h-full flex flex-col">
          <div className="px-4 pt-6 pb-4 space-y-2 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  'block px-6 py-4 rounded-lg text-lg font-medium transition-colors min-h-[44px] flex items-center',
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Close button area */}
          <div className="px-4 pb-8">
            <button
              onClick={closeMenu}
              className="w-full px-6 py-4 rounded-lg text-base font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors min-h-[44px]"
            >
              Cerrar menú
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
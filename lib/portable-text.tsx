'use client'

import React, { ReactNode } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface PortableTextBlock {
  _type: string
  _key?: string
  children?: Array<{
    _type: string
    _key?: string
    text?: string
    marks?: string[]
  }>
  style?: string
  markDefs?: Array<{
    _type: string
    _key: string
    href?: string
  }>
  asset?: any
  alt?: string
}

interface PortableTextProps {
  value: PortableTextBlock[] | null | undefined
}

export function PortableText({ value }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null
  }

  return (
    <div className="space-y-4">
      {value.map((block, index) => {
        if (block._type === 'block') {
          const text = block.children
            ?.map((child: any) => child.text || '')
            .join('') || ''

          // Aplicar estilos
          type ElementType = 'p' | 'h2' | 'h3' | 'blockquote'
          let elementType: ElementType = 'p'
          let className = ''

          switch (block.style) {
            case 'h2':
              elementType = 'h2'
              className = 'text-2xl font-bold mt-6 mb-4'
              break
            case 'h3':
              elementType = 'h3'
              className = 'text-xl font-semibold mt-4 mb-2'
              break
            case 'blockquote':
              elementType = 'blockquote'
              className = 'border-l-4 border-primary pl-4 italic my-4'
              break
            default:
              elementType = 'p'
              className = 'mb-4'
          }

          // Aplicar marcas (negrita, cursiva, enlaces)
          let content: ReactNode = text
          
          if (block.children) {
            content = block.children.map((child: any, childIndex: number) => {
              let textNode: ReactNode = child.text || ''

              // Aplicar marcas
              if (child.marks && child.marks.length > 0) {
                let processedText: ReactNode = child.text || ''
                
                child.marks.forEach((mark: string) => {
                  const markDef = block.markDefs?.find((def) => def._key === mark)
                  
                  if (markDef?._type === 'link') {
                    const href = markDef.href || '#'
                    const isExternal = href.startsWith('http')
                    processedText = (
                      <a
                        key={`${childIndex}-link`}
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="text-primary hover:underline"
                      >
                        {processedText}
                      </a>
                    )
                  } else if (mark === 'strong') {
                    processedText = <strong key={`${childIndex}-strong`}>{processedText}</strong>
                  } else if (mark === 'em') {
                    processedText = <em key={`${childIndex}-em`}>{processedText}</em>
                  }
                })
                
                textNode = processedText
              }

              return <React.Fragment key={childIndex}>{textNode}</React.Fragment>
            })
          }

          return React.createElement(
            elementType,
            {
              key: block._key || index,
              className: className,
            },
            content
          )
        }

        if (block._type === 'image' && block.asset) {
          const imageUrl = urlFor(block).width(800).url()
          return (
            <div key={block._key || index} className="my-4">
              <Image
                src={imageUrl}
                alt={block.alt || 'Imagen'}
                width={800}
                height={600}
                className="rounded-lg"
              />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}


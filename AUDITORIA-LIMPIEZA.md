# AUDITORÍA COMPLETA DE LIMPIEZA
## Proyecto Next.js + Sanity + TypeScript

---

## DEPENDENCIAS A ELIMINAR

### Dependencias potencialmente no usadas:
- **@hookform/resolvers**: No se encontró uso de react-hook-form con resolvers
- **@radix-ui/react-accordion**: No se encontró componente Accordion en uso
- **@radix-ui/react-aspect-ratio**: No se encontró uso de AspectRatio
- **@radix-ui/react-avatar**: No se encontró uso de Avatar
- **@radix-ui/react-collapsible**: No se encontró uso de Collapsible
- **@radix-ui/react-context-menu**: No se encontró uso de ContextMenu
- **@radix-ui/react-hover-card**: No se encontró uso de HoverCard
- **@radix-ui/react-menubar**: No se encontró uso de Menubar
- **@radix-ui/react-navigation-menu**: No se encontró uso de NavigationMenu
- **@radix-ui/react-progress**: No se encontró uso de Progress
- **@radix-ui/react-radio-group**: No se encontró uso de RadioGroup
- **@radix-ui/react-scroll-area**: No se encontró uso de ScrollArea
- **@radix-ui/react-slider**: No se encontró uso de Slider
- **@radix-ui/react-switch**: No se encontró uso de Switch
- **@radix-ui/react-tabs**: No se encontró uso de Tabs
- **@radix-ui/react-toggle**: No se encontró uso de Toggle
- **@radix-ui/react-toggle-group**: No se encontró uso de ToggleGroup
- **@radix-ui/react-tooltip**: No se encontró uso de Tooltip
- **@sanity/google-maps-input**: No se encontró uso de Google Maps input
- **cmdk**: No se encontró uso de Command component
- **date-fns**: No se encontró uso directo (puede estar en Sanity internamente)
- **embla-carousel-react**: No se encontró uso de carousel
- **input-otp**: No se encontró uso de OTP input
- **react-day-picker**: No se encontró uso de date picker
- **react-hook-form**: No se encontró uso explícito (aunque está en imports)
- **react-resizable-panels**: No se encontró uso de resizable panels
- **recharts**: No se encontró uso de gráficos
- **styled-components**: No se encontró uso (el proyecto usa Tailwind)
- **vaul**: No se encontró uso de drawer component
- **zod**: No se encontró uso de validación con Zod
- **@vercel/analytics**: No se encontró uso de Analytics component

**NOTA**: Se recomienda verificar manualmente cada dependencia antes de eliminar, especialmente las que podrían estar en componentes UI no revisados o en archivos de configuración.

---

## IMPORTS A LIMPIAR

### app/propiedades/page.tsx
- **Línea 5**: `getPropertiesByType, getPropertiesByStatus` - Se importan pero no se usan (solo se usa `getAllProperties`)

### components/lead-form.tsx
- **Línea 497**: Error de sintaxis - hay un espacio extra antes de `SelectTrigger`

---

## ARCHIVOS A ELIMINAR

### Componentes duplicados/no usados:
- **components/featured-properties.tsx**: Componente duplicado que parece ser una versión anterior de `FeaturedPropertiesSection.tsx`. El archivo usa datos hardcodeados y no se importa en ningún lugar. `FeaturedPropertiesSection.tsx` es la versión actual que usa datos de Sanity.

---

## CÓDIGO A LIMPIAR

### app/propiedades/page.tsx
- **Línea 5**: Imports no utilizados: `getPropertiesByType`, `getPropertiesByStatus`

### components/lead-form.tsx
- **Línea 497**: Error de sintaxis con espacio extra: `<                SelectTrigger` debería ser `<SelectTrigger`

### components/PropertyCard.tsx
- **Líneas 61-62**: Props `hover` e `interactive` no son propiedades válidas de Card component y no se utilizan

### components/testimonials.tsx
- **Línea 65**: Falta `transition` en el motion.div

### components/featured-properties.tsx (archivo completo)
- Archivo completo debería eliminarse (es una versión antigua no usada)

---

## CONSOLE.LOGS A ELIMINAR

### app/propiedades/page.tsx
- **Línea 53**: `console.error('Error fetching properties:', error)` - Este console.error debería mantenerse o reemplazarse por un sistema de logging apropiado. **RECOMENDACIÓN**: Mantener para debugging pero considerar usar un servicio de logging en producción.

### components/lead-form.tsx
- **Línea 259**: `console.error("Error al enviar:", error)` - Similar al anterior, debería mantenerse o reemplazarse por logging apropiado. **RECOMENDACIÓN**: Mantener pero considerar logging service.

---

## RECOMENDACIONES DE ESTRUCTURA

### 1. Duplicación de Componentes
- **Problema**: Existen `featured-properties.tsx` y `FeaturedPropertiesSection.tsx` que cumplen funciones similares
- **Recomendación**: Eliminar `featured-properties.tsx` y mantener solo `FeaturedPropertiesSection.tsx`

### 2. Convenciones de Nomenclatura
- **Problema**: Mezcla de camelCase y PascalCase en nombres de archivos de componentes
- **Recomendación**: Establecer una convención consistente (recomendado PascalCase para componentes React: `FeaturedPropertiesSection.tsx`, `LeadForm.tsx`, etc.)

### 3. Organización de Imports
- **Problema**: Algunos archivos tienen imports sin usar
- **Recomendación**: Usar ESLint con regla `no-unused-vars` para detectar automáticamente imports no utilizados

### 4. Archivos de Utilidades
- **Observación**: `lib/lead-utils.ts` contiene tipos e interfaces que podrían estar mejor en `types/leads.ts`
- **Recomendación**: Separar tipos/interfaces de funciones utilitarias para mejor organización

### 5. Validación de Formularios
- **Observación**: El formulario `lead-form.tsx` tiene validación manual, pero `zod` está instalado y no se usa
- **Recomendación**: Considerar usar Zod para validación de formularios o eliminar la dependencia si no se usará

### 6. Manejo de Errores
- **Observación**: Los `console.error` están presentes pero no hay un sistema centralizado de logging
- **Recomendación**: Implementar un sistema de logging (como Sentry, LogRocket, o un servicio personalizado) o al menos un wrapper para console.error

### 7. Componentes UI
- **Observación**: Muchos componentes de Radix UI están instalados pero no se usan
- **Recomendación**: Instalar solo los componentes de Radix UI que realmente se necesiten cuando se necesiten

### 8. Archivo de Hooks
- **Observación**: Solo hay un hook (`use-toast.ts`) en la carpeta `hooks/`
- **Recomendación**: Si solo hay uno, considerar moverlo a `lib/` o mantener la estructura si se planea agregar más hooks

---

## RESUMEN ESTADÍSTICO

- **Dependencias a revisar**: ~30 paquetes
- **Imports sin usar**: 2 archivos
- **Archivos duplicados/no usados**: 1 archivo
- **Console.logs encontrados**: 2 (pero son console.error, considerar mantenerlos)
- **Errores de sintaxis**: 1
- **Componentes con props inválidas**: 1

---

## PRIORIDAD DE LIMPIEZA

### Alta Prioridad:
1. ✅ Eliminar `components/featured-properties.tsx` (duplicado)
2. ✅ Corregir error de sintaxis en `components/lead-form.tsx` línea 497
3. ✅ Eliminar imports no usados en `app/propiedades/page.tsx`

### Media Prioridad:
4. ⚠️ Revisar y eliminar dependencias no usadas de Radix UI
5. ⚠️ Reorganizar tipos en `lib/lead-utils.ts`
6. ⚠️ Corregir props inválidas en `components/PropertyCard.tsx`

### Baja Prioridad:
7. 💡 Considerar sistema de logging centralizado
8. 💡 Estandarizar convenciones de nomenclatura
9. 💡 Implementar o eliminar Zod para validación

---

**NOTA FINAL**: Este informe se generó mediante análisis automático. Se recomienda revisar manualmente cada elemento antes de realizar cambios, especialmente las dependencias que podrían estar en uso de forma indirecta o en archivos de configuración no analizados.


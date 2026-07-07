import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "border-border shadow-lg",
        outline: "border-2 border-border",
        ghost: "border-transparent shadow-none",
        gradient: "border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950",
        "gradient-success": "border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
        "gradient-warning": "border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950",
      },
      padding: {
        default: "py-6",
        sm: "py-4",
        lg: "py-8",
        none: "py-0",
      },
      hover: {
        none: "",
        lift: "hover:shadow-xl hover:-translate-y-1",
        glow: "hover:shadow-2xl hover:shadow-blue-500/20",
        scale: "hover:scale-[1.02]",
        border: "hover:border-primary",
      },
      interactive: {
        false: "",
        true: "cursor-pointer active:scale-[0.98]",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      hover: "none",
      interactive: false,
    },
  }
)

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  /** Hace la card clickeable */
  onClick?: () => void
  /** Agrega un badge en la esquina superior derecha */
  badge?: React.ReactNode
  /** Agrega un overlay con gradiente */
  overlay?: boolean
}

function Card({ 
  className, 
  variant, 
  padding, 
  hover, 
  interactive,
  onClick,
  badge,
  overlay = false,
  children,
  ...props 
}: CardProps) {
  return (
    <div
      data-slot="card"
      onClick={onClick}
      className={cn(
        cardVariants({ 
          variant, 
          padding, 
          hover, 
          interactive: interactive || !!onClick ? true : false 
        }), 
        className
      )}
      {...props}
    >
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 rounded-xl pointer-events-none" />
      )}
      {badge && (
        <div className="absolute -top-2 -right-2 z-10">
          {badge}
        </div>
      )}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

interface CardTitleProps extends React.ComponentProps<"div"> {
  /** Agrega un icono antes del título */
  icon?: React.ReactNode
}

function CardTitle({ className, icon, children, ...props }: CardTitleProps) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold flex items-center gap-2", className)}
      {...props}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </div>
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

// Nuevos componentes adicionales

function CardImage({ 
  className, 
  src, 
  alt,
  aspectRatio = "16/9",
  ...props 
}: React.ComponentProps<"img"> & { 
  src: string
  alt: string
  aspectRatio?: string 
}) {
  return (
    <div 
      className="relative w-full overflow-hidden rounded-t-xl"
      style={{ aspectRatio }}
    >
      <img
        data-slot="card-image"
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-transform duration-300 hover:scale-110",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CardBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-badge"
      className={cn(
        "absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg",
        className
      )}
      {...props}
    />
  )
}

function CardDivider({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <hr
      data-slot="card-divider"
      className={cn("mx-6 border-t border-border", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardImage,
  CardBadge,
  CardDivider,
  cardVariants,
}
export type { CardProps, CardTitleProps }
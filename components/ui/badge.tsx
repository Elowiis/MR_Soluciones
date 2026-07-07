import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-sm",
        outline:
          "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Nuevas variantes personalizadas
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600 shadow-sm",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600 shadow-sm",
        info:
          "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600 shadow-sm",
        purple:
          "border-transparent bg-purple-500 text-white [a&]:hover:bg-purple-600 shadow-sm",
        // Variantes con bordes (outline versions)
        "outline-success":
          "border-2 border-green-500 text-green-700 bg-green-50 [a&]:hover:bg-green-100",
        "outline-warning":
          "border-2 border-yellow-500 text-yellow-700 bg-yellow-50 [a&]:hover:bg-yellow-100",
        "outline-info":
          "border-2 border-blue-500 text-blue-700 bg-blue-50 [a&]:hover:bg-blue-100",
        "outline-purple":
          "border-2 border-purple-500 text-purple-700 bg-purple-50 [a&]:hover:bg-purple-100",
        // Variantes con gradientes
        gradient:
          "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white [a&]:hover:from-blue-700 [a&]:hover:to-indigo-700 shadow-lg",
        "gradient-success":
          "border-transparent bg-gradient-to-r from-green-500 to-emerald-600 text-white [a&]:hover:from-green-600 [a&]:hover:to-emerald-700 shadow-lg",
        "gradient-warning":
          "border-transparent bg-gradient-to-r from-yellow-500 to-orange-600 text-white [a&]:hover:from-yellow-600 [a&]:hover:to-orange-700 shadow-lg",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  /** Añade un punto indicador animado */
  dot?: boolean
  /** Color del punto (si dot es true) */
  dotColor?: "green" | "red" | "yellow" | "blue" | "gray"
  /** Hace el badge removible con icono X */
  removable?: boolean
  /** Callback cuando se remueve */
  onRemove?: () => void
}

function Badge({
  className,
  variant,
  size,
  animation,
  asChild = false,
  dot = false,
  dotColor = "green",
  removable = false,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  const dotColors = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    gray: "bg-gray-500",
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, animation }), className)}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              dotColors[dotColor]
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              dotColors[dotColor]
            )}
          />
        </span>
      )}
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3 h-3"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </Comp>
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
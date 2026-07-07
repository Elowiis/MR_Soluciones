import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 text-base shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "",
        filled: "bg-gray-100 dark:bg-gray-800 border-transparent focus-visible:bg-white dark:focus-visible:bg-gray-900",
        flushed: "border-0 border-b-2 rounded-none px-0 focus-visible:border-primary focus-visible:ring-0",
        ghost: "border-transparent shadow-none hover:border-input",
      },
      inputSize: {
        sm: "h-8 py-1 text-sm",
        default: "h-9 py-1",
        lg: "h-11 py-2 text-base",
        xl: "h-12 py-3 text-lg",
      },
      state: {
        default: "",
        error: "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
        success: "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-200",
        warning: "border-yellow-500 focus-visible:border-yellow-500 focus-visible:ring-yellow-200",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  }
)

interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Icono a la izquierda */
  leftIcon?: React.ReactNode
  /** Icono a la derecha */
  rightIcon?: React.ReactNode
  /** Texto de ayuda debajo del input */
  helperText?: string
  /** Texto de error debajo del input */
  errorText?: string
  /** Label del input */
  label?: string
  /** Indica si el label es requerido */
  required?: boolean
  /** Wrapper className */
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      state,
      leftIcon,
      rightIcon,
      helperText,
      errorText,
      label,
      required,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type

    // Auto-detectar estado de error
    const finalState = errorText ? "error" : state

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            data-slot="input"
            className={cn(
              inputVariants({ variant, inputSize, state: finalState }),
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              className
            )}
            {...props}
          />

          {/* Right Icon or Password Toggle */}
          {(rightIcon || isPassword) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <div className="text-gray-400">{rightIcon}</div>
              )}
            </div>
          )}
        </div>

        {/* Helper Text or Error Text */}
        {(helperText || errorText) && (
          <p
            className={cn(
              "text-xs mt-1.5",
              errorText
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {errorText || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

// Input Group Component for multiple inputs in a row
function InputGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 w-full [&>*]:flex-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Input Addon Component (for prefix/suffix text)
function InputAddon({
  className,
  position = "left",
  ...props
}: React.ComponentProps<"div"> & { position?: "left" | "right" }) {
  return (
    <div
      className={cn(
        "flex items-center px-3 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 border border-input",
        position === "left" ? "rounded-l-md border-r-0" : "rounded-r-md border-l-0",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputGroup, InputAddon, inputVariants }
export type { InputProps }
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap gap-1 rounded-lg text-sm shadow-neutral-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 md:[&_svg]:size-4 [&_svg]:shrink-0 duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-800/60 border border-neutral-800 shadow-sm hover:bg-neutral-800",
        success:
          "bg-confirm border border-confirm/80 text-zinc-100 hover:text-zinc-200 shadow-sm hover:bg-confirm/90",
        destructive:
          "bg-destructive border border-destructive/80 text-zinc-100 hover:text-zinc-200 shadow-sm hover:bg-destructive/90",
        outline:
          "text-zinc-300 bg-transparent border border-neutral-800 shadow-sm hover:bg-neutral-900/90",
        primary:
          "bg-primary text-zinc-100 hover:text-zinc-200 shadow-sm hover:bg-primary/80",
        ghost: "text-zinc-300 bg-transparent hover:bg-neutral-900/90",
        link: "text-zinc-300 underline-offset-4 hover:underline decoration-1",
      },
      size: {
        default: "h-9 px-3 py-2 gap-1",
        sm: "rounded-lg px-2 py-1 text-base",
        lg: "h-10 rounded-lg px-3 py-2 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

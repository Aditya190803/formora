import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-ink text-bg hover:brightness-110",
        destructive: "bg-danger text-bg hover:brightness-110",
        outline: "border border-ink bg-transparent hover:bg-ink hover:text-bg",
        secondary: "bg-muted text-ink hover:bg-ink/5 hover:border-ink border-transparent border",
        ghost: "hover:bg-muted text-ink",
        link: "text-ink underline-offset-8 hover:underline italic",
      },
      size: {
        default: "h-11 px-8 py-3",
        sm: "h-9 px-4 text-[10px]",
        lg: "h-14 px-12 text-[12px] tracking-[0.3em]",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

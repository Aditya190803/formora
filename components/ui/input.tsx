import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full border-b border-muted bg-transparent px-0 py-2 text-base font-body transition-all duration-300 placeholder:text-muted/40 outline-none focus:border-ink disabled:cursor-not-allowed disabled:opacity-30 md:text-sm",
        "aria-invalid:border-danger",
        className
      )}
      {...props}
    />
  )
}

export { Input }

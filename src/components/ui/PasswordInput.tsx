"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HeightChange } from "@/components/ui/FramerMotion"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="space-y-1.5 w-full">
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "flex h-14 w-full rounded-2xl bg-muted/30 border-none px-12 py-1 text-sm shadow-inner transition-all focus:bg-background focus:ring-2 focus:ring-primary/10 font-bold placeholder:text-muted-foreground/40 disabled:cursor-not-allowed disabled:opacity-50",
              error && "ring-2 ring-rose-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-primary/10 text-muted-foreground/40 hover:text-primary transition-all active:scale-90 focus-visible:ring-0"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <HeightChange isVisible={!!error}>
          <div className="flex items-center gap-1.5 ml-2 mt-1">
             <div className="w-1 h-1 rounded-full bg-rose-500" />
             <p className="text-[10px] font-bold text-rose-500">
               {error}
             </p>
          </div>
        </HeightChange>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

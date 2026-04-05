"use client"

import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
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
      <div className="w-full">
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "flex h-14 w-full rounded-2xl bg-muted/30 border-none pl-12 pr-12 py-1 text-sm shadow-inner transition-all focus:bg-background focus:ring-2 focus:ring-primary/10 font-bold placeholder:text-muted-foreground/40 disabled:cursor-not-allowed disabled:opacity-50",
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
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-primary/10 text-muted-foreground/40 hover:text-primary focus-visible:ring-0 shadow-none border-none p-0 flex items-center justify-center transition-none active:scale-100"
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
        {error && (
          <div className="flex items-center gap-1.5 ml-2 mt-2">
             <div className="w-1 h-1 rounded-full bg-rose-500" />
             <p className="text-[10px] font-bold text-rose-500">
               {error}
             </p>
          </div>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

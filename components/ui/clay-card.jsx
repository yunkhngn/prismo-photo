import * as React from "react"
import { cn } from "@/lib/utils"

const ClayCard = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-3xl bg-white border-2 border-slate-900 shadow-[0px_4px_0px_0px_#0f172a] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#0f172a]",
            className
        )}
        {...props}
    />
))
ClayCard.displayName = "ClayCard"

export { ClayCard }

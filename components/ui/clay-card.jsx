import * as React from "react"
import { cn } from "@/lib/utils"

const ClayCard = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-[32px] bg-white border-2 border-slate-100 shadow-[0px_10px_0px_rgba(15,23,42,0.08)] transition-transform hover:scale-[1.01]",
            className
        )}
        {...props}
    />
))
ClayCard.displayName = "ClayCard"

export { ClayCard }

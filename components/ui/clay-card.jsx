import * as React from "react"
import { cn } from "@/lib/utils"

const ClayCard = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl bg-white border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] transition-all duration-200 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748]",
            className
        )}
        {...props}
    />
))
ClayCard.displayName = "ClayCard"

export { ClayCard }

import * as React from "react"
import { cn } from "@/lib/utils"

const ClayCard = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-md bg-white border-2 border-[#2D3748] shadow-[0px_4px_0px_0px_#2D3748] transition-all duration-200 hover:translate-y-[2px] hover:shadow-[0px_2px_0px_0px_#2D3748]",
            className
        )}
        {...props}
    />
))
ClayCard.displayName = "ClayCard"

export { ClayCard }

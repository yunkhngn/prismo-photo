import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const clayButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[4px] active:shadow-none",
    {
        variants: {
            variant: {
                primary:
                    "bg-[#FFCFE3] text-slate-900 shadow-[0px_6px_0px_rgba(15,23,42,0.15)] hover:bg-[#FFD9E8]",
                secondary:
                    "bg-[#BDE7FF] text-slate-900 shadow-[0px_6px_0px_rgba(15,23,42,0.15)] hover:bg-[#C9ECFF]",
                success:
                    "bg-[#22C55E] text-white shadow-[0px_6px_0px_rgba(15,23,42,0.2)] hover:bg-[#28D166]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "h-12 px-8 py-2",
                sm: "h-10 px-6",
                lg: "h-14 px-10 text-base",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
)

const ClayButton = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(clayButtonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
ClayButton.displayName = "ClayButton"

export { ClayButton, clayButtonVariants }

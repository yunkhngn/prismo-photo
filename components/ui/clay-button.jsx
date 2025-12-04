import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const clayButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-slate-900 active:translate-y-[4px] active:shadow-none",
    {
        variants: {
            variant: {
                primary:
                    "bg-[#FFCFE3] text-slate-900 shadow-[0px_4px_0px_0px_#0f172a] hover:bg-[#FFD9E8] hover:-translate-y-[1px] hover:shadow-[0px_5px_0px_0px_#0f172a] active:translate-y-[4px]",
                secondary:
                    "bg-[#BDE7FF] text-slate-900 shadow-[0px_4px_0px_0px_#0f172a] hover:bg-[#C9ECFF] hover:-translate-y-[1px] hover:shadow-[0px_5px_0px_0px_#0f172a] active:translate-y-[4px]",
                success:
                    "bg-[#22C55E] text-white shadow-[0px_4px_0px_0px_#0f172a] hover:bg-[#28D166] hover:-translate-y-[1px] hover:shadow-[0px_5px_0px_0px_#0f172a] active:translate-y-[4px]",
                ghost: "border-transparent shadow-none hover:bg-slate-100 active:translate-y-0 active:shadow-none",
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

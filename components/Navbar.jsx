"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ClayButton } from "@/components/ui/clay-button"

export function Navbar() {
    const pathname = usePathname()

    const navItems = [
        { name: "Homepage", href: "/" },
        { name: "Photobooth", href: "/photobooth" },
        { name: "Frame Library", href: "/frames" },
        { name: "About Contributor", href: "/about" },
    ]

    return (
        <nav className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="bg-white border-[3px] border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] rounded-full px-8 py-4 flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f172a]">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#FFCFE3] rounded-xl border-[3px] border-slate-900 flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#0f172a] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all">
                        P
                    </div>
                    <span className="font-black text-xl tracking-tight text-slate-900">Prismo</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "text-base font-bold transition-colors hover:text-[#FFCFE3]",
                                pathname === item.href ? "text-slate-900" : "text-slate-500"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-8">
                    <Link href="/login" className="font-bold text-slate-900 hover:text-[#FFCFE3] transition-colors">
                        Log In
                    </Link>
                    <ClayButton variant="success" size="lg" className="rounded-2xl h-12 px-8 text-base border-[3px] shadow-[4px_4px_0px_0px_#0f172a]">
                        Start Free
                    </ClayButton>
                </div>
            </div>
        </nav>
    )
}

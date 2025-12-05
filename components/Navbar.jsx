"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ClayButton } from "@/components/ui/clay-button"
import { Play, Menu, X } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()

    const navItems = [
        { name: "Homepage", href: "/" },
        { name: "Photobooth", href: "/photobooth" },
        { name: "Frame Library", href: "/frames" },
        { name: "About Contributor", href: "/about" },
    ]

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    return (
        <nav className="w-full py-4 sticky top-0 z-50 pointer-events-none">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="bg-white border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] rounded-2xl px-4 md:px-8 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748] pointer-events-auto relative">

                    <div className="w-full md:w-auto flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="w-10 h-10 bg-[#FFCFE3] rounded-xl border-[3px] border-[#2D3748] flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#2D3748] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#2D3748] transition-all">
                                <Play className="w-6 h-6 text-[#2D3748]" />
                            </div>
                            <span className="font-black text-lg md:text-xl tracking-tight text-[#2D3748]">Prismo Photobooth</span>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-[#2D3748]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-base font-bold transition-colors hover:text-[#FFCFE3]",
                                    pathname === item.href ? "text-[#2D3748]" : "text-slate-500"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side (Desktop) */}
                    <div className="hidden md:flex items-center gap-8">
                        <ClayButton variant="success" size="lg" className="rounded-2xl h-12 px-8 text-base border-[3px] shadow-[4px_4px_0px_0px_#2D3748]" asChild>
                            <Link href="/photobooth">
                                Start Now
                            </Link>
                        </ClayButton>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="w-full md:hidden pt-6 pb-2 flex flex-col gap-4 animate-in slide-in-from-top-2">
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "text-base font-bold py-3 px-4 rounded-xl transition-colors",
                                            pathname === item.href
                                                ? "bg-[#FFCFE3]/30 text-[#2D3748]"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-[#2D3748]"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <ClayButton variant="success" size="lg" className="w-full rounded-xl h-12 text-base border-[3px] shadow-[3px_3px_0px_0px_#2D3748]" asChild>
                                <Link href="/photobooth" onClick={() => setIsMobileMenuOpen(false)}>
                                    Start Now
                                </Link>
                            </ClayButton>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

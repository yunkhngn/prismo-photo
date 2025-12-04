"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ClayButton } from "@/components/ui/clay-button"
import { Camera } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()

    const navItems = [
        { name: "Homepage", href: "/" },
        { name: "Photobooth", href: "/photobooth" },
        { name: "Frame Library", href: "/frames" },
        { name: "About Contributor", href: "/about" },
    ]

    return (
        <nav className="w-full py-4">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="bg-white border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] rounded-2xl px-8 py-5 flex items-center justify-between transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-[#FFCFE3] rounded-xl border-[3px] border-[#2D3748] flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#2D3748] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#2D3748] transition-all">
                            <Camera />
                        </div>
                        <span className="font-black text-xl tracking-tight text-[#2D3748]">Prismo</span>
                    </Link>

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

                    {/* Right Side */}
                    <div className="flex items-center gap-8">
                        <ClayButton variant="success" size="lg" className="rounded-2xl h-12 px-8 text-base border-[3px] shadow-[4px_4px_0px_0px_#2D3748]" asChild>
                            <Link href="/photobooth">
                                Start Now
                            </Link>
                        </ClayButton>
                    </div>
                </div>
            </div>
        </nav>
    )
}

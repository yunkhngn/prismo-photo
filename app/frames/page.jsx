"use client"

import { FRAMES } from "@/lib/frames"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { ArrowRight, Sparkles, Lightbulb, Palette } from "lucide-react"
import Link from "next/link"

export default function FramePage() {
    // Filter out 'none' frame for the library view
    const displayFrames = FRAMES.filter(f => f.id !== 'none')

    return (
        <div className="min-h-screen bg-[#fff9f5] font-sans text-[#2D3748]">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFCFE3] border-2 border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748] mb-4">
                        <Sparkles className="w-4 h-4 text-[#2D3748]" />
                        <span className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider">Collection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#2D3748]">Frame Library</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Explore our collection of handcrafted frames designed to make your moments shine.
                        From cute and playful to cool and vintage, we have something for everyone.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {displayFrames.map((frame) => (
                        <ClayCard key={frame.id} className="flex flex-col p-4 group">
                            <div className="aspect-[1/3] bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200 mb-4 relative group-hover:border-[#FFCFE3] transition-colors">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={frame.thumbnailPath}
                                    alt={frame.name}
                                    className="w-full h-full object-contain p-4"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-lg text-[#2D3748]">{frame.name}</h3>
                                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-500">
                                        {frame.category || 'Standard'}
                                    </span>
                                </div>

                                <Link href="/photobooth" className="block">
                                    <ClayButton className="w-full group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_0px_#2D3748] transition-all">
                                        Use this Frame <ArrowRight className="w-4 h-4 ml-2" />
                                    </ClayButton>
                                </Link>
                            </div>
                        </ClayCard>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20">
                    <ClayCard className="relative overflow-hidden p-8 md:p-12 bg-white border-4 border-[#BDE7FF] max-w-4xl mx-auto">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="w-24 h-24 bg-[#BDE7FF] rounded-full flex items-center justify-center border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] flex-shrink-0 rotate-[-6deg]">
                                <Lightbulb className="w-10 h-10 text-[#2D3748]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-[#2D3748] mb-3">Have a brilliant idea?</h2>
                                <p className="text-lg text-slate-600 mb-6 font-medium">
                                    We&apos;d love to hear your thoughts! If you have a specific frame design in mind, drop us a suggestion.
                                </p>
                                <Link href="https://github.com/yunkhngn/prismo-photo">
                                    <ClayButton size="lg" className="bg-[#FFCFE3] hover:bg-[#FFCFE3]/90 text-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748]">
                                        Contribute to repository
                                    </ClayButton>
                                </Link>
                            </div>
                        </div>

                        {/* Decorative background elements */}
                        <div className="absolute -top-6 -right-6 text-[#BDE7FF]/20 transform rotate-12 pointer-events-none">
                            <Palette className="w-48 h-48" />
                        </div>
                    </ClayCard>
                </div>
            </div>
        </div>
    )
}

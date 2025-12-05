"use client"

import { ClayCard } from "@/components/ui/clay-card"
import { ScrollText, AlertTriangle, Copyright, CheckCircle } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] font-sans text-[#2D3748]">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">

                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#2D3748]">Terms of Service</h1>
                    <p className="text-xl text-slate-600 font-medium">
                        Please read these terms carefully before using Prismo Photobooth.
                    </p>
                </div>

                <ClayCard className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#BDE7FF] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748] flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-[#2D3748]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#2D3748] mb-2">1. Acceptance of Terms</h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                By accessing and using Prismo Photobooth, you accept and agree to be bound by the terms and provision of this agreement.
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-0.5 bg-slate-100 my-6" />

                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#FDE047] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748] flex-shrink-0">
                            <ScrollText className="w-5 h-5 text-[#2D3748]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#2D3748] mb-2">2. Usage License</h2>
                            <p className="text-slate-600 font-medium leading-relaxed mb-4">
                                Prismo Photobooth is free to use for personal and non-commercial purposes. You are free to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium ml-2">
                                <li>Take photos and record videos using the provided tools.</li>
                                <li>Download and share your creations.</li>
                                <li>Use the generated content for personal use.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="w-full h-0.5 bg-slate-100 my-6" />

                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#FFCFE3] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748] flex-shrink-0">
                            <Copyright className="w-5 h-5 text-[#2D3748]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#2D3748] mb-2">3. Intellectual Property</h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                The photos and videos you create are yours. We claim no ownership over your content.
                                The application code, design, and assets (including frames and stickers provided by us) remain the property of Prismo Photobooth and its contributors.
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-0.5 bg-slate-100 my-6" />

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748] flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-[#2D3748]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#2D3748] mb-2">4. Disclaimer</h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                The materials on Prismo Photobooth are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </div>
                    </div>
                </ClayCard>

                <div className="text-center pt-8 text-slate-500 font-bold text-sm">
                    Last updated: December 2025
                </div>

            </div>
        </div>
    )
}

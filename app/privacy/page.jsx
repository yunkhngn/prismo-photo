"use client"

import { ClayCard } from "@/components/ui/clay-card"
import { Shield, Lock, Eye, Server } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] font-sans text-[#2D3748]">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">

                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#2D3748]">Privacy Policy</h1>
                    <p className="text-xl text-slate-600 font-medium">
                        Your privacy is our top priority. Here's how we handle your data.
                    </p>
                </div>

                {/* Key Point: Local Processing */}
                <ClayCard className="p-8 bg-[#86EFAC]/20 border-[#86EFAC]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#86EFAC] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748] flex-shrink-0">
                            <Shield className="w-6 h-6 text-[#2D3748]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#2D3748] mb-2">100% Local Processing</h2>
                            <p className="text-lg text-slate-700 font-medium leading-relaxed">
                                Prismo Photobooth operates entirely within your web browser.
                                <strong> We do not upload, store, or process your photos on any server.</strong>
                                Your images never leave your device unless you explicitly choose to share them yourself.
                            </p>
                        </div>
                    </div>
                </ClayCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ClayCard className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-6 h-6 text-[#2D3748]" />
                            <h3 className="text-xl font-black">Data Collection</h3>
                        </div>
                        <p className="text-slate-600 font-medium">
                            We do not collect any personal information. We don't use cookies for tracking or analytics. The only data stored is your local preferences (like selected frame) which stays on your device.
                        </p>
                    </ClayCard>

                    <ClayCard className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="w-6 h-6 text-[#2D3748]" />
                            <h3 className="text-xl font-black">Camera Access</h3>
                        </div>
                        <p className="text-slate-600 font-medium">
                            We request camera access solely for the purpose of the photobooth functionality. The camera feed is processed locally and is never recorded or transmitted by us.
                        </p>
                    </ClayCard>
                </div>

                <ClayCard className="p-8">
                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5" />
                        Third-Party Services
                    </h3>
                    <p className="text-slate-600 font-medium mb-4">
                        This website is hosted on Vercel. Please refer to Vercel's privacy policy for information regarding their server logs and data handling.
                    </p>
                    <p className="text-slate-600 font-medium">
                        We use no other third-party analytics or tracking services.
                    </p>
                </ClayCard>

                <div className="text-center pt-8 text-slate-500 font-bold text-sm">
                    Last updated: December 2025
                </div>

            </div>
        </div>
    )
}

"use client"

import React, { useRef } from 'react'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { CanvasRenderer } from './CanvasRenderer'
import { ClayCard } from '@/components/ui/clay-card'
import { ClayButton } from '@/components/ui/clay-button'
import { Download, ArrowLeft, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

import { FRAMES } from '@/lib/frames'

export function ExportView() {
    const { setStep, selectedFrameId, setFrame, frames: storeFrames, setCustomFrame } = usePhotoboothStore()
    const canvasRef = useRef(null)
    const fileInputRef = useRef(null)

    // Use FRAMES constant for now, or storeFrames if populated
    const availableFrames = FRAMES

    const handleCustomFrameUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setCustomFrame(url)
        }
    }

    const handleDownload = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.exportDataURL(2) // 2x multiplier for better quality
            if (dataUrl) {
                const link = document.createElement('a')
                link.href = dataUrl
                link.download = `prismo-booth-${Date.now()}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Left: Preview */}
            <div className="lg:col-span-5 flex flex-col items-center gap-6">
                <ClayCard className="p-4 bg-slate-100 flex items-center justify-center shadow-inner">
                    <CanvasRenderer
                        ref={canvasRef}
                        width={300}
                        height={900}
                        className="shadow-lg rounded-sm"
                    />
                </ClayCard>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCustomFrameUpload}
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex gap-4">
                    <ClayButton variant="ghost" onClick={() => setStep('CAPTURE')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </ClayButton>
                    <ClayButton onClick={() => fileInputRef.current?.click()} variant="secondary">
                        <Upload className="w-4 h-4 mr-2" />
                        Custom Frame
                    </ClayButton>
                    <ClayButton onClick={handleDownload} size="lg" variant="success">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </ClayButton>
                </div>
            </div>

            {/* Right: Frame Selection */}
            <div className="lg:col-span-7">
                <ClayCard className="p-6 h-full">
                    <h2 className="text-2xl font-bold mb-4">Choose a Frame</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2">
                        {availableFrames.map((frame) => (
                            <div
                                key={frame.id}
                                onClick={() => setFrame(frame.id === 'none' ? null : frame.id)}
                                className={cn(
                                    "aspect-[1/3] bg-slate-50 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105",
                                    (selectedFrameId === frame.id || (!selectedFrameId && frame.id === 'none'))
                                        ? "border-[#FFCFE3] shadow-[0_0_0_4px_rgba(255,207,227,0.4)]"
                                        : "border-slate-200 hover:border-[#FFCFE3]"
                                )}
                            >
                                {frame.thumbnailPath ? (
                                    <img src={frame.thumbnailPath} alt={frame.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <span className="text-slate-400 font-medium">None</span>
                                )}
                                <div className="mt-2 text-sm font-bold text-slate-700">{frame.name}</div>
                            </div>
                        ))}
                    </div>
                </ClayCard>
            </div>
        </div>
    )
}

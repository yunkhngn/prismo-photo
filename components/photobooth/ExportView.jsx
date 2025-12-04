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
            <div className="lg:col-span-4 flex flex-col items-center gap-6">
                <ClayCard className="p-3 bg-slate-100 flex items-center justify-center shadow-inner w-fit">
                    <CanvasRenderer
                        ref={canvasRef}
                        width={300}
                        height={900}
                        className="shadow-lg rounded-sm max-w-full h-auto"
                    />
                </ClayCard>



                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]">
                    <ClayButton variant="ghost" onClick={() => setStep('CAPTURE')} className="hover:bg-slate-100 flex-1">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </ClayButton>
                </div>
                <ClayButton onClick={handleDownload} size="lg" variant="success" className="w-full max-w-[320px] shadow-[4px_4px_0px_0px_#2D3748] hover:shadow-[2px_2px_0px_0px_#2D3748] hover:translate-y-1 transition-all">
                    <Download className="w-4 h-4 mr-2" />
                    Download Photo
                </ClayButton>
            </div>

            {/* Right: Frame Selection */}
            <div className="lg:col-span-8 lg:relative min-h-[500px] lg:min-h-0">
                <div className="lg:absolute lg:inset-0">
                    <ClayCard className="p-6 h-full flex flex-col">
                        <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Choose a Frame</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto p-6 flex-grow min-h-0 -mx-6">
                            {availableFrames.map((frame) => (
                                <div
                                    key={frame.id}
                                    onClick={() => setFrame(frame.id === 'none' ? null : frame.id)}
                                    className={cn(
                                        "aspect-[1/3] rounded-2xl border-[3px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group p-2",
                                        (selectedFrameId === frame.id || (!selectedFrameId && frame.id === 'none'))
                                            ? "bg-white border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] translate-y-1"
                                            : "bg-white border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748]"
                                    )}
                                >
                                    <div className={cn(
                                        "w-full flex-1 rounded-xl overflow-hidden border-2",
                                        (selectedFrameId === frame.id || (!selectedFrameId && frame.id === 'none'))
                                            ? "border-[#FFCFE3] ring-2 ring-[#FFCFE3] ring-offset-1"
                                            : "border-slate-100 group-hover:border-[#FFCFE3]"
                                    )}>
                                        {frame.thumbnailPath ? (
                                            <img src={frame.thumbnailPath} alt={frame.name} className="w-full h-full object-contain bg-slate-50" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 font-medium">None</div>
                                        )}
                                    </div>
                                    <div className="mt-3 text-sm font-bold text-[#2D3748]">{frame.name}</div>
                                </div>
                            ))}
                        </div>
                    </ClayCard>
                </div>
            </div>
        </div>
    )
}

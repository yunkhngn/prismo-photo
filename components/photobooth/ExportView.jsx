"use client"

import React, { useRef } from 'react'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { CanvasRenderer } from './CanvasRenderer'
import { ClayCard } from '@/components/ui/clay-card'
import { ClayButton } from '@/components/ui/clay-button'
import { Download, ArrowLeft, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

import { FRAMES } from '@/lib/frames'

export function ExportView() {
    const { setStep, selectedFrameId, setFrame } = usePhotoboothStore()
    const canvasRef = useRef(null)

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
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-300 p-8 relative group">
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

                {usePhotoboothStore(state => state.recordedVideoBlob) && (
                    <ClayCard className="w-full max-w-[320px] p-0 overflow-hidden bg-black aspect-video relative group mt-2">
                        <VideoPlayer blob={usePhotoboothStore.getState().recordedVideoBlob} />
                    </ClayCard>
                )}
            </div>

            {/* Right Column: Frame Selection & Actions */}
            <div className="lg:col-span-6 flex flex-col gap-6 lg:relative min-h-[500px] lg:min-h-0">
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
                                        "w-full flex-1 rounded-xl overflow-hidden border-2 border-slate-100"
                                    )}>
                                        {frame.thumbnailPath ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
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

function VideoPlayer({ blob }) {
    const videoRef = useRef(null)
    const [isPlaying, setIsPlaying] = React.useState(true)
    const [url, setUrl] = React.useState(null)

    React.useEffect(() => {
        if (blob) {
            const newUrl = URL.createObjectURL(blob)
            setUrl(newUrl)
            return () => URL.revokeObjectURL(newUrl)
        }
    }, [blob])

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleDownload = () => {
        if (url && blob) {
            const a = document.createElement('a')
            a.href = url
            const ext = blob.type.includes('mp4') ? 'mp4' : 'webm'
            a.download = `prismo-recap-${Date.now()}.${ext}`
            a.click()
        }
    }

    if (!url) return null

    return (
        <>
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain"
                autoPlay
                loop
                playsInline
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Custom Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!isPlaying && (
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-in zoom-in duration-200">
                        <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                </button>

                <ClayButton
                    size="sm"
                    variant="success"
                    onClick={handleDownload}
                    className="shadow-[2px_2px_0px_0px_#2D3748] active:translate-y-1 active:shadow-none"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Save Video
                </ClayButton>
            </div>
        </>
    )
}

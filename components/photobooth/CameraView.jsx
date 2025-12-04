"use client"

import React, { useEffect, useState } from 'react'
import { useCamera } from '@/hooks/useCamera'
import { ClayCard } from '@/components/ui/clay-card'
import { ClayButton } from '@/components/ui/clay-button'
import { CameraIcon, AlertCircle } from 'lucide-react'

import { FILTERS } from './FilterSelector'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'

export function CameraView({ onCapture, isAutoMode = false, isCapturing = false }) {
    const { videoRef, startCamera, permissionStatus, captureImage } = useCamera()
    const { activeFilterId, countdownDuration } = usePhotoboothStore()
    const [countdown, setCountdown] = useState(null)

    const activeFilter = FILTERS.find(f => f.id === activeFilterId) || FILTERS[0]

    useEffect(() => {
        startCamera()
    }, [startCamera])

    // Handle external capture trigger
    useEffect(() => {
        if (isCapturing && countdown === null) {
            startCountdown()
        }
    }, [isCapturing])

    const startCountdown = () => {
        setCountdown(countdownDuration)
    }

    useEffect(() => {
        if (countdown === null) return

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            // Countdown finished, capture!
            // Note: The captureImage function captures raw video. 
            // We might need to apply the filter to the canvas context or post-process it.
            // For MVP, we can capture raw and apply filter in CSS or Fabric later.
            // BUT, user expects the captured image to have the filter.
            // Let's modify useCamera or handle it here.
            // Actually, useCamera captures raw video frame.
            // We should pass the filter to captureImage or apply it to the returned data URL.
            // For now, let's capture raw and store the filterId with the slot.
            // The SlotSidebar and CanvasRenderer will apply the filter.

            const imageData = captureImage()
            if (imageData) {
                onCapture(imageData)
            }
            setCountdown(null)
        }
    }, [countdown, captureImage, onCapture])

    return (
        <ClayCard className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
            {permissionStatus === 'denied' ? (
                <div className="text-center p-6 bg-white/90 rounded-xl">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                    <p className="font-bold text-[#2D3748]">Camera Access Denied</p>
                    <p className="text-sm text-slate-600">Please allow camera access or upload photos manually.</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100 transition-[filter] duration-300"
                        style={{ filter: activeFilter.css }}
                    />

                    {/* Countdown Overlay */}
                    {countdown !== null && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-10">
                            <span className="text-[120px] font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] animate-in zoom-in duration-300">
                                {countdown === 0 ? 'CHEESE!' : countdown}
                            </span>
                        </div>
                    )}
                </>
            )}
        </ClayCard>
    )
}

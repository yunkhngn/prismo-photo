"use client"

import React, { useEffect, useState } from 'react'
import { useCamera } from '@/hooks/useCamera'
import { ClayCard } from '@/components/ui/clay-card'
import { AlertCircle } from 'lucide-react'

import { FILTERS } from './FilterSelector'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'

export function CameraView({ onCapture, isCapturing = false }) {
    const { videoRef, startCamera, permissionStatus, captureImage, stream } = useCamera()
    const { activeFilterId, countdownDuration } = usePhotoboothStore()
    const [countdown, setCountdown] = useState(null)

    const activeFilter = FILTERS.find(f => f.id === activeFilterId) || FILTERS[0]

    const { isVideoRecapEnabled, setRecordedVideoBlob } = usePhotoboothStore()
    const mediaRecorderRef = React.useRef(null)
    const chunksRef = React.useRef([])

    useEffect(() => {
        startCamera()
    }, [startCamera])

    // Video Recording Logic
    // Video Recording Logic
    useEffect(() => {
        if (!isVideoRecapEnabled || !stream) return

        const video = videoRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        let intervalId

        // Set canvas size to match video
        const setupCanvas = () => {
            if (!video) return
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
        }

        if (video && video.readyState >= 2) {
            setupCanvas()
        } else if (video) {
            video.onloadedmetadata = setupCanvas
        }

        // Draw to canvas at 15 FPS
        const drawFrame = () => {
            if (!video || canvas.width === 0 || canvas.height === 0) return

            ctx.filter = activeFilter.css !== 'none' ? activeFilter.css : 'none'

            // Mirror effect
            ctx.translate(canvas.width, 0)
            ctx.scale(-1, 1)
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform
        }

        intervalId = setInterval(drawFrame, 1000 / 5) // 5 FPS

        // Capture stream from canvas
        const streamCanvas = canvas.captureStream(5)

        // Prefer MP4, fallback to WebM
        const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm'

        const mediaRecorder = new MediaRecorder(streamCanvas, {
            mimeType,
            videoBitsPerSecond: 1000000 // 1 Mbps
        })

        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data)
            }
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mimeType })
            // Store the mimeType too if needed, but blob has it
            setRecordedVideoBlob(blob)
        }

        mediaRecorder.start()

        return () => {
            clearInterval(intervalId)
            if (mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop()
            }
        }
    }, [isVideoRecapEnabled, stream, setRecordedVideoBlob, activeFilter.css, videoRef])

    // Handle external capture trigger
    const startCountdown = React.useCallback(() => {
        setCountdown(countdownDuration)
    }, [countdownDuration])

    useEffect(() => {
        if (isCapturing && countdown === null) {
            startCountdown()
        }
    }, [isCapturing, countdown, startCountdown])

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

            // Capture with filter and mirror
            if (videoRef.current) {
                const video = videoRef.current
                const canvas = document.createElement('canvas')
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                const ctx = canvas.getContext('2d')

                // Apply Filter
                ctx.filter = activeFilter.css !== 'none' ? activeFilter.css : 'none'

                // Mirror
                ctx.translate(canvas.width, 0)
                ctx.scale(-1, 1)

                ctx.drawImage(video, 0, 0)

                const imageData = canvas.toDataURL('image/png')
                onCapture(imageData)
            }
            setCountdown(null)
        }
    }, [countdown, captureImage, onCapture, activeFilter.css, videoRef])

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

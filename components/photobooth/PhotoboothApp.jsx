"use client"

import * as React from "react"
import { usePhotoboothStore } from "@/store/usePhotoboothStore"
import { PrivacyDialog } from "./PrivacyDialog"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { CameraView } from "./CameraView"
import { SlotSidebar } from "./SlotSidebar"
import { FilterSelector } from "./FilterSelector"
import { ExportView } from "./ExportView"

export function PhotoboothApp() {
    const { currentStep, slots, updateSlot, setStep, countdownDuration } = usePhotoboothStore()
    const [isCapturing, setIsCapturing] = React.useState(false)
    const [isAutoMode, setIsAutoMode] = React.useState(false)

    const getNextEmptySlotIndex = () => {
        return slots.findIndex(s => !s.imageUrl)
    }

    const handleCapture = (imageData) => {
        const nextIndex = getNextEmptySlotIndex()
        if (nextIndex !== -1) {
            updateSlot(nextIndex, imageData)

            // If AUTO mode and there are more empty slots, continue capturing
            if (isAutoMode) {
                // Check if there are more slots AFTER this one
                const remainingSlots = slots.slice(nextIndex + 1).filter(s => !s.imageUrl)
                if (remainingSlots.length > 0 || (slots[nextIndex + 1] && !slots[nextIndex + 1].imageUrl)) {
                    // Small delay before next capture to allow UI to update
                    setTimeout(() => {
                        setIsCapturing(true)
                    }, 500)
                } else {
                    setIsAutoMode(false)
                }
            }
        }
        setIsCapturing(false)
    }

    const triggerManualCapture = () => {
        if (getNextEmptySlotIndex() !== -1) {
            setIsCapturing(true)
        }
    }

    const triggerAutoCapture = () => {
        if (getNextEmptySlotIndex() !== -1) {
            setIsAutoMode(true)
            setIsCapturing(true)
        }
    }

    const allSlotsFilled = slots.every(s => s.imageUrl)

    return (
        <div className="min-h-screen bg-[#fff9f5] p-4 md:p-8 font-sans text-[#2D3748]">
            <PrivacyDialog />

            {/* Toolbar / Header Controls */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BDE7FF] border-2 border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748]">
                        <span className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider">Photobooth Mode</span>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border-[3px] border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748]">
                        <label className="text-sm font-bold text-slate-600 cursor-pointer select-none" htmlFor="video-recap">Video Recap</label>
                        <input
                            id="video-recap"
                            type="checkbox"
                            className="toggle toggle-primary h-5 w-5 accent-[#FFCFE3] cursor-pointer"
                        />
                    </div>
                    {currentStep === 'CAPTURE' && allSlotsFilled && (
                        <ClayButton onClick={() => setStep('EXPORT')} variant="success" className="animate-in fade-in zoom-in shadow-[4px_4px_0px_0px_#2D3748]">
                            Next Step →
                        </ClayButton>
                    )}
                </div>
            </div>

            {currentStep === 'CAPTURE' ? (
                <main className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Main Action Area (Camera or Preview) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <CameraView
                            isCapturing={isCapturing}
                            onCapture={handleCapture}
                        />

                        <ClayCard className="p-4">
                            <FilterSelector />
                        </ClayCard>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            {/* Timer Dropdown */}
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white pl-4 pr-10 py-4 rounded-2xl border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] font-bold text-[#2D3748] focus:outline-none cursor-pointer hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all h-full"
                                    value={countdownDuration}
                                    onChange={(e) => usePhotoboothStore.getState().setCountdownDuration(Number(e.target.value))}
                                >
                                    <option value={3}>3s Timer</option>
                                    <option value={5}>5s Timer</option>
                                    <option value={10}>10s Timer</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.41 0.589996L6 5.17L10.59 0.589996L12 2L6 8L0 2L1.41 0.589996Z" fill="#2D3748" />
                                    </svg>
                                </div>
                            </div>

                            <ClayButton
                                size="lg"
                                onClick={triggerManualCapture}
                                disabled={isCapturing || allSlotsFilled}
                                className="w-full md:w-auto px-8 py-4 text-lg shadow-[4px_4px_0px_0px_#2D3748] bg-[#FFCFE3] hover:bg-[#FFCFE3]/90"
                            >
                                Manual Capture
                            </ClayButton>
                            <ClayButton
                                variant="secondary"
                                size="lg"
                                onClick={triggerAutoCapture}
                                disabled={isCapturing || allSlotsFilled}
                                className="w-full md:w-auto px-8 py-4 text-lg shadow-[4px_4px_0px_0px_#2D3748] bg-[#BDE7FF] hover:bg-[#BDE7FF]/90"
                            >
                                Auto Mode
                            </ClayButton>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Slots or Frame Selection) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                        <SlotSidebar />
                    </div>
                </main>
            ) : (
                <main className="max-w-6xl mx-auto px-4 md:px-8">
                    <ExportView />
                </main>
            )}
        </div>
    )
}

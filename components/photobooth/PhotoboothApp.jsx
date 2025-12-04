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
    const { currentStep, slots, updateSlot, setStep } = usePhotoboothStore()
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
        <div className="min-h-screen bg-[#FFF7EC] p-4 md:p-8 font-sans text-slate-900">
            <PrivacyDialog />

            <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#FFCFE3] rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xl shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                        P
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Prismo Booth</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 mr-4 bg-white/50 px-3 py-1 rounded-full border border-slate-200">
                        <label className="text-sm font-bold text-slate-600 cursor-pointer select-none" htmlFor="video-recap">Video Recap</label>
                        <input
                            id="video-recap"
                            type="checkbox"
                            className="toggle toggle-primary h-5 w-5 accent-[#FFCFE3] cursor-pointer"
                        // For MVP just a visual toggle or connected to store if needed
                        />
                    </div>
                    {currentStep === 'CAPTURE' && allSlotsFilled && (
                        <ClayButton onClick={() => setStep('EXPORT')} variant="success" className="animate-in fade-in zoom-in">
                            Next Step →
                        </ClayButton>
                    )}
                </div>
            </header>

            {currentStep === 'CAPTURE' ? (
                <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Main Action Area (Camera or Preview) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <CameraView
                            isCapturing={isCapturing}
                            onCapture={handleCapture}
                        />

                        <FilterSelector />

                        <div className="flex justify-center gap-4">
                            <ClayButton
                                size="lg"
                                onClick={triggerManualCapture}
                                disabled={isCapturing || allSlotsFilled}
                            >
                                Chụp tay
                            </ClayButton>
                            <ClayButton
                                variant="secondary"
                                size="lg"
                                onClick={triggerAutoCapture}
                                disabled={isCapturing || allSlotsFilled}
                            >
                                AUTO
                            </ClayButton>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Slots or Frame Selection) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-[600px]">
                        <SlotSidebar />
                    </div>
                </main>
            ) : (
                <main className="max-w-6xl mx-auto">
                    <ExportView />
                </main>
            )}
        </div>
    )
}
